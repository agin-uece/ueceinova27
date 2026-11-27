package com.inova27.app.service;

import org.springframework.web.util.HtmlUtils;
import com.inova27.app.dto.authentication.AuthenticationDTO;
import com.inova27.app.dto.authentication.LoginResponseDTO;
import com.inova27.app.dto.authentication.RegisterDTO;
import com.inova27.app.dto.usuarios.UsuarioResponseDTO;
import com.inova27.app.exception.BusinessException;
import com.inova27.app.exception.PermissaoNegadaException;
import com.inova27.app.exception.TokenExpiradoException;
import com.inova27.app.exception.TokenInvalidoException;
import com.inova27.app.model.AcaoAuditoria;
import com.inova27.app.model.EmailType;
import com.inova27.app.model.UserRole;
import com.inova27.app.model.Usuario;
import com.inova27.app.repository.UsuarioRepository;
import com.inova27.app.security.MfaGuard;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final AuthenticationManager authenticationManager;

    private final UsuarioRepository repository;

    private final PasswordEncoder passwordEncoder;

    private final TokenService tokenService;

    private final AuditoriaService auditoriaService;

    private final MfaGuard mfaGuard;

    private final MfaService mfaService;

    private final EmailService emailService;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public LoginResponseDTO login(AuthenticationDTO data) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.email(), data.senha());
        var auth = this.authenticationManager.authenticate(usernamePassword);
        var usuario = (Usuario) auth.getPrincipal();

        if (!usuario.isValidado()) {
            throw new PermissaoNegadaException("Usuário ainda não foi validado por um administrador.");
        }

        // Administradores confirmam o login com um código enviado por e-mail
        verificarMfaAdmin(usuario, data.codigo());

        var token = tokenService.gerarToken(usuario);
        return new LoginResponseDTO(token, usuario.getNome());
    }

    public void solicitarCodigoConfirmacaoCadastro(RegisterDTO data) {
        validarEmailPrincipal(data.email());
        validarEmailSecundario(data.emailSecundario());

        if (data.role() == UserRole.ADMIN) {
            throw new AccessDeniedException("Apenas administradores podem cadastrar novos administradores.");
        }

        if (data.senha() == null || data.senha().isBlank()) {
            throw new IllegalArgumentException("A senha não pode estar vazia para auto-cadastro.");
        }

        String chave = normalizarChaveEmail(data.email());
        if (!mfaService.podeReenviar(MfaService.FINALIDADE_CONFIRMACAO_CADASTRO, chave)) {
            throw new BusinessException("Aguarde 60 segundos antes de solicitar um novo código de confirmação.");
        }

        String codigo = mfaService.gerarCodigo(MfaService.FINALIDADE_CONFIRMACAO_CADASTRO, chave);
        enviarEmailCodigoConfirmacaoCadastro(data.email(), data.nome(), codigo);
    }

    @Transactional
    public UsuarioResponseDTO registrar(RegisterDTO data, Authentication authentication, String pin) {

        validarEmailPrincipal(data.email());
        validarEmailSecundario(data.emailSecundario());

        Usuario usuarioLogado = resolverUsuarioLogado(authentication);
        verificarMfaAdmin(usuarioLogado, pin);

        boolean criadoPorAdmin = (usuarioLogado != null && usuarioLogado.getRole() == UserRole.ADMIN);

        if (!criadoPorAdmin && (data.senha() == null || data.senha().isBlank())) {
            throw new IllegalArgumentException("A senha não pode estar vazia para auto-cadastro.");
        }

        UserRole roleFinal = resolverRole(data, usuarioLogado);

        if (!criadoPorAdmin) {
            validarCodigoConfirmacaoCadastro(data.email(), data.codigoConfirmacao());
        }

        Usuario novoUsuario = new Usuario();
        novoUsuario.setEmail(data.email());
        novoUsuario.setRole(roleFinal);
        novoUsuario.setNome(data.nome());
        novoUsuario.setEmailSecundario(data.emailSecundario());

        if (usuarioLogado != null) {
            novoUsuario.setUserInclusaoId(usuarioLogado.getId());
        }

        if (criadoPorAdmin) {
            // Senha vazia — o usuário vai definir no primeiro acesso
            novoUsuario.setSenha(passwordEncoder.encode(""));
            novoUsuario.setValidado(true);

            // Gera token de primeiro acesso com validade de 7 dias
            String tokenPrimeiroAcesso = tokenService.gerarTokenPrimeiroAcesso();
            novoUsuario.setTokenPrimeiroAcesso(tokenPrimeiroAcesso);
            novoUsuario.setTokenPrimeiroAcessoExpiracao(LocalDateTime.now().plusDays(7));
        } else {
            novoUsuario.setSenha(passwordEncoder.encode(data.senha()));
        }

        novoUsuario = this.repository.save(novoUsuario);

        Long idAutorDaAcao = criadoPorAdmin ? usuarioLogado.getId() : novoUsuario.getId();
        auditoriaService.registrarLog("Usuario", novoUsuario.getId(), AcaoAuditoria.CRIACAO, idAutorDaAcao, novoUsuario);

        if (criadoPorAdmin) {
            enviarEmailPrimeiroAcesso(novoUsuario, novoUsuario.getTokenPrimeiroAcesso());
        } else {
            enviarEmailConfirmacaoCadastro(novoUsuario);
        }

        return new UsuarioResponseDTO(novoUsuario);
    }

    @Transactional
    public void ativarPrimeiroAcesso(String token, String novaSenha) {

        Usuario usuario = repository.findByTokenPrimeiroAcesso(token)
                .orElseThrow(TokenInvalidoException::new);

        if (usuario.getTokenPrimeiroAcessoExpiracao() == null ||
                usuario.getTokenPrimeiroAcessoExpiracao().isBefore(LocalDateTime.now())) {
            throw new TokenExpiradoException();
        }

        usuario.setSenha(passwordEncoder.encode(novaSenha));

        // Invalida o token para que o link não possa ser reutilizado
        usuario.setTokenPrimeiroAcesso(null);
        usuario.setTokenPrimeiroAcessoExpiracao(null);

        repository.save(usuario);
    }

    // ==========================================
    // 🔹 MÉTODOS PRIVADOS DE VALIDAÇÃO
    // ==========================================

    private void validarEmailPrincipal(String email) {
        if (email == null || !email.toLowerCase().endsWith("@uece.br")) {
            throw new IllegalArgumentException("O email deve ser institucional (@uece.br)");
        }

        if (this.repository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("Erro: Este login já está em uso.");
        }
    }

    private void validarEmailSecundario(String emailSecundario) {
        if (emailSecundario == null || emailSecundario.isBlank()) {
            return;
        }

        if (this.repository.findByEmailSecundario(emailSecundario).isPresent()) {
            throw new IllegalArgumentException("Erro: Este e-mail secundário já está em uso por outra conta.");
        }

        if (this.repository.findByEmail(emailSecundario).isPresent()) {
            throw new IllegalArgumentException("Erro: O e-mail secundário fornecido já é o e-mail principal de outra conta.");
        }
    }

    private void enviarEmailPrimeiroAcesso(Usuario usuario, String token) {
        String baseUrl = frontendUrl.replaceAll("/$", "");
        String link = baseUrl + "/primeiro-acesso?token=" + token;

        String htmlMessage = "<div style=\"font-family: Arial, sans-serif; background-color: #f4f7f6; padding: 40px 20px; color: #333;\">"
                + "<div style=\"max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); text-align: center;\">"

                + "<h2 style=\"color: #1e3a8a; font-size: 24px; margin-bottom: 10px;\">Bem-vindo ao Inova27! \uD83D\uDE80</h2>"

                + "<p style=\"font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 25px;\">"
                + "Olá, <strong>" + HtmlUtils.htmlEscape(usuario.getNome(), "UTF-8") + "</strong>! Sua conta foi criada com sucesso. "
                + "Clique no botão abaixo para definir sua senha e ativar seu acesso."
                + "</p>"

                + "<p style=\"font-size: 13px; color: #f97316; font-weight: bold; margin-bottom: 20px;\">"
                + "⏳ Este link expira em 7 dias."
                + "</p>"

                + "<a href=\"" + link + "\" style=\"display: inline-block; background-color: #f97316; color: #ffffff; font-size: 16px; font-weight: bold; text-decoration: none; padding: 14px 32px; border-radius: 8px; margin-bottom: 30px;\">"
                + "Definir Minha Senha"
                + "</a>"

                + "<p style=\"font-size: 14px; color: #888; margin-bottom: 10px;\">"
                + "Se o botão não funcionar, utilize o link abaixo:"
                + "<br><a href=\"" + link + "\" style=\"color: #3b82f6; word-break: break-all;\">" + link + "</a>"
                + "</p>"

                + "<hr style=\"border: none; border-top: 1px solid #eee; margin: 30px 0;\" />"

                + "<p style=\"font-size: 12px; color: #999;\">"
                + "Se você não esperava este e-mail, ignore-o com segurança."
                + "</p>"

                + "</div>"
                + "</div>";

        emailService.sendEmail(
                usuario.getEmail(),
                "Ative sua conta no Inova27 \uD83D\uDD11",
                htmlMessage,
                EmailType.WELCOME
        );

        if (usuario.getEmailSecundario() != null && !usuario.getEmailSecundario().isBlank()) {
            emailService.sendEmail(
                    usuario.getEmailSecundario(),
                    "Ative sua conta no Inova27 \uD83D\uDD11",
                    htmlMessage,
                    EmailType.WELCOME
            );
        }
    }

    private void validarCodigoConfirmacaoCadastro(String email, String codigo) {
        if (codigo == null || codigo.isBlank()) {
            throw new BusinessException("Código de confirmação de e-mail é obrigatório.");
        }
        if (!mfaService.validarCodigo(MfaService.FINALIDADE_CONFIRMACAO_CADASTRO,
                normalizarChaveEmail(email), codigo.trim())) {
            throw new BusinessException("Código de confirmação inválido ou expirado.");
        }
    }

    private static String normalizarChaveEmail(String email) {
        return email.trim().toLowerCase();
    }

    private void enviarEmailCodigoConfirmacaoCadastro(String email, String nome, String codigo) {
        String htmlMessage = "<div style=\"font-family: Arial, sans-serif; background-color: #f4f7f6; padding: 40px 20px; color: #333;\">"
                + "<div style=\"max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); text-align: center;\">"
                + "<h2 style=\"color: #1e3a8a; font-size: 24px; margin-bottom: 10px;\">Confirme seu cadastro no Inova27</h2>"
                + "<p style=\"font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 25px;\">"
                + "Olá, <strong>" + HtmlUtils.htmlEscape(nome, "UTF-8") + "</strong>! "
                + "Use o código abaixo para confirmar seu e-mail e concluir o cadastro da sua conta:"
                + "</p>"
                + "<div style=\"font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #f97316; margin-bottom: 25px;\">"
                + codigo
                + "</div>"
                + "<p style=\"font-size: 13px; color: #f97316; font-weight: bold; margin-bottom: 20px;\">"
                + "Este código é válido por 10 minutos."
                + "</p>"
                + "<hr style=\"border: none; border-top: 1px solid #eee; margin: 30px 0;\" />"
                + "<p style=\"font-size: 12px; color: #999;\">"
                + "Se você não solicitou este cadastro, ignore este e-mail com segurança."
                + "</p>"
                + "</div>"
                + "</div>";

        emailService.sendEmail(
                email,
                "Código de confirmação de cadastro - Inova27",
                htmlMessage,
                EmailType.WELCOME
        );
    }

    private void enviarEmailConfirmacaoCadastro(Usuario usuario) {
        String htmlMessage = "<div style=\"font-family: Arial, sans-serif; background-color: #f4f7f6; padding: 40px 20px; color: #333;\">"
                + "<div style=\"max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); text-align: center;\">"
                + "<h2 style=\"color: #1e3a8a; font-size: 24px; margin-bottom: 10px;\">Cadastro confirmado no Inova27!</h2>"
                + "<p style=\"font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 20px;\">"
                + "Olá, <strong>" + HtmlUtils.htmlEscape(usuario.getNome(), "UTF-8") + "</strong>! "
                + "Seu cadastro foi realizado e confirmado com sucesso."
                + "</p>"
                + "<p style=\"font-size: 15px; color: #555; line-height: 1.6; margin-bottom: 25px;\">"
                + "Sua conta agora aguarda a aprovação de um administrador para que você possa acessar a plataforma."
                + "</p>"
                + "<hr style=\"border: none; border-top: 1px solid #eee; margin: 30px 0;\" />"
                + "<p style=\"font-size: 12px; color: #999;\">"
                + "Se você não realizou este cadastro, entre em contato com a equipe AGIN / UECE."
                + "</p>"
                + "</div>"
                + "</div>";

        emailService.sendEmail(
                usuario.getEmail(),
                "Cadastro confirmado no Inova27",
                htmlMessage,
                EmailType.WELCOME
        );
    }

    private void verificarMfaAdmin(Usuario usuarioLogado, String pin) {
        if (usuarioLogado != null && usuarioLogado.getRole() == UserRole.ADMIN) {
            mfaGuard.check(usuarioLogado, pin);
        }
    }

    private Usuario resolverUsuarioLogado(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()
                && authentication.getPrincipal() instanceof Usuario usuario) {
            return usuario;
        }
        return null;
    }

    private UserRole resolverRole(RegisterDTO data, Usuario usuarioLogado) {
        if (data.role() != null && data.role() == UserRole.ADMIN) {
            if (usuarioLogado == null || usuarioLogado.getRole() != UserRole.ADMIN) {
                throw new AccessDeniedException("Apenas administradores podem cadastrar novos administradores.");
            }
            return UserRole.ADMIN;
        }
        return UserRole.PROFESSOR;
    }
}