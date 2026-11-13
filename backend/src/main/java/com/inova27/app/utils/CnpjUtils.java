package com.inova27.app.utils;

import java.util.Locale;

/**
 * CNPJ (numérico ou alfanumérico — IN RFB nº 2.229/2024): 12 caracteres [0-9A-Z] + 2 dígitos verificadores.
 * A validação dos dígitos verificadores fica no {@code @CNPJ(format = ALPHANUMERIC)} do Hibernate Validator;
 * aqui só se padroniza o valor para validar, comparar e gravar sempre do mesmo jeito.
 */
public final class CnpjUtils {

    private CnpjUtils() {
    }

    /** Remove máscara (pontos, barra, hífen, espaços) e passa para maiúsculas. Vazio vira null (= não informado). */
    public static String normalizar(String cnpj) {
        if (cnpj == null) {
            return null;
        }
        String limpo = cnpj.replaceAll("[.\\-/\\s]", "").toUpperCase(Locale.ROOT);
        return limpo.isEmpty() ? null : limpo;
    }
}
