package com.inova27.app.service;

import com.inova27.app.exception.EmailEnvioException;
import com.inova27.app.model.Email;
import com.inova27.app.model.EmailStatus;
import com.inova27.app.model.EmailType;
import com.inova27.app.repository.EmailRepository;
import jakarta.mail.internet.MimeMessage; // IMPORTANTE: pode ser javax.mail dependendo da versão do Spring
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    private final EmailRepository emailRepository;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendEmail(String to, String subject, String body, EmailType type) {

        Email email = new Email();
        email.setToEmail(to);
        email.setSubject(subject);
        email.setBody(body);
        email.setType(type);
        email.setStatus(EmailStatus.PENDING);

        emailRepository.save(email);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setFrom(fromEmail);
            helper.setText(body, true);

            mailSender.send(message);


            email.setStatus(EmailStatus.SENT);
            email.setSentAt(LocalDateTime.now());

        } catch (Exception e) {

            email.setStatus(EmailStatus.ERROR);
            String errorMsg = e.getMessage();
            if (errorMsg != null) {
                email.setError(errorMsg.substring(0, Math.min(500, errorMsg.length())));
            }
            // Jogue a exceção para cima para o Controller saber que deu erro e retornar o HTTP 500
            emailRepository.save(email);
            throw new EmailEnvioException("Falha ao enviar e-mail", e);
        }

        emailRepository.save(email);
    }
}