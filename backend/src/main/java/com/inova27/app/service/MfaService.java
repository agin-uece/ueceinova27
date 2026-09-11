package com.inova27.app.service;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class MfaService {

    private final Map<Long, String> mfaCache = new ConcurrentHashMap<>();

    // 🔥 CORREÇÃO: Objeto instanciado apenas uma vez (reaproveitado)
    // Upgraded para SecureRandom para garantir segurança real no MFA
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    public String gerarCodigoMfa(Long usuarioId) {
        // Agora utilizamos a mesma instância para gerar os números
        String codigo = String.format("%06d", SECURE_RANDOM.nextInt(1000000));
        mfaCache.put(usuarioId, codigo);
        return codigo;
    }

    public boolean validarCodigoMfa(Long usuarioId, String codigoFornecido) {
        String codigoSalvo = mfaCache.get(usuarioId);

        if (codigoSalvo != null && codigoSalvo.equals(codigoFornecido)) {
            mfaCache.remove(usuarioId);
            return true;
        }

        return false;
    }
}