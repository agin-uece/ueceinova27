package com.inova27.app.service;

import com.inova27.app.dto.servico.ServicoCreateDTO;
import com.inova27.app.dto.servico.ServicoResponseDTO;
import com.inova27.app.dto.servico.ServicoUpdateDTO;
import com.inova27.app.mapper.DocumentoSemanticoMapper;
import com.inova27.app.model.AcaoAuditoria;
import com.inova27.app.model.Pessoa;
import com.inova27.app.model.Servico;
import com.inova27.app.repository.PessoaRepository;
import com.inova27.app.repository.ServicoRepository;
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
import java.util.Set;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ServicoService - Testes Unitários")
class ServicoServiceTest {

    @Mock private ServicoRepository repository;
    @Mock private PessoaRepository pessoaRepository;
    @Mock private AuditoriaService auditoriaService;
    @Mock private DocumentoSemanticoMapper mapper;
    @Mock private IndexadorSemanticoService indexador;

    @InjectMocks
    private ServicoService servicoService;

    private Servico servicoPadrao;

    @BeforeEach
    void setUp() {
        servicoPadrao = new Servico();
        servicoPadrao.setId(1L);
        servicoPadrao.setAreaAtuacao("TI");
        servicoPadrao.setDescricao("Descrição do serviço");
        servicoPadrao.setEmail("servico@email.com");
        servicoPadrao.setTelefone("85999999999");
        servicoPadrao.setContato("Contato");
        servicoPadrao.setPrestadores(new HashSet<>());
    }

    // ServicoCreateDTO(prestadoresIds, areaAtuacao, descricao, contato, email, telefone)
    private ServicoCreateDTO dtoCreate(Set<Long> prestadoresIds) {
        return new ServicoCreateDTO(prestadoresIds, "TI", "Descrição", "Contato", "s@email.com", "85999999999");
    }

    // ServicoUpdateDTO(prestadoresIds, areaAtuacao, descricao, contato, email, telefone)
    private ServicoUpdateDTO dtoUpdate(Set<Long> prestadoresIds) {
        return new ServicoUpdateDTO(prestadoresIds, "Nova Área", "Nova Desc", null, null, null);
    }

    @Nested
    @DisplayName("criar()")
    class Criar {

        @Test
        @DisplayName("Deve criar serviço sem prestadores com sucesso")
        void deveCriarServicoSemPrestadores() {
            when(repository.save(any(Servico.class))).thenReturn(servicoPadrao);
            when(mapper.fromServico(any())).thenReturn(null);

            ServicoResponseDTO resultado = servicoService.criar(dtoCreate(null), 1L);

            assertThat(resultado).isNotNull();
            verify(repository).save(any(Servico.class));
            verify(indexador).indexar(any());
            verify(auditoriaService).registrarLog(eq("Servico"), eq(1L), eq(AcaoAuditoria.CRIACAO), eq(1L), any());
        }

        @Test
        @DisplayName("Deve criar serviço com prestadores com sucesso")
        void deveCriarServicoComPrestadores() {
            Pessoa pessoa = new Pessoa();
            pessoa.setId(10L);
            pessoa.setNome("Prestador A");

            when(pessoaRepository.findAllById(Set.of(10L))).thenReturn(List.of(pessoa));
            when(repository.save(any(Servico.class))).thenReturn(servicoPadrao);
            when(mapper.fromServico(any())).thenReturn(null);

            servicoService.criar(dtoCreate(Set.of(10L)), 1L);

            verify(pessoaRepository).findAllById(Set.of(10L));
        }
    }

    @Nested
    @DisplayName("listarTodos()")
    class ListarTodos {

        @Test
        @DisplayName("Deve retornar todos os serviços")
        void deveRetornarTodosServicos() {
            when(repository.findAll()).thenReturn(List.of(servicoPadrao));

            List<ServicoResponseDTO> resultado = servicoService.listarTodos();

            assertThat(resultado).hasSize(1);
            assertThat(resultado.get(0).areaAtuacao()).isEqualTo("TI");
        }

