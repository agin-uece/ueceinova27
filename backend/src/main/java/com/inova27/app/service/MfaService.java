package com.inova27.app.service;

import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Códigos numéricos de uso único enviados por e-mail.
 * Cada código pertence a uma finalidade (MFA, recuperação de e-mail...) e a uma chave,
 * expira após {@link #VALIDADE} e é descartado após {@link #MAX_TENTATIVAS} erros.
 */
@Service
public class MfaService {

    public static final String FINALIDADE_MFA = "MFA";
    public static final String FINALIDADE_RECUPERACAO_EMAIL = "RECUPERACAO_EMAIL";
    public static final String FINALIDADE_CONFIRMACAO_NOVO_EMAIL = "CONFIRMACAO_NOVO_EMAIL";

    static final Duration VALIDADE = Duration.ofMinutes(10);
    static final Duration INTERVALO_REENVIO = Duration.ofSeconds(60);
    static final int MAX_TENTATIVAS = 5;

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private record Codigo(String valor, Instant criadoEm, int tentativasErradas) {}

    // ponytail: em memória — perde os códigos ao reiniciar e não é compartilhado entre instâncias;
    // mover para o banco/Redis se o backend rodar com mais de uma réplica.
    private final Map<String, Codigo> codigos = new ConcurrentHashMap<>();
    private final Clock clock;

    public MfaService() {
        this(Clock.systemUTC());
    }

    MfaService(Clock clock) {
        this.clock = clock;
    }

    // ==========================================
    // MFA de ações administrativas
    // ==========================================
    public String gerarCodigoMfa(Long usuarioId) {
        return gerarCodigo(FINALIDADE_MFA, String.valueOf(usuarioId));
    }

    public boolean validarCodigoMfa(Long usuarioId, String codigoFornecido) {
        return validarCodigo(FINALIDADE_MFA, String.valueOf(usuarioId), codigoFornecido);
    }

    // ==========================================
    // Genérico (por finalidade + chave)
    // ==========================================
    public String gerarCodigo(String finalidade, String chave) {
        String codigo = String.format("%06d", SECURE_RANDOM.nextInt(1_000_000));
        codigos.put(id(finalidade, chave), new Codigo(codigo, clock.instant(), 0));
        return codigo;
    }

    /** Falso enquanto houver um código válido emitido há menos de {@link #INTERVALO_REENVIO}. */
    public boolean podeReenviar(String finalidade, String chave) {
        Codigo atual = codigos.get(id(finalidade, chave));
        return atual == null || expirado(atual)
                || atual.criadoEm().plus(INTERVALO_REENVIO).isBefore(clock.instant());
    }

    /** Uso único: acerto ou excesso de erros invalidam o código. */
    public boolean validarCodigo(String finalidade, String chave, String codigoFornecido) {
        boolean[] valido = {false};
        codigos.computeIfPresent(id(finalidade, chave), (k, codigo) -> {
            if (expirado(codigo)) {
                return null;
            }
            if (codigoFornecido != null && MessageDigest.isEqual(
                    codigo.valor().getBytes(StandardCharsets.UTF_8),
                    codigoFornecido.getBytes(StandardCharsets.UTF_8))) {
                valido[0] = true;
                return null;
            }
            int erros = codigo.tentativasErradas() + 1;
            return erros >= MAX_TENTATIVAS ? null : new Codigo(codigo.valor(), codigo.criadoEm(), erros);
        });
        return valido[0];
    }

    private boolean expirado(Codigo codigo) {
        return !codigo.criadoEm().plus(VALIDADE).isAfter(clock.instant());
    }

    private static String id(String finalidade, String chave) {
        return finalidade + ":" + chave;
    }
}
