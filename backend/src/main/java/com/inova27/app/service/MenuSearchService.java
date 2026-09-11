package com.inova27.app.service;

import com.inova27.app.dto.buscapages.MenuRouteDTO;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@Service
public class MenuSearchService {

    // 🔥 CONSTANTES CRIADAS PARA RESOLVER OS AVISOS DO SONARQUBE
    private static final String ROLE_ADMIN = "ROLE_ADMIN";
    private static final String ROLE_PROFESSOR = "ROLE_PROFESSOR";
    private static final String PUBLIC = "PUBLIC";
    private static final String ICON_FOLDER_PLUS = "FolderPlus";

    private record MenuItem(String titulo, String tag, String rota, String icone, List<String> rolesPermitidas) {}

    // A "Tabela de Roteamento" oficial do sistema
    private final List<MenuItem> rotasSistema = Arrays.asList(

            // ==========================================
            // GESTÃO DE USUÁRIOS (Restrito a Admin)
            // ==========================================
            new MenuItem("Cadastrar Usuários do Sistema", "Admin", "/gestao/usuarios/novo-admin", "ShieldCheck", List.of(ROLE_ADMIN)),
            new MenuItem("Pesquisar Usuários do Sistema", "Admin", "/gestao/usuarios", "ShieldCheck", List.of(ROLE_ADMIN)),
            new MenuItem("Dashboard Geral", "Gráficos", "/admin", "Users", List.of(PUBLIC)),

            // ==========================================
            // PESSOAS E PESQUISADORES
            // ==========================================
            new MenuItem("Pesquisar Pessoas e Pesquisadores", "Talentos", "/pessoas/pesquisar", "Users", List.of(PUBLIC)), // ← Mudou para PUBLIC
            new MenuItem("Cadastrar Nova Pessoa", "Ação", "/admin/pessoas/cadastrar", "UserPlus", List.of(ROLE_ADMIN, ROLE_PROFESSOR)),

            // ==========================================
            // STARTUPS
            // ==========================================
            new MenuItem("Explorar Startups e Empresas", "Negócios", "/startups/pesquisar", "Rocket", List.of(PUBLIC)), // ← Mudou para PUBLIC
            new MenuItem("Cadastrar Nova Startup", "Ação", "/admin/startups/cadastrar", ICON_FOLDER_PLUS, List.of(ROLE_ADMIN)),

            // ==========================================
            // LABORATÓRIOS
            // ==========================================
            new MenuItem("Buscar Laboratórios", "Infraestrutura", "/laboratorios/pesquisar", "Beaker", List.of(PUBLIC)), // ← Mudou para PUBLIC
            new MenuItem("Cadastrar Novo Laboratório", "Ação", "/admin/laboratorios/cadastrar", ICON_FOLDER_PLUS, List.of(ROLE_ADMIN, ROLE_PROFESSOR)),

            // ==========================================
            // JOGOS
            // ==========================================
            new MenuItem("Catálogo de Jogos digitais", "Projetos", "/jogos/pesquisar", "Gamepad2", List.of(PUBLIC)), // ← Mudou para PUBLIC
            new MenuItem("Cadastrar Novo Jogo", "Ação", "/admin/jogos/cadastrar", ICON_FOLDER_PLUS, List.of(ROLE_ADMIN, ROLE_PROFESSOR)),

            // ==========================================
            // SERVIÇOS
            // ==========================================
            new MenuItem("Serviços Oferecidos", "Serviços", "/servicos/pesquisar", "Briefcase", List.of(PUBLIC)), // ← Mudou para PUBLIC
            new MenuItem("Cadastrar Novo Serviço", "Ação", "/admin/servicos/cadastrar", ICON_FOLDER_PLUS, List.of(ROLE_ADMIN))

    );

    public List<MenuRouteDTO> buscarRotasPermitidas(Authentication authentication) {

        // 1. Verifica de forma segura se o usuário está logado para extrair as roles
        List<String> userRoles = List.of(); // Começa vazio (Visitante)

        if (authentication != null && authentication.isAuthenticated() && !Objects.equals(authentication.getPrincipal(), "anonymousUser")) {
            userRoles = authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .toList();
        }

        // Precisamos dessas roles dentro do lambda, então criamos uma variável final/efetiva
        final List<String> finalUserRoles = userRoles;

        return rotasSistema.stream()
                // 2. O filtro agora checa: A rota é "PUBLIC"? OU o usuário tem a role necessária?
                .filter(item -> item.rolesPermitidas().contains(PUBLIC) ||
                        item.rolesPermitidas().stream().anyMatch(finalUserRoles::contains))
                .map(item -> new MenuRouteDTO(item.titulo(), item.tag(), item.rota(), item.icone()))
                .toList();
    }
}