package com.inova27.app.controller;


import com.inova27.app.dto.email.ContatoRequestDTO;
import com.inova27.app.model.EmailType;
import com.inova27.app.service.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/contato")
@RequiredArgsConstructor
public class ContatoController {

    private final EmailService emailService;

    @Value("${email.destinatario.agin}")
    private String destinatarioAgin;

    @PostMapping
    public ResponseEntity<Object> enviarMensagem(@RequestBody @Valid ContatoRequestDTO dto) {
        try {
            String assuntoFormatado = "[Inova27 - Contato Site] " + dto.assunto();

            String corpoHtml = String.format("""
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #4f46e5; color: white; padding: 20px; text-align: center;">
                        <h2 style="margin: 0; font-size: 20px;">Novo Contato pelo Site Inova27</h2>
                    </div>
                    <div style="padding: 20px;">
                        <p><strong>Nome:</strong> %s</p>
                        <p><strong>E-mail (Resposta):</strong> <a href="mailto:%s">%s</a></p>
                        <p><strong>Assunto:</strong> %s</p>
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                        <p><strong>Mensagem:</strong></p>
                        <p style="background-color: #f9fafb; padding: 15px; border-radius: 6px; white-space: pre-wrap;">%s</p>
                    </div>
                    <div style="background-color: #f3f4f6; color: #6b7280; padding: 15px; text-align: center; font-size: 12px;">
                        <p style="margin: 0;">Este e-mail foi enviado automaticamente pelo formulário de contato da plataforma Inova27.</p>
                    </div>
                </div>
                """,
                    dto.nome(),
                    dto.email(), dto.email(),
                    dto.assunto(),
                    dto.mensagem()
            );

            emailService.sendEmail(destinatarioAgin, assuntoFormatado, corpoHtml, EmailType.CONTACT);

            return ResponseEntity.ok(Map.of("mensagem", "Sua mensagem foi enviada com sucesso!"));

        } catch (Exception e) {
            // Em caso de erro (ex: falha no SMTP)
            return ResponseEntity.internalServerError()
                    .body(Map.of("erro", "Ocorreu um erro interno ao enviar a mensagem. Tente novamente mais tarde."));
        }
    }
}
