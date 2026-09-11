package com.inova27.app.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.*;

@DisplayName("MfaService - Testes Unitários")
class MfaServiceTest {

    private MfaService mfaService;

    @BeforeEach
    void setUp() {
        mfaService = new MfaService();
    }

    @Nested
    @DisplayName("gerarCodigoMfa()")
    class GerarCodigoMfa {

        @Test
        @DisplayName("Deve gerar código de 6 dígitos")
        void deveGerarCodigoSeisDígitos() {
            String codigo = mfaService.gerarCodigoMfa(1L);

            assertThat(codigo).hasSize(6);
            assertThat(codigo).matches("\\d{6}");
        }

        @Test
        @DisplayName("Deve sobrescrever código anterior para o mesmo usuário")
        void deveSobrescreverCodigoAnterior() {
            String primeiro = mfaService.gerarCodigoMfa(1L);
            String segundo = mfaService.gerarCodigoMfa(1L);

            // O segundo código deve ser o válido agora
            assertThat(mfaService.validarCodigoMfa(1L, segundo)).isTrue();
            // O primeiro não deve mais ser válido
            assertThat(mfaService.validarCodigoMfa(1L, primeiro)).isFalse();
        }

        @Test
        @DisplayName("Deve gerar códigos independentes para usuários diferentes")
        void deveGerarCodigosIndependentes() {
            String codigoUser1 = mfaService.gerarCodigoMfa(1L);
            String codigoUser2 = mfaService.gerarCodigoMfa(2L);

            assertThat(mfaService.validarCodigoMfa(1L, codigoUser1)).isTrue();
            assertThat(mfaService.validarCodigoMfa(2L, codigoUser2)).isTrue();
        }
    }

    @Nested
    @DisplayName("validarCodigoMfa()")
    class ValidarCodigoMfa {

        @Test
        @DisplayName("Deve retornar true para código correto")
        void deveRetornarTrueParaCodigoCorreto() {
            String codigo = mfaService.gerarCodigoMfa(1L);

            assertThat(mfaService.validarCodigoMfa(1L, codigo)).isTrue();
        }

        @Test
        @DisplayName("Deve retornar false para código incorreto")
        void deveRetornarFalseParaCodigoIncorreto() {
            mfaService.gerarCodigoMfa(1L);

            assertThat(mfaService.validarCodigoMfa(1L, "000000")).isFalse();
        }

        @Test
        @DisplayName("Deve retornar false para usuário sem código gerado")
        void deveRetornarFalseParaUsuarioSemCodigo() {
            assertThat(mfaService.validarCodigoMfa(99L, "123456")).isFalse();
        }

        @Test
        @DisplayName("Deve remover código após validação bem-sucedida (uso único)")
        void deveRemoverCodigoAposValidacaoBemSucedida() {
            String codigo = mfaService.gerarCodigoMfa(1L);

            assertThat(mfaService.validarCodigoMfa(1L, codigo)).isTrue();
            // Segunda tentativa com o mesmo código deve falhar
            assertThat(mfaService.validarCodigoMfa(1L, codigo)).isFalse();
        }

        @Test
        @DisplayName("Deve retornar false para código null")
        void deveRetornarFalseParaCodigoNull() {
            mfaService.gerarCodigoMfa(1L);

            assertThat(mfaService.validarCodigoMfa(1L, null)).isFalse();
        }
    }
}