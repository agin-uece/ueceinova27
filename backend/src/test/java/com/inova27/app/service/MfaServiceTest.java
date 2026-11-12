package com.inova27.app.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;

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

    @Nested
    @DisplayName("Proteções contra força bruta")
    class ProtecoesForcaBruta {

        private final RelogioAjustavel relogio = new RelogioAjustavel();
        private final MfaService service = new MfaService(relogio);

        @Test
        @DisplayName("Código expira após a validade")
        void codigoExpira() {
            String codigo = service.gerarCodigoMfa(1L);
            relogio.avancar(MfaService.VALIDADE);

            assertThat(service.validarCodigoMfa(1L, codigo)).isFalse();
        }

        @Test
        @DisplayName("Código é descartado após o limite de tentativas erradas")
        void descartaAposTentativas() {
            String codigo = service.gerarCodigoMfa(1L);
            for (int i = 0; i < MfaService.MAX_TENTATIVAS; i++) {
                assertThat(service.validarCodigoMfa(1L, "errado")).isFalse();
            }

            assertThat(service.validarCodigoMfa(1L, codigo)).isFalse();
        }

        @Test
        @DisplayName("Ainda aceita o código correto antes de atingir o limite")
        void aceitaAntesDoLimite() {
            String codigo = service.gerarCodigoMfa(1L);
            for (int i = 0; i < MfaService.MAX_TENTATIVAS - 1; i++) {
                service.validarCodigoMfa(1L, "errado");
            }

            assertThat(service.validarCodigoMfa(1L, codigo)).isTrue();
        }

        @Test
        @DisplayName("Códigos de finalidades diferentes não se misturam")
        void finalidadesIsoladas() {
            String recuperacao = service.gerarCodigo(MfaService.FINALIDADE_RECUPERACAO_EMAIL, "1");

            assertThat(service.validarCodigoMfa(1L, recuperacao)).isFalse();
            assertThat(service.validarCodigo(MfaService.FINALIDADE_RECUPERACAO_EMAIL, "1", recuperacao)).isTrue();
        }

        @Test
        @DisplayName("Não permite reenvio antes do intervalo mínimo")
        void intervaloDeReenvio() {
            assertThat(service.podeReenviar(MfaService.FINALIDADE_RECUPERACAO_EMAIL, "1")).isTrue();
            service.gerarCodigo(MfaService.FINALIDADE_RECUPERACAO_EMAIL, "1");

            assertThat(service.podeReenviar(MfaService.FINALIDADE_RECUPERACAO_EMAIL, "1")).isFalse();
            relogio.avancar(MfaService.INTERVALO_REENVIO.plusSeconds(1));
            assertThat(service.podeReenviar(MfaService.FINALIDADE_RECUPERACAO_EMAIL, "1")).isTrue();
        }
    }

    private static final class RelogioAjustavel extends Clock {
        private Instant agora = Instant.parse("2026-01-01T00:00:00Z");

        void avancar(Duration duracao) {
            agora = agora.plus(duracao);
        }

        @Override
        public Instant instant() {
            return agora;
        }

        @Override
        public ZoneId getZone() {
            return ZoneOffset.UTC;
        }

        @Override
        public Clock withZone(ZoneId zone) {
            return this;
        }
    }
}
