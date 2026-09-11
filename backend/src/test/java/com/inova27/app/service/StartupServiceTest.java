package com.inova27.app.service;

import com.inova27.app.dto.startup.StartupCreateDTO;
import com.inova27.app.dto.startup.StartupResponseDTO;
import com.inova27.app.dto.startup.StartupUpdateDTO;
import com.inova27.app.mapper.DocumentoSemanticoMapper;
import com.inova27.app.model.AcaoAuditoria;
import com.inova27.app.model.Startup;
import com.inova27.app.repository.PessoaRepository;
import com.inova27.app.repository.StartupRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("StartupService - Testes Unitários")
class StartupServiceTest {

    @Mock private StartupRepository repository;
    @Mock private PessoaRepository pessoaRepository;
    @Mock private DocumentoSemanticoMapper mapper;
    @Mock private IndexadorSemanticoService indexador;
    @Mock private AuditoriaService auditoriaService;

    @InjectMocks
    private StartupService startupService;

    private Startup startupPadrao;

    @BeforeEach
    void setUp() {
        startupPadrao = new Startup();
        startupPadrao.setId(1L);
        startupPadrao.setNome("Startup X");
        startupPadrao.setDescricao("Descrição");
        startupPadrao.setPessoas(new HashSet<>());
        startupPadrao.setFotos(new HashSet<>());
    }

    // StartupCreateDTO(nome, descricao, area, dataFundacao, site, email, telefone, logo, status, fotos, cnpj, instagram, pessoasIds)
    private StartupCreateDTO dtoCreate(String nome) {
        return new StartupCreateDTO(nome, null, null, null, null, null, null, null, null, null, null, null, null);
    }

    // StartupUpdateDTO(nome, descricao, area, dataFundacao, site, email, telefone, logo, status, fotos, cnpj, instagram, pessoasIds)
    private StartupUpdateDTO dtoUpdate(String nome) {
        return new StartupUpdateDTO(nome, null, null, null, null, null, null, null, null, null, null, null, null);
    }

    @Nested
    @DisplayName("criar()")
    class Criar {

        @Test
        @DisplayName("Deve criar startup com sucesso")
        void deveCriarStartupComSucesso() {
            when(repository.existsByNome("Startup X")).thenReturn(false);
            when(repository.save(any(Startup.class))).thenReturn(startupPadrao);
            when(mapper.fromStartup(any())).thenReturn(null);

            StartupResponseDTO resultado = startupService.criar(dtoCreate("Startup X"), 1L);

            assertThat(resultado).isNotNull();
            verify(repository).save(any(Startup.class));
            verify(indexador).indexar(any());
            verify(auditoriaService).registrarLog(eq("Startup"), eq(1L), eq(AcaoAuditoria.CRIACAO), eq(1L), any());
        }

        @Test
        @DisplayName("Deve lançar exceção quando nome é nulo")
        void deveLancarExcecaoQuandoNomeNulo() {
            assertThatThrownBy(() -> startupService.criar(dtoCreate(null), 1L))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("O nome da startup é obrigatório.");
        }

        @Test
        @DisplayName("Deve lançar exceção quando nome é em branco")
        void deveLancarExcecaoQuandoNomeEmBranco() {
            assertThatThrownBy(() -> startupService.criar(dtoCreate("  "), 1L))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("O nome da startup é obrigatório.");
        }

        @Test
        @DisplayName("Deve lançar exceção quando nome já existe")
        void deveLancarExcecaoQuandoNomeJaExiste() {
            when(repository.existsByNome("Startup X")).thenReturn(true);

            assertThatThrownBy(() -> startupService.criar(dtoCreate("Startup X"), 1L))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("Já existe uma startup cadastrada com este nome.");
        }
    }

    @Nested
    @DisplayName("listarTodas()")
    class ListarTodas {

        @Test
        @DisplayName("Deve retornar todas as startups")
        void deveRetornarTodasStartups() {
            when(repository.findAll()).thenReturn(List.of(startupPadrao));

            List<StartupResponseDTO> resultado = startupService.listarTodas();

            assertThat(resultado).hasSize(1);
            assertThat(resultado.get(0).nome()).isEqualTo("Startup X");
        }

        @Test
        @DisplayName("Deve retornar lista vazia")
        void deveRetornarListaVazia() {
            when(repository.findAll()).thenReturn(List.of());

            assertThat(startupService.listarTodas()).isEmpty();
        }
    }

    @Nested
    @DisplayName("buscarPorId()")
    class BuscarPorId {

        @Test
        @DisplayName("Deve retornar startup quando encontrada")
        void deveRetornarStartupQuandoEncontrada() {
            when(repository.findById(1L)).thenReturn(Optional.of(startupPadrao));

            StartupResponseDTO resultado = startupService.buscarPorId(1L);

            assertThat(resultado).isNotNull();
            assertThat(resultado.nome()).isEqualTo("Startup X");
        }

        @Test
        @DisplayName("Deve lançar exceção quando não encontrada")
        void deveLancarExcecaoQuandoNaoEncontrada() {
            when(repository.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> startupService.buscarPorId(99L))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("Startup não encontrada");
        }
    }

    @Nested
    @DisplayName("atualizar()")
    class Atualizar {

        @Test
        @DisplayName("Deve atualizar startup com sucesso")
        void deveAtualizarStartupComSucesso() {
            StartupUpdateDTO dto = dtoUpdate("Novo Nome");

            when(repository.findById(1L)).thenReturn(Optional.of(startupPadrao));
            when(repository.save(any())).thenReturn(startupPadrao);
            when(mapper.fromStartup(any())).thenReturn(null);

            StartupResponseDTO resultado = startupService.atualizar(1L, dto, 1L);

            assertThat(resultado).isNotNull();
            verify(indexador).removerIndex("startups", 1L);
            verify(indexador).indexar(any());
            verify(auditoriaService).registrarLog(eq("Startup"), eq(1L), eq(AcaoAuditoria.EDICAO), eq(1L), eq(dto));
        }

        @Test
        @DisplayName("Deve lançar exceção quando startup não encontrada")
        void deveLancarExcecaoQuandoNaoEncontrada() {
            when(repository.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> startupService.atualizar(99L, dtoUpdate("Nome"), 1L))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("Startup não encontrada");
        }
    }

    @Nested
    @DisplayName("deletar()")
    class Deletar {

        @Test
        @DisplayName("Deve deletar startup com sucesso")
        void deveDeletarStartupComSucesso() {
            when(repository.findById(1L)).thenReturn(Optional.of(startupPadrao));

            startupService.deletar(1L, 99L);

            verify(repository).delete(startupPadrao);
            verify(auditoriaService).registrarLog(eq("Startup"), eq(1L), eq(AcaoAuditoria.DELECAO), eq(99L), any());
            verify(indexador).removerIndex("startups", 1L);
        }

        @Test
        @DisplayName("Deve lançar exceção quando startup não encontrada")
        void deveLancarExcecaoQuandoNaoEncontrada() {
            when(repository.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> startupService.deletar(99L, 1L))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("Startup não encontrada");

            verify(repository, never()).delete((Startup) any());
        }
    }
}
