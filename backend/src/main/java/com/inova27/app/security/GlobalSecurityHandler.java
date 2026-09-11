package com.inova27.app.security;

import com.inova27.app.exception.MfaRequiredException;
import com.inova27.app.model.EmailType;
import com.inova27.app.service.EmailService;
import com.inova27.app.service.MfaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
@RequiredArgsConstructor
public class GlobalSecurityHandler {

    private final MfaService mfaService;

    private final EmailService emailService;

    @ExceptionHandler(MfaRequiredException.class)
    public ResponseEntity<Map<String, String>> handleMfaRequired(MfaRequiredException ex) {

        Long usuarioId = ex.getUsuarioId();
        String email = ex.getEmail();

        String novoPin = mfaService.gerarCodigoMfa(usuarioId);

        String htmlMessage =
                "<div style=\"font-family: Arial, sans-serif; background-color: #f4f7f6; padding: 40px 20px; color: #333;\">"
                        + "<div style=\"max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 12px; text-align: center;\">"

                        + "<h2 style=\"color: #1e3a8a;\">Verificação de Segurança 🔐</h2>"

                        + "<p style=\"font-size: 16px; margin-bottom: 30px;\">"
                        + "Use o código abaixo para confirmar sua ação:"
                        + "</p>"

                        + "<div style=\"font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #f97316; margin-bottom: 30px;\">"
                        + novoPin
                        + "</div>"

                        + "<p style=\"font-size: 12px; color: #999;\">"
                        + "Se você não solicitou isso, ignore este e-mail."
                        + "</p>"

                        + "</div></div>";

        emailService.sendEmail(email, "Código de Segurança", htmlMessage, EmailType.CONTACT);

        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("erro", "MFA_REQUIRED"));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntime(RuntimeException ex) {

        if (ex.getMessage() != null && ex.getMessage().contains("inválido")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("erro", "MFA_INVALID"));
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("erro", ex.getMessage()));
    }
}