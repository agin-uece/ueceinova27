package com.inova27.app.service;

import com.inova27.app.exception.TokenExpiradoException;
import com.inova27.app.exception.TokenInvalidoException;
import com.inova27.app.model.PasswordResetToken;
import com.inova27.app.model.Usuario;
import com.inova27.app.model.EmailType;
import com.inova27.app.repository.PasswordResetTokenRepository;
import com.inova27.app.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final UsuarioRepository usuarioRepository;

    private final PasswordResetTokenRepository tokenRepository;

    private final EmailService emailService;

    private final PasswordEncoder passwordEncoder;

    @Value("${app.frontend.url}")
    private String frontendUrl;


    public void forgotPassword(String email) {

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (usuario == null) return;

        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUsuario(usuario);

        tokenRepository.save(resetToken);

        String baseUrl = frontendUrl.replaceAll("/$", "");

        String linkFront = baseUrl
                + "/login/recuperar-senha?email="
                + URLEncoder.encode(usuario.getEmail(), StandardCharsets.UTF_8)
                + "&token="
                + URLEncoder.encode(token, StandardCharsets.UTF_8);


        // Construção do HTML do E-mail
        String htmlMessage = "<div style=\"font-family: Arial, sans-serif; background-color: #f4f7f6; padding: 40px 20px; color: #333;\">"
                + "<div style=\"max-w-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); text-align: center;\">"


                + "<h2 style=\"color: #1e3a8a; font-size: 24px; margin-bottom: 10px;\">Olá, inovador! \uD83D\uDE80</h2>"

                + "<p style=\"font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 30px;\">"
                + "Recebemos um pedido para redefinir a senha da sua conta no ecossistema <strong>Inova27</strong>. "
                + "Não se preocupe, isso acontece com as melhores mentes brilhantes!"
                + "</p>"

                + "<a href=\"" + linkFront + "\" style=\"display: inline-block; background-color: #f97316; color: #ffffff; font-size: 16px; font-weight: bold; text-decoration: none; padding: 14px 32px; border-radius: 8px; margin-bottom: 30px;\">"
                + "Criar Nova Senha"
                + "</a>"

                + "<p style=\"font-size: 14px; color: #888; margin-bottom: 10px;\">"
                + "Se o botão não funcionar, copie e cole o link abaixo no seu navegador:"
                + "<br><a href=\"" + linkFront + "\" style=\"color: #3b82f6; word-break: break-all;\">" + linkFront + "</a>"
                + "</p>"

                + "<hr style=\"border: none; border-top: 1px solid #eee; margin: 30px 0;\" />"

                + "<p style=\"font-size: 12px; color: #999;\">"
                + "Se você não solicitou essa alteração, pode ignorar este e-mail em segurança. Sua senha continuará a mesma."
                + "</p>"

                + "</div>"
                + "</div>";

        emailService.sendEmail(
                usuario.getEmail(),
                "Inova27 - Recuperação de Senha \uD83D\uDD12",
                htmlMessage,
                EmailType.RESET_PASSWORD
        );
    }

    public void resetPassword(String token, String novaSenha) {

        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(TokenInvalidoException::new);

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new TokenExpiradoException();
        }

        Usuario usuario = resetToken.getUsuario();

        usuario.setSenha(passwordEncoder.encode(novaSenha));

        usuarioRepository.save(usuario);

        tokenRepository.delete(resetToken);
    }
}