package com.inova27.app.exception;

import com.inova27.app.model.EmailType;
import com.inova27.app.service.EmailService;
import com.inova27.app.service.MfaService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("GlobalExceptionHandler - exceção -> status HTTP + {\"erro\": ...}")
class GlobalExceptionHandlerTest {

    @Mock
    private MfaService mfaService;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private GlobalExceptionHandler handler;

    @Test
    @DisplayName("Não encontrado -> 404")
    void naoEncontrado() {
        assertResposta(handler.handleNaoEncontrado(new ResourceNotFoundException("Pessoa não encontrada.")),
                HttpStatus.NOT_FOUND, "Pessoa não encontrada.");
        assertResposta(handler.handleNaoEncontrado(new JogoNaoEncontradoException(9L)),
                HttpStatus.NOT_FOUND, "Jogo não encontrado com o ID: 9");
    }

    @Test
    @DisplayName("Duplicidade -> 409, sem expor a mensagem do banco")
    void conflito() {
        assertResposta(handler.handleConflito(new JogoJaExisteException("Xadrez")),
                HttpStatus.CONFLICT, "Já existe um jogo com o nome: Xadrez");
        assertResposta(handler.handleConflito(new ConflitoException("Já existe uma startup cadastrada com este CNPJ.")),
                HttpStatus.CONFLICT, "Já existe uma startup cadastrada com este CNPJ.");
        ResponseEntity<Object> r = handler.handleIntegridade(new DataIntegrityViolationException("duplicate key value violates unique constraint uk_x"));
        assertThat(r.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
        assertThat(erro(r)).doesNotContain("uk_x");
    }

    @Test
    @DisplayName("Sem permissão -> 403")
    void proibido() {
        assertResposta(handler.handleProibido(new PermissaoNegadaException("Você não tem permissão.")),
                HttpStatus.FORBIDDEN, "Você não tem permissão.");
    }

    @Test
    @DisplayName("Regra de negócio / entrada inválida -> 400")
    void regraDeNegocio() {
        assertResposta(handler.handleRegraDeNegocio(new BusinessException("Código de segurança inválido ou expirado.")),
                HttpStatus.BAD_REQUEST, "Código de segurança inválido ou expirado.");
    }

    @Test
    @DisplayName("MFA exigido -> 403 MFA_REQUIRED e PIN enviado por e-mail")
    void mfaExigido() {
        when(mfaService.gerarCodigoMfa(1L)).thenReturn("123456");

        assertResposta(handler.handleMfaRequired(new MfaRequiredException(1L, "admin@uece.br")),
                HttpStatus.FORBIDDEN, "MFA_REQUIRED");
        verify(emailService).sendEmail(eq("admin@uece.br"), eq("Código de Segurança"), contains("123456"), eq(EmailType.CONTACT));
    }

    @Test
    @DisplayName("PIN errado -> 403 MFA_INVALID")
    void mfaInvalido() {
        assertResposta(handler.handleMfaInvalido(new MfaInvalidoException()), HttpStatus.FORBIDDEN, "MFA_INVALID");
    }

    @Test
    @DisplayName("Falha de e-mail / Ollama -> 503")
    void dependenciasExternas() {
        assertThat(handler.handleEmail(new EmailEnvioException("smtp off")).getStatusCode()).isEqualTo(HttpStatus.SERVICE_UNAVAILABLE);
        assertThat(handler.handleOllama(new OllamaIntegrationException("down")).getStatusCode()).isEqualTo(HttpStatus.SERVICE_UNAVAILABLE);
    }

    @Test
    @DisplayName("Erro inesperado -> 500 genérico, sem vazar detalhes internos")
    void inesperado() {
        ResponseEntity<Object> r = handler.handleInesperado(new NullPointerException("campo x da entidade y é nulo"));
        assertResposta(r, HttpStatus.INTERNAL_SERVER_ERROR, "Erro interno no servidor.");
    }

    private static void assertResposta(ResponseEntity<Object> r, HttpStatus status, String mensagem) {
        assertThat(r.getStatusCode()).isEqualTo(status);
        assertThat(erro(r)).isEqualTo(mensagem);
    }

    private static String erro(ResponseEntity<Object> r) {
        return (String) ((Map<?, ?>) r.getBody()).get("erro");
    }
}
