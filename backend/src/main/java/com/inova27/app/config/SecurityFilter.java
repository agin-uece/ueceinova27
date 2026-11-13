package com.inova27.app.config;

import com.inova27.app.exception.BusinessException;
import com.inova27.app.repository.UsuarioRepository;
import com.inova27.app.service.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Autentica a requisição a partir do header "Authorization: Bearer <jwt>".
 * Token ausente, inválido, expirado ou de usuário inexistente/inativo => a requisição segue como anônima:
 * rotas públicas funcionam normalmente e as protegidas recebem 401 do SecurityErrorHandler.
 */
@Component
@RequiredArgsConstructor
public class SecurityFilter extends OncePerRequestFilter {

    private static final String PREFIXO_BEARER = "Bearer ";

    private final TokenService tokenService;

    private final UsuarioRepository usuarioRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String token = recuperarToken(request);

        if (token != null) {
            try {
                String login = tokenService.validarToken(token);
                usuarioRepository.findByEmail(login).ifPresent(usuario -> SecurityContextHolder.getContext().setAuthentication(
                        new UsernamePasswordAuthenticationToken(usuario, null, usuario.getAuthorities())));
            } catch (BusinessException tokenInvalido) {
                // segue como anônimo
            }
        }

        filterChain.doFilter(request, response);
    }

    private String recuperarToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith(PREFIXO_BEARER)) {
            return null;
        }
        return authHeader.substring(PREFIXO_BEARER.length());
    }
}
