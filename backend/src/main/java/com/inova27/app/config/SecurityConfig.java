package com.inova27.app.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private static final String ROLE_ADMIN = "ADMIN";
    private static final String ROLE_PROFESSOR = "PROFESSOR";

    @Value("${api.paths.usuarios}")
    private String pathUsuariosWildcard;

    @Value("${api.paths.pessoas-id}")
    private String pathPessoasId;

    @Value("${api.paths.jogos-id}")
    private String pathJogosId;

    @Value("${api.paths.laboratorios-id}")
    private String pathLaboratoriosId;

    @Value("${api.paths.startups-id}")
    private String pathStartupsId;

    @Value("${api.paths.protecoes-id}")
    private String pathProtecoesId;

    @Value("${api.paths.servicos-id}")
    private String pathServicosId;

    @Value("${api.paths.engines-id}")
    private String pathEnginesId;

    @Value("${api.paths.linguagens-id}")
    private String pathLinguagensId;

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity httpSecurity,
            SecurityFilter securityFilter,
            CustomAccessDeniedHandler customAccessDeniedHandler
    ) {

        return httpSecurity
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize

                        .requestMatchers(HttpMethod.POST, "/contato").permitAll()
                        .requestMatchers("/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/auth/primeiro-acesso").permitAll()
                        .requestMatchers(HttpMethod.POST, "/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/auth/register").permitAll()
                        .requestMatchers(HttpMethod.POST, "/auth/forgot-password").permitAll()
                        .requestMatchers(HttpMethod.POST, "/auth/reset-password").permitAll()
                        .requestMatchers(HttpMethod.GET, "/busca").permitAll()
                        .requestMatchers(HttpMethod.GET, "/menu/permitidas").permitAll()
                        .requestMatchers(HttpMethod.POST, "/usuarios/recuperar-email/solicitar").permitAll()
                        .requestMatchers(HttpMethod.POST, "/usuarios/recuperar-email/confirmar").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/usuarios/meus-dados").hasAnyRole(ROLE_ADMIN, ROLE_PROFESSOR)
                        .requestMatchers(HttpMethod.GET, "/usuarios/meus-dados").hasAnyRole(ROLE_ADMIN, ROLE_PROFESSOR)
                        .requestMatchers(HttpMethod.GET, pathUsuariosWildcard).hasRole(ROLE_ADMIN)
                        .requestMatchers(HttpMethod.PUT, pathUsuariosWildcard).hasRole(ROLE_ADMIN)
                        .requestMatchers(HttpMethod.DELETE, pathUsuariosWildcard).hasRole(ROLE_ADMIN)
                        .requestMatchers(HttpMethod.GET, "/pessoas").permitAll()
                        .requestMatchers(HttpMethod.GET, pathPessoasId).permitAll()
                        .requestMatchers(HttpMethod.POST, "/pessoas").permitAll()
                        .requestMatchers(HttpMethod.GET, "/pessoas/minhas").authenticated()
                        .requestMatchers(HttpMethod.PUT, pathPessoasId).authenticated()
                        .requestMatchers(HttpMethod.DELETE, pathPessoasId).authenticated()
                        .requestMatchers(HttpMethod.GET, "/jogos").permitAll()
                        .requestMatchers(HttpMethod.GET, pathJogosId).permitAll()
                        .requestMatchers(HttpMethod.POST, "/jogos").permitAll()
                        .requestMatchers(HttpMethod.PUT, pathJogosId).hasAnyRole(ROLE_ADMIN, ROLE_PROFESSOR)
                        .requestMatchers(HttpMethod.DELETE, pathJogosId).hasAnyRole(ROLE_ADMIN, ROLE_PROFESSOR)
                        .requestMatchers(HttpMethod.GET, "/laboratorios").permitAll()
                        .requestMatchers(HttpMethod.GET, pathLaboratoriosId).permitAll()
                        .requestMatchers(HttpMethod.POST, "/laboratorios").permitAll()
                        .requestMatchers(HttpMethod.PUT, pathLaboratoriosId).hasAnyRole(ROLE_ADMIN, ROLE_PROFESSOR)
                        .requestMatchers(HttpMethod.DELETE, pathLaboratoriosId).hasAnyRole(ROLE_ADMIN, ROLE_PROFESSOR)
                        .requestMatchers(HttpMethod.GET, "/startups").permitAll()
                        .requestMatchers(HttpMethod.GET, pathStartupsId).permitAll()
                        .requestMatchers(HttpMethod.POST, "/startups").hasRole(ROLE_ADMIN)
                        .requestMatchers(HttpMethod.PUT, pathStartupsId).hasRole(ROLE_ADMIN)
                        .requestMatchers(HttpMethod.DELETE, pathStartupsId).hasRole(ROLE_ADMIN)
                        .requestMatchers(HttpMethod.GET, "/protecoes").permitAll()
                        .requestMatchers(HttpMethod.GET, pathProtecoesId).permitAll()
                        .requestMatchers(HttpMethod.POST, "/protecoes").hasRole(ROLE_ADMIN)
                        .requestMatchers(HttpMethod.PUT, pathProtecoesId).hasRole(ROLE_ADMIN)
                        .requestMatchers(HttpMethod.DELETE, pathProtecoesId).hasRole(ROLE_ADMIN)
                        .requestMatchers(HttpMethod.GET, "/servicos").permitAll()
                        .requestMatchers(HttpMethod.GET, pathServicosId).permitAll()
                        .requestMatchers(HttpMethod.POST, "/servicos").hasRole(ROLE_ADMIN)
                        .requestMatchers(HttpMethod.PUT, pathServicosId).hasRole(ROLE_ADMIN)
                        .requestMatchers(HttpMethod.DELETE, pathServicosId).hasRole(ROLE_ADMIN)
                        .requestMatchers(HttpMethod.GET, "/engines").permitAll()
                        .requestMatchers(HttpMethod.GET, pathEnginesId).permitAll()
                        .requestMatchers(HttpMethod.POST, "/engines").hasRole(ROLE_ADMIN)
                        .requestMatchers(HttpMethod.PUT, pathEnginesId).hasRole(ROLE_ADMIN)
                        .requestMatchers(HttpMethod.DELETE, pathEnginesId).hasRole(ROLE_ADMIN)
                        .requestMatchers(HttpMethod.GET, "/linguagens").permitAll()
                        .requestMatchers(HttpMethod.GET, pathLinguagensId).permitAll()
                        .requestMatchers(HttpMethod.POST, "/linguagens").hasRole(ROLE_ADMIN)
                        .requestMatchers(HttpMethod.PUT, pathLinguagensId).hasRole(ROLE_ADMIN)
                        .requestMatchers(HttpMethod.DELETE, pathLinguagensId).hasRole(ROLE_ADMIN)
                        .anyRequest().hasRole(ROLE_ADMIN)
                )
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) {
        return authenticationConfiguration.getAuthenticationManager();
    }
}