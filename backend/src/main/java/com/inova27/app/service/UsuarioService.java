package com.inova27.app.service;

import com.inova27.app.dto.usuarios.UsuarioResponseDTO;
import com.inova27.app.dto.usuarios.UsuarioUpdateDTO;
import com.inova27.app.exception.BusinessException;
import com.inova27.app.model.AcaoAuditoria;
import com.inova27.app.model.EmailType;
import com.inova27.app.model.UserRole;
import com.inova27.app.model.Usuario;
import com.inova27.app.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    // 🔥 CONSTANTES CRIADAS PARA RESOLVER OS AVISOS DO SONARQUBE
    private static final String ENTIDADE_USUARIO = "Usuario";
    private static final String MSG_USUARIO_NAO_ENCONTRADO = "Usuário não encontrado.";
    private static final String MSG_CONTA_NAO_ENCONTRADA = "Conta não encontrada.";

    private final UsuarioRepository repository;
    private final AuditoriaService auditoriaService;
    private final MfaService mfaService;
    private final EmailService emailService;

    public List<UsuarioResponseDTO> listarNaoValidados() {
        return repository.findByValidadoFalse()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public UsuarioResponseDTO atualizar(Long id, UsuarioUpdateDTO dados, Long adminId) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new BusinessException(MSG_USUARIO_NAO_ENCONTRADO));

        if (dados.nome() != null) usuario.setNome(dados.nome());
        if (dados.email() != null) usuario.setEmail(dados.email());
        if (dados.role() != null) usuario.setRole(dados.role());

        Usuario atualizado = repository.save(usuario);

        auditoriaService.registrarLog(ENTIDADE_USUARIO, atualizado.getId(), AcaoAuditoria.EDICAO, adminId, dados);

        return toResponse(atualizado);
    }

    @Transactional
    public UsuarioResponseDTO atualizarMeusDados(Long id, UsuarioUpdateDTO dados) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new BusinessException(MSG_USUARIO_NAO_ENCONTRADO));

        if (dados.nome() != null && !dados.nome().isBlank()) {
            usuario.setNome(dados.nome());
        }

        if (dados.email() != null && !dados.email().isBlank()) {
            if (!usuario.getEmail().equals(dados.email()) && repository.existsByEmail(dados.email())) {
                throw new BusinessException("Este e-mail já está em uso por outra conta.");
            }
            usuario.setEmail(dados.email());
        }

        if (dados.emailSecundario() != null) {
            if (!dados.emailSecundario().isBlank()) {
                if (repository.findByEmailSecundario(dados.emailSecundario())
                        .filter(u -> !u.getId().equals(id))
                        .isPresent()) {
                    throw new BusinessException("Este e-mail secundário já está em uso por outra conta.");
                }
                usuario.setEmailSecundario(dados.emailSecundario());
            } else {
                usuario.setEmailSecundario(null);
            }
        }

        Usuario atualizado = repository.save(usuario);

        auditoriaService.registrarLog(ENTIDADE_USUARIO, atualizado.getId(), AcaoAuditoria.EDICAO, id, "O usuário atualizou os próprios dados do perfil.");

        return toResponse(atualizado);
    }

    public void solicitarRecuperacaoEmail(String emailAtual) {
        Usuario usuario = repository.findByEmail(emailAtual)
                .orElseThrow(() -> new BusinessException(MSG_CONTA_NAO_ENCONTRADA));

        if (usuario.getEmailSecundario() == null || usuario.getEmailSecundario().isBlank()) {
            throw new BusinessException("Nenhum e-mail de recuperação (secundário) cadastrado para esta conta. Entre em contato com o suporte.");
        }

        String pin = mfaService.gerarCodigoMfa(usuario.getId());

        emailService.sendEmail(
                usuario.getEmailSecundario(),
                "Recuperação de Acesso - Inova27",
                "Você solicitou a alteração do seu e-mail principal. Seu código de segurança é: " + pin,
                EmailType.CONTACT
        );
    }

    @Transactional
    public void confirmarRecuperacaoEmail(String emailAtual, String pin, String novoEmailPrincipal, String novoEmailSecundario) {
        Usuario usuario = repository.findByEmail(emailAtual)
                .orElseThrow(() -> new BusinessException(MSG_CONTA_NAO_ENCONTRADA));

        if (!mfaService.validarCodigoMfa(usuario.getId(), pin)) {
            throw new BusinessException("Código de segurança inválido ou expirado.");
        }

        // Delegação para métodos privados
        validarNovoEmailPrincipal(usuario, novoEmailPrincipal);
        validarNovoEmailSecundario(usuario, novoEmailSecundario);

        usuario.setEmail(novoEmailPrincipal);

        if (novoEmailSecundario != null && !novoEmailSecundario.isBlank()) {
            usuario.setEmailSecundario(novoEmailSecundario);
        }

        Usuario salvo = repository.save(usuario);

        auditoriaService.registrarLog(ENTIDADE_USUARIO, salvo.getId(), AcaoAuditoria.EDICAO, salvo.getId(), "E-mail principal/secundário alterado via fluxo de recuperação com PIN.");
    }

    // ==========================================
    // 🔹 MÉTODOS PRIVADOS AUXILIARES (Refatoração do SonarQube)
    // ==========================================

    private void validarNovoEmailPrincipal(Usuario usuario, String novoEmailPrincipal) {
        // 🔥 CORREÇÃO SONAR: Ifs mesclados com &&
        if (!usuario.getEmail().equals(novoEmailPrincipal) &&
                (repository.existsByEmail(novoEmailPrincipal) || repository.findByEmailSecundario(novoEmailPrincipal).isPresent())) {
            throw new BusinessException("O novo e-mail principal informado já está em uso por outra conta.");
        }
    }

    private void validarNovoEmailSecundario(Usuario usuario, String novoEmailSecundario) {
        // 🔥 CORREÇÃO SONAR: Ifs mesclados com &&
        if (novoEmailSecundario != null && !novoEmailSecundario.isBlank() && !novoEmailSecundario.equals(usuario.getEmailSecundario())) {

            // Verifica se já é o principal de outra pessoa
            if (repository.existsByEmail(novoEmailSecundario)) {
                throw new BusinessException("Erro: O e-mail secundário fornecido já é o e-mail principal de outra conta.");
            }
            // Verifica se já é o secundário de outra pessoa
            if (repository.findByEmailSecundario(novoEmailSecundario).isPresent()) {
                throw new BusinessException("Erro: Este e-mail secundário já está em uso por outra conta.");
            }
        }
    }

    @Transactional
    public UsuarioResponseDTO validarUsuario(Long id, UserRole role, Long idUsuario) {
        if (role != UserRole.ADMIN) {
            throw new BusinessException("Apenas administradores podem validar usuários.");
        }

        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new BusinessException(MSG_USUARIO_NAO_ENCONTRADO));

        if (usuario.isValidado()) {
            throw new BusinessException("Usuário já está validado.");
        }

        usuario.setUserInclusaoId(idUsuario);
        usuario.setValidado(true);

        Usuario validado = repository.save(usuario);

        auditoriaService.registrarLog(ENTIDADE_USUARIO, validado.getId(), AcaoAuditoria.VALIDACAO, idUsuario, "Usuário validado e liberado para acesso.");

        return toResponse(validado);
    }

    public UsuarioResponseDTO buscarPorId(Long id) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new BusinessException(MSG_USUARIO_NAO_ENCONTRADO));
        return toResponse(usuario);
    }

    public List<UsuarioResponseDTO> listarTodos() {
        return repository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public void deletar(Long id, Long adminId) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new BusinessException(MSG_USUARIO_NAO_ENCONTRADO));

        UsuarioResponseDTO retrato = toResponse(usuario);
        repository.delete(usuario);

        auditoriaService.registrarLog(ENTIDADE_USUARIO, id, AcaoAuditoria.DELECAO, adminId, retrato);
    }

    private UsuarioResponseDTO toResponse(Usuario usuario) {
        return new UsuarioResponseDTO(
                usuario.getId(),
                usuario.getEmail(),
                usuario.getNome(),
                usuario.getRole(),
                usuario.isValidado(),
                usuario.getEmailSecundario()
        );
    }
}