package com.inova27.app.utils;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Expression;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class TextoBuscaUtilsTest {

    @ParameterizedTest(name = "\"{0}\" -> \"{1}\"")
    @CsvSource(delimiter = '|', value = {
            "Criopreservação|criopreservacao",
            "  João    Conceição  |joao conceicao",
            "CEARÁ|ceara",
            "Microcápsulas Óleos Ação|microcapsulas oleos acao",
            "chalc|chalc"
    })
    @DisplayName("normalizar remove acentos, maiúsculas e espaços extras")
    void normalizar(String entrada, String esperado) {
        assertThat(TextoBuscaUtils.normalizar(entrada)).isEqualTo(esperado);
    }

    @Test
    @DisplayName("contem compara unaccent(lower(campo)) com o termo normalizado em qualquer posição")
    @SuppressWarnings("unchecked")
    void contemUsaUnaccentELikeParcial() {
        CriteriaBuilder cb = mock(CriteriaBuilder.class);
        Expression<String> campo = mock(Expression.class);
        Expression<String> lower = mock(Expression.class);
        Expression<String> semAcento = mock(Expression.class);
        when(cb.lower(campo)).thenReturn(lower);
        when(cb.function("unaccent", String.class, lower)).thenReturn(semAcento);

        TextoBuscaUtils.contem(cb, campo, " Gráf ");

        verify(cb).like(semAcento, "%graf%", '\\');
    }

    @Test
    @DisplayName("contem trata %, _ e \\ digitados como texto, não como curinga")
    @SuppressWarnings("unchecked")
    void contemEscapaCuringas() {
        CriteriaBuilder cb = mock(CriteriaBuilder.class);

        TextoBuscaUtils.contem(cb, mock(Expression.class), "100%_a\\b");

        verify(cb).like(any(), eq("%100\\%\\_a\\\\b%"), eq('\\'));
    }
}
