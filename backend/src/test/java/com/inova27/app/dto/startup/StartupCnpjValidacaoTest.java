package com.inova27.app.dto.startup;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import java.util.Set;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("CNPJ de startup - validação (numérico e alfanumérico) e normalização")
class StartupCnpjValidacaoTest {

    private static final Validator VALIDATOR = Validation.buildDefaultValidatorFactory().getValidator();

    private static StartupCreateDTO criar(String cnpj) {
        return new StartupCreateDTO("Startup", null, null, null, null, null, null, null, null, null, cnpj, null, null);
    }

    private static StartupUpdateDTO atualizar(String cnpj) {
        return new StartupUpdateDTO(null, null, null, null, null, null, null, null, null, null, cnpj, null, null);
    }

    private static Set<String> erros(Object dto) {
        return VALIDATOR.validate(dto).stream().map(ConstraintViolation::getMessage).collect(Collectors.toSet());
    }

    @ParameterizedTest(name = "válido: \"{0}\"")
    @ValueSource(strings = {
            "12.ABC.345/01DE-35",   // alfanumérico com máscara (exemplo da Receita Federal)
            "12ABC34501DE35",       // alfanumérico sem máscara
            "12.abc.345/01de-35",   // minúsculas são aceitas
            " 12ABC34501DE35 ",     // espaços nas pontas
            "11.222.333/0001-81",   // numérico (formato atual) com máscara
            "11222333000181"        // numérico sem máscara
    })
    void aceitaCnpjValido(String cnpj) {
        assertThat(erros(criar(cnpj))).isEmpty();
    }

    @ParameterizedTest(name = "inválido: \"{0}\"")
    @ValueSource(strings = {
            "12ABC34501DE36",       // dígito verificador errado
            "11222333000182",       // dígito verificador errado (numérico)
            "00000000000000",       // sequência repetida
            "AAAAAAAAAAAAAA",
            "12ABC34501DE3",        // 13 posições
            "12ABC34501DE355",      // 15 posições
            "12ABC34501DEAB",       // verificadores precisam ser numéricos
            "12ABC34501D@35"        // caractere fora de [0-9A-Z]
    })
    void recusaCnpjInvalido(String cnpj) {
        assertThat(erros(criar(cnpj))).containsExactly("CNPJ inválido.");
    }

    @Test
    @DisplayName("Cadastro: CNPJ é obrigatório (nulo, vazio ou só máscara)")
    void obrigatorioNoCadastro() {
        assertThat(erros(criar(null))).containsExactly("O CNPJ é obrigatório.");
        assertThat(erros(criar(""))).containsExactly("O CNPJ é obrigatório.");
        assertThat(erros(criar(" ./- "))).containsExactly("O CNPJ é obrigatório.");
    }

    @Test
    @DisplayName("Edição: CNPJ ausente ou vazio significa 'não alterar'; se vier, precisa ser válido")
    void opcionalNaEdicao() {
        assertThat(erros(atualizar(null))).isEmpty();
        assertThat(atualizar("").cnpj()).isNull();
        assertThat(erros(atualizar("12ABC34501DE36"))).containsExactly("CNPJ inválido.");
    }

    @Test
    @DisplayName("Valor é gravado sem máscara e em maiúsculas")
    void normalizaParaGravar() {
        assertThat(criar("12.abc.345/01de-35").cnpj()).isEqualTo("12ABC34501DE35");
        assertThat(atualizar("11.222.333/0001-81").cnpj()).isEqualTo("11222333000181");
    }
}
