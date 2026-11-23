package com.inova27.app.utils;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;

import java.text.Normalizer;
import java.util.Locale;

/**
 * Regras de comparação de texto usadas nas buscas: sem diferenciar maiúsculas nem acentos.
 * Depende da extensão "unaccent" do Postgres (criada pelo DatabaseSchemaFixRunner e pelo init.sql).
 */
public final class TextoBuscaUtils {

    private static final char ESCAPE = '\\';

    private TextoBuscaUtils() {
    }

    /** Minúsculas, sem acentos e com espaços colapsados: "  Gráfica  João " -> "grafica joao". */
    public static String normalizar(String texto) {
        return Normalizer.normalize(texto, Normalizer.Form.NFD)
                .replaceAll("\\p{M}+", "")
                .trim()
                .toLowerCase(Locale.ROOT)
                .replaceAll("\\s+", " ");
    }

    /**
     * campo contém o termo em qualquer posição, ignorando maiúsculas e acentos.
     * "%" e "_" digitados pelo usuário são tratados como texto, não como curinga.
     */
    public static Predicate contem(CriteriaBuilder cb, Expression<String> campo, String termo) {
        String literal = normalizar(termo)
                .replace("\\", "\\\\")
                .replace("%", "\\%")
                .replace("_", "\\_");
        return cb.like(cb.function("unaccent", String.class, cb.lower(campo)), "%" + literal + "%", ESCAPE);
    }
}
