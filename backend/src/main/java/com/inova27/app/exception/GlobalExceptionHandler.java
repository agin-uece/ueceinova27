package com.inova27.app.exception;

import com.inova27.app.model.EmailType;
import com.inova27.app.service.EmailService;
import com.inova27.app.service.MfaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.Map;
import java.util.stream.Collectors;

/**
 * Ponto único de tradução de exceções em respostas HTTP.
 * Corpo sempre no formato {"erro": "mensagem"} (o frontend lê a chave "erro").
 * Controllers e services não devem capturar exceções só para montar respostas de erro.
 */
@Slf4j
@RestControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    static final String CHAVE_ERRO = "erro";

    private final MfaService mfaService;
    private final EmailService emailService;

    // ==========================================
    // MFA (o frontend reage a 403 + "MFA_REQUIRED" abrindo o modal do PIN)
    // ==========================================
    @ExceptionHandler(MfaRequiredException.class)
    public ResponseEntity<Object> handleMfaRequired(MfaRequiredException ex) {
        String pin = mfaService.gerarCodigoMfa(ex.getUsuarioId());
        emailService.sendEmail(ex.getEmail(), "Código de Segurança", htmlCodigoMfa(pin), EmailType.CONTACT);
        return erro(HttpStatus.FORBIDDEN, "MFA_REQUIRED");
    }

    @ExceptionHandler(MfaInvalidoException.class)
    public ResponseEntity<Object> handleMfaInvalido(MfaInvalidoException ex) {
        return erro(HttpStatus.FORBIDDEN, "MFA_INVALID");
    }

    // ==========================================
    // Erros de domínio
    // ==========================================
    @ExceptionHandler({ResourceNotFoundException.class, JogoNaoEncontradoException.class, EngineNaoEncontradaException.class})
    public ResponseEntity<Object> handleNaoEncontrado(RuntimeException ex) {
        return erro(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler({JogoJaExisteException.class, EngineJaExisteException.class, ConflitoException.class})
    public ResponseEntity<Object> handleConflito(RuntimeException ex) {
        return erro(HttpStatus.CONFLICT, ex.getMessage());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Object> handleIntegridade(DataIntegrityViolationException ex) {
        log.warn("Violação de integridade: {}", ex.getMostSpecificCause().getMessage());
        return erro(HttpStatus.CONFLICT, "Operação conflita com dados já existentes (registro duplicado ou em uso).");
    }

    @ExceptionHandler({PermissaoNegadaException.class, UnauthorizedActionException.class,
            SecurityException.class, AccessDeniedException.class})
    public ResponseEntity<Object> handleProibido(RuntimeException ex) {
        return erro(HttpStatus.FORBIDDEN, ex.getMessage());
    }

    @ExceptionHandler(UsuarioNaoAutenticadoException.class)
    public ResponseEntity<Object> handleNaoAutenticado(UsuarioNaoAutenticadoException ex) {
        return erro(HttpStatus.UNAUTHORIZED, ex.getMessage());
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Object> handleCredenciais(BadCredentialsException ex) {
        return erro(HttpStatus.UNAUTHORIZED, "Usuário ou senha inválidos.");
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Object> handleAutenticacao(AuthenticationException ex) {
        return erro(HttpStatus.UNAUTHORIZED, "Falha na autenticação.");
    }

    @ExceptionHandler({BusinessException.class, IllegalArgumentException.class,
            TokenInvalidoException.class, TokenExpiradoException.class})
    public ResponseEntity<Object> handleRegraDeNegocio(RuntimeException ex) {
        return erro(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    // ==========================================
    // Dependências externas
    // ==========================================
    @ExceptionHandler(EmailEnvioException.class)
    public ResponseEntity<Object> handleEmail(EmailEnvioException ex) {
        log.error("Falha ao enviar e-mail", ex);
        return erro(HttpStatus.SERVICE_UNAVAILABLE, "Não foi possível enviar o e-mail. Tente novamente mais tarde.");
    }

    @ExceptionHandler(OllamaIntegrationException.class)
    public ResponseEntity<Object> handleOllama(OllamaIntegrationException ex) {
        log.error("Falha na integração com o Ollama", ex);
        return erro(HttpStatus.SERVICE_UNAVAILABLE, "Serviço de busca semântica indisponível no momento.");
    }

    // ==========================================
    // Qualquer outra coisa: 500 sem expor detalhes internos
    // ==========================================
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleInesperado(Exception ex) {
        log.error("Erro não tratado", ex);
        return erro(HttpStatus.INTERNAL_SERVER_ERROR, "Erro interno no servidor.");
    }

    // ==========================================
    // Exceções do próprio Spring MVC (JSON inválido, @Valid, tipo de parâmetro, 404, 405...)
    // ==========================================
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        String mensagem = ex.getBindingResult().getFieldErrors().stream()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .collect(Collectors.joining("; "));
        return erro(HttpStatus.BAD_REQUEST, mensagem.isBlank() ? "Dados inválidos." : mensagem);
    }

    @Override
    protected ResponseEntity<Object> handleExceptionInternal(
            Exception ex, Object body, HttpHeaders headers, HttpStatusCode statusCode, WebRequest request) {
        String mensagem = switch (statusCode.value()) {
            case 404 -> "Recurso não encontrado.";
            case 405 -> "Método HTTP não suportado nesta rota.";
            case 415 -> "Tipo de conteúdo não suportado.";
            default -> statusCode.is4xxClientError() ? "Requisição inválida." : "Erro interno no servidor.";
        };
        return ResponseEntity.status(statusCode).headers(headers).body(Map.of(CHAVE_ERRO, mensagem));
    }

    private static ResponseEntity<Object> erro(HttpStatus status, String mensagem) {
        return ResponseEntity.status(status).body(Map.of(CHAVE_ERRO, mensagem != null ? mensagem : status.getReasonPhrase()));
    }

    private static String htmlCodigoMfa(String pin) {
        return "<div style=\"font-family: Arial, sans-serif; background-color: #f4f7f6; padding: 40px 20px; color: #333;\">"
                + "<div style=\"max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 12px; text-align: center;\">"
                + "<h2 style=\"color: #1e3a8a;\">Verificação de Segurança 🔐</h2>"
                + "<p style=\"font-size: 16px; margin-bottom: 30px;\">Use o código abaixo para confirmar sua ação:</p>"
                + "<div style=\"font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #f97316; margin-bottom: 30px;\">"
                + pin
                + "</div>"
                + "<p style=\"font-size: 12px; color: #999;\">Válido por 10 minutos. Se você não solicitou isso, ignore este e-mail.</p>"
                + "</div></div>";
    }
}
