package com.inova27.app.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("RateLimitFilter - limite por IP nos endpoints públicos")
class RateLimitFilterTest {

    private final RelogioAjustavel relogio = new RelogioAjustavel();
    private final RateLimitFilter filtro = new RateLimitFilter(relogio);

    @Test
    @DisplayName("Login: 10 tentativas por minuto por IP; a 11ª recebe 429 com Retry-After")
    void bloqueiaAposLimite() throws Exception {
        for (int i = 0; i < 10; i++) {
            assertThat(executar("POST", "/auth/login", "10.0.0.1").getStatus()).isEqualTo(200);
        }
        MockHttpServletResponse bloqueada = executar("POST", "/auth/login", "10.0.0.1");

        assertThat(bloqueada.getStatus()).isEqualTo(429);
        assertThat(bloqueada.getHeader("Retry-After")).isEqualTo("60");
        assertThat(bloqueada.getContentAsString()).contains("\"erro\"");
    }

    @Test
    @DisplayName("Contagem é por IP: outro IP não é afetado")
    void contagemPorIp() throws Exception {
        for (int i = 0; i < 11; i++) {
            executar("POST", "/auth/login", "10.0.0.1");
        }
        assertThat(executar("POST", "/auth/login", "10.0.0.2").getStatus()).isEqualTo(200);
    }

    @Test
    @DisplayName("Libera de novo quando a janela de 1 minuto passa")
    void liberaAposJanela() throws Exception {
        for (int i = 0; i < 11; i++) {
            executar("POST", "/auth/login", "10.0.0.1");
        }
        relogio.avancar(RateLimitFilter.JANELA);

        assertThat(executar("POST", "/auth/login", "10.0.0.1").getStatus()).isEqualTo(200);
    }

    @Test
    @DisplayName("Rotas sem regra e outros métodos não são limitados")
    void rotasSemRegraNaoSaoLimitadas() throws Exception {
        for (int i = 0; i < 50; i++) {
            assertThat(executar("GET", "/jogos", "10.0.0.1").getStatus()).isEqualTo(200);
            assertThat(executar("GET", "/auth/login", "10.0.0.1").getStatus()).isEqualTo(200);
        }
    }

    @Test
    @DisplayName("Regra por prefixo cobre os 3 passos da recuperação de e-mail com um único contador")
    void prefixoRecuperacaoEmail() throws Exception {
        for (int i = 0; i < 5; i++) {
            executar("POST", "/usuarios/recuperar-email/solicitar", "10.0.0.1");
            executar("POST", "/usuarios/recuperar-email/confirmar", "10.0.0.1");
        }
        assertThat(executar("POST", "/usuarios/recuperar-email/concluir", "10.0.0.1").getStatus()).isEqualTo(429);
    }

    private MockHttpServletResponse executar(String metodo, String uri, String ip) throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest(metodo, uri);
        request.setRemoteAddr(ip);
        MockHttpServletResponse response = new MockHttpServletResponse();
        filtro.doFilter(request, response, new MockFilterChain());
        return response;
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
