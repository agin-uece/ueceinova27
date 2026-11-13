package com.inova27.app.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Limite de requisições por IP nos endpoints públicos que custam caro ou permitem abuso
 * (força bruta de senha, disparo de e-mails, chamadas ao Ollama). Excedeu: 429 + Retry-After.
 *
 * Roda depois do Spring Security (ordem padrão dos filtros), então a resposta 429 já sai com os headers de CORS.
 * Atrás de proxy reverso, o IP real vem do X-Forwarded-For (server.forward-headers-strategy=native).
 *
 * ponytail: contadores em memória e janela fixa — vale para uma única instância do backend;
 * com várias réplicas, mover para Redis (ex.: Bucket4j) ou limitar no proxy reverso.
 */
@Component
public class RateLimitFilter extends OncePerRequestFilter {

    static final Duration JANELA = Duration.ofMinutes(1);
    private static final int LIMPAR_ACIMA_DE = 10_000;

    record Regra(String nome, String metodo, Set<String> caminhos, boolean prefixo, int limitePorJanela) {
        boolean aplicaA(HttpServletRequest request) {
            String uri = request.getRequestURI();
            return metodo.equals(request.getMethod())
                    && caminhos.stream().anyMatch(c -> prefixo ? uri.startsWith(c) : uri.equals(c));
        }
    }

    static final List<Regra> REGRAS = List.of(
            new Regra("login", "POST", Set.of("/auth/login"), false, 10),
            new Regra("esqueci-senha", "POST", Set.of("/auth/forgot-password"), false, 5),
            new Regra("redefinir-senha", "POST", Set.of("/auth/reset-password", "/auth/primeiro-acesso"), false, 10),
            new Regra("cadastro-usuario", "POST", Set.of("/auth/register"), false, 10),
            new Regra("recuperar-email", "POST", Set.of("/usuarios/recuperar-email/"), true, 10),
            new Regra("contato", "POST", Set.of("/contato"), false, 5),
            new Regra("cadastro-conteudo", "POST", Set.of("/pessoas", "/jogos", "/laboratorios"), false, 20),
            new Regra("busca", "GET", Set.of("/busca"), false, 30)
    );

    private record Janela(long inicioMillis, int contagem) {}

    private final Map<String, Janela> janelas = new ConcurrentHashMap<>();
    private final Clock clock;

    public RateLimitFilter() {
        this(Clock.systemUTC());
    }

    RateLimitFilter(Clock clock) {
        this.clock = clock;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        for (Regra regra : REGRAS) {
            if (regra.aplicaA(request) && !permitir(regra.nome() + "|" + request.getRemoteAddr(), regra.limitePorJanela())) {
                response.setStatus(429);
                response.setHeader("Retry-After", String.valueOf(JANELA.toSeconds()));
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                response.setCharacterEncoding(StandardCharsets.UTF_8.name());
                response.getWriter().write("{\"erro\": \"Muitas tentativas. Aguarde um minuto e tente novamente.\"}");
                return;
            }
        }
        filterChain.doFilter(request, response);
    }

    boolean permitir(String chave, int limite) {
        long agora = clock.millis();
        if (janelas.size() > LIMPAR_ACIMA_DE) {
            janelas.values().removeIf(j -> expirada(j, agora));
        }
        Janela janela = janelas.compute(chave, (k, atual) -> atual == null || expirada(atual, agora)
                ? new Janela(agora, 1)
                : new Janela(atual.inicioMillis(), atual.contagem() + 1));
        return janela.contagem() <= limite;
    }

    private static boolean expirada(Janela janela, long agora) {
        return agora - janela.inicioMillis() >= JANELA.toMillis();
    }
}
