package com.inova27.app.service;

import com.inova27.app.dto.buscapages.MenuRouteDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

class MenuSearchServiceTest {

    private MenuSearchService menuSearchService;

    @BeforeEach
    void setUp() {
        // Como o serviço não tem dependências injetadas, instanciamos diretamente
        menuSearchService = new MenuSearchService();
    }

    @Test
    @DisplayName("Deve retornar apenas rotas PUBLIC quando authentication for null")
    void testBuscarRotasPermitidas_NullAuthentication() {
        // Ação
        List<MenuRouteDTO> rotas = menuSearchService.buscarRotasPermitidas(null);

        // Verificação
        // Esperamos 6 rotas públicas conforme a lista oficial do serviço
        assertThat(rotas).hasSize(6);
        assertThat(rotas)
                .extracting(MenuRouteDTO::rota)
                .containsExactlyInAnyOrder(
                        "/admin",
                        "/pessoas/pesquisar",
                        "/startups/pesquisar",
                        "/laboratorios/pesquisar",
                        "/jogos/pesquisar",
                        "/servicos/pesquisar"
                );
    }

    @Test
    @DisplayName("Deve retornar apenas rotas PUBLIC para usuario anonimo (anonymousUser)")
    void testBuscarRotasPermitidas_AnonymousUser() {
        // Cenário: O Spring Security as vezes passa um "anonymousUser" em vez de null
        Authentication authentication = Mockito.mock(Authentication.class);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn("anonymousUser");

        // Ação
        List<MenuRouteDTO> rotas = menuSearchService.buscarRotasPermitidas(authentication);

        // Verificação
        assertThat(rotas).hasSize(6);
    }

    @Test
    @DisplayName("Deve retornar rotas PUBLIC e PROFESSOR para usuario com ROLE_PROFESSOR")
    void testBuscarRotasPermitidas_ProfessorUser() {
        // Cenário
        Authentication authentication = Mockito.mock(Authentication.class);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn("professor@uece.br");

        Collection<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_PROFESSOR"));
        Mockito.<Collection<? extends GrantedAuthority>>when(authentication.getAuthorities()).thenReturn(authorities);

        // Ação
        List<MenuRouteDTO> rotas = menuSearchService.buscarRotasPermitidas(authentication);

        // Verificação
        // Esperamos 9 rotas (6 public + 3 que permitem professor: cadastrar pessoa, laboratório e jogo)
        assertThat(rotas).hasSize(9);

        // Verifica se ele TEM acesso às telas de cadastro permitidas
        assertThat(rotas)
                .extracting(MenuRouteDTO::rota)
                .contains("/admin/pessoas/cadastrar", "/admin/laboratorios/cadastrar", "/admin/jogos/cadastrar");

        // Garante que ele NÃO TEM acesso às rotas exclusivas de Admin
        assertThat(rotas)
                .extracting(MenuRouteDTO::rota)
                .doesNotContain("/gestao/usuarios/novo-admin", "/admin/startups/cadastrar", "/admin/servicos/cadastrar");
    }
}