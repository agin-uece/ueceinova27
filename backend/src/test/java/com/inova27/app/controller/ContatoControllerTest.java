package com.inova27.app.controller;

import com.inova27.app.dto.email.ContatoRequestDTO;
import com.inova27.app.model.EmailType;
import com.inova27.app.service.EmailService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class ContatoControllerTest {

    @Mock
    private EmailService emailService;

    @InjectMocks
    private ContatoController controller;

    @Test
    @DisplayName("Campos do formulário público são escapados no HTML e o assunto não carrega quebras de linha")
    void escapaHtmlDoFormulario() {
        ReflectionTestUtils.setField(controller, "destinatarioAgin", "agin@uece.br");
        ContatoRequestDTO dto = new ContatoRequestDTO(
                "<b>Fulano</b>",
                "fulano@uece.br",
                "Oi\r\nBcc: alvo@x.com",
                "<a href=\"https://golpe.example\">clique aqui</a> ação");

        controller.enviarMensagem(dto);

        ArgumentCaptor<String> assunto = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<String> corpo = ArgumentCaptor.forClass(String.class);
        verify(emailService).sendEmail(eq("agin@uece.br"), assunto.capture(), corpo.capture(), eq(EmailType.CONTACT));

        assertThat(assunto.getValue()).doesNotContain("\r", "\n");
        assertThat(corpo.getValue())
                .doesNotContain("<b>Fulano</b>", "<a href=\"https://golpe.example\">")
                .contains("&lt;b&gt;Fulano&lt;/b&gt;", "&lt;a href=", "ação"); // acentos preservados
    }
}