        @Test
        @DisplayName("Deve retornar lista vazia")
        void deveRetornarListaVazia() {
            when(repository.findAll()).thenReturn(List.of());

            assertThat(servicoService.listarTodos()).isEmpty();
        }
    }

    @Nested
    @DisplayName("buscarPorId()")
    class BuscarPorId {

        @Test
        @DisplayName("Deve retornar serviço quando encontrado")
        void deveRetornarServicoQuandoEncontrado() {
            when(repository.findById(1L)).thenReturn(Optional.of(servicoPadrao));

            ServicoResponseDTO resultado = servicoService.buscarPorId(1L);

            assertThat(resultado).isNotNull();
            assertThat(resultado.areaAtuacao()).isEqualTo("TI");
        }

        @Test
        @DisplayName("Deve lançar exceção quando não encontrado")
        void deveLancarExcecaoQuandoNaoEncontrado() {
            when(repository.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> servicoService.buscarPorId(99L))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("Serviço não encontrado");
        }
    }

    @Nested
    @DisplayName("atualizar()")
    class Atualizar {

        @Test
        @DisplayName("Deve atualizar serviço sem prestadores com sucesso")
        void deveAtualizarServicoComSucesso() {
            ServicoUpdateDTO dto = dtoUpdate(null);

            when(repository.findById(1L)).thenReturn(Optional.of(servicoPadrao));
            when(repository.save(any())).thenReturn(servicoPadrao);
            when(mapper.fromServico(any())).thenReturn(null);

            ServicoResponseDTO resultado = servicoService.atualizar(1L, dto, 1L);

            assertThat(resultado).isNotNull();
            verify(indexador).removerIndex("servicos", 1L);
            verify(indexador).indexar(any());
            verify(auditoriaService).registrarLog(eq("Servico"), eq(1L), eq(AcaoAuditoria.EDICAO), eq(1L), eq(dto));
        }

        @Test
        @DisplayName("Deve atualizar prestadores quando fornecidos")
        void deveAtualizarPrestadoresQuandoFornecidos() {
            Pessoa pessoa = new Pessoa();
            pessoa.setId(10L);

            when(repository.findById(1L)).thenReturn(Optional.of(servicoPadrao));
            when(pessoaRepository.findAllById(Set.of(10L))).thenReturn(List.of(pessoa));
            when(repository.save(any())).thenReturn(servicoPadrao);
            when(mapper.fromServico(any())).thenReturn(null);

            servicoService.atualizar(1L, dtoUpdate(Set.of(10L)), 1L);

            verify(pessoaRepository).findAllById(Set.of(10L));
        }

        @Test
        @DisplayName("Deve lançar exceção quando não encontrado")
        void deveLancarExcecaoQuandoNaoEncontrado() {
            when(repository.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> servicoService.atualizar(99L, dtoUpdate(null), 1L))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("Serviço não encontrado");
        }
    }

    @Nested
    @DisplayName("deletar()")
    class Deletar {

        @Test
        @DisplayName("Deve deletar serviço com sucesso")
        void deveDeletarServicoComSucesso() {
            when(repository.findById(1L)).thenReturn(Optional.of(servicoPadrao));

            servicoService.deletar(1L, 99L);

            verify(repository).delete(servicoPadrao);
            verify(auditoriaService).registrarLog(eq("Servico"), eq(1L), eq(AcaoAuditoria.DELECAO), eq(99L), any());
            verify(indexador).removerIndex("servicos", 1L);
        }

        @Test
        @DisplayName("Deve lançar exceção quando não encontrado")
        void deveLancarExcecaoQuandoNaoEncontrado() {
            when(repository.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> servicoService.deletar(99L, 1L))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("Serviço não encontrado");

            verify(repository, never()).delete((Servico) any());
        }
    }
}

