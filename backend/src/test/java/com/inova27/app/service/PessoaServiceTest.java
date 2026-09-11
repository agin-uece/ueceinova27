package com.inova27.app.service;

import com.inova27.app.dto.pessoa.PessoaCreateDTO;
import com.inova27.app.dto.pessoa.PessoaResponseDTO;
import com.inova27.app.dto.pessoa.PessoaUpdateDTO;
import com.inova27.app.exception.BusinessException;
import com.inova27.app.exception.ResourceNotFoundException;
import com.inova27.app.mapper.DocumentoSemanticoMapper;
import com.inova27.app.model.*;
import com.inova27.app.repository.LaboratorioRepository;
import com.inova27.app.repository.PessoaRepository;
import com.inova27.app.repository.ProtecaoRepository;
import com.inova27.app.repository.StartupRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("PessoaService - Testes Unitários")
class PessoaServiceTest {

    @Mock private PessoaRepository repository;
    @Mock private LaboratorioRepository laboratorioRepository;
    @Mock private StartupRepository startupRepository;
    @Mock private ProtecaoRepository protecaoRepository;
    @Mock private DocumentoSemanticoMapper mapper;
    @Mock private IndexadorSemanticoService indexador;
    @Mock private AuditoriaService auditoriaService;
    @Mock private SolicitacaoAlteracaoService solicitacaoService;

    @InjectMocks
    private PessoaService pessoaService;

    private Usuario admin;
    private Usuario professor;
    private Pessoa pessoaPadrao;

    @BeforeEach
    void setUp() {
        admin = new Usuario();
        admin.setId(1L);
        admin.setRole(UserRole.ADMIN);

        professor = new Usuario();
        professor.setId(2L);
        professor.setRole(UserRole.PROFESSOR);

        pessoaPadrao = new Pessoa();
        pessoaPadrao.setId(10L);
        pessoaPadrao.setNome("Dr. Inovador");
        pessoaPadrao.setEmail("inovador@uece.br");
        pessoaPadrao.setUserInclusaoId(2L);
        pessoaPadrao.setStatus(StatusValidacao.PENDENTE);
        pessoaPadrao.setStartups(new HashSet<>());
        pessoaPadrao.setProtecoes(new HashSet<>());
    }

    // =========================================================
    // CRIAR
    // =========================================================
    @Nested
    @DisplayName("criar()")
    class Criar {

        @Test
        @DisplayName("Deve criar pessoa PENDENTE se usuário comum e disparar e-mail de notificação")
        void deveCriarPendenteSeUsuarioComum() {
            PessoaCreateDTO dto = new PessoaCreateDTO("Novo", "novo@uece.br", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);

            when(repository.existsByEmail("novo@uece.br")).thenReturn(false);
            when(repository.save(any(Pessoa.class))).thenAnswer(i -> {
                Pessoa p = i.getArgument(0);
                p.setId(15L);
                return p;
            });

            PessoaResponseDTO resultado = pessoaService.criar(dto, professor);

            assertThat(resultado).isNotNull();
            verify(solicitacaoService).enviarEmailNotificacaoCriacao(TipoEntidade.PESSOA, "Novo");
            verify(indexador, never()).indexar(any());
            verify(auditoriaService).registrarLog(eq("Pessoa"), eq(15L), eq(AcaoAuditoria.CRIACAO), eq(2L), any());
        }

        @Test
        @DisplayName("Deve criar pessoa APROVADA e indexar se for ADMIN")
        void deveCriarAprovadaSeAdmin() {
            PessoaCreateDTO dto = new PessoaCreateDTO("Admin Criou", "adminc@uece.br", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);

            when(repository.existsByEmail("adminc@uece.br")).thenReturn(false);
            when(repository.save(any(Pessoa.class))).thenAnswer(i -> {
                Pessoa p = i.getArgument(0);
                p.setId(16L);
                return p;
            });

            PessoaResponseDTO resultado = pessoaService.criar(dto, admin);

            assertThat(resultado).isNotNull();
            verify(solicitacaoService, never()).enviarEmailNotificacaoCriacao(any(), any());
            verify(mapper).fromPessoa(any(Pessoa.class));
            verify(indexador).indexar(any());
        }

        @Test
        @DisplayName("Deve criar com vínculos de laboratório, startups e proteções")
        void deveCriarComVinculos() {
            PessoaCreateDTO dto = new PessoaCreateDTO("Vinculos", "vinculos@uece.br", null, null, null, null, null, null, null, null, null, null, null, null, null, List.of(1L), List.of(2L), 3L);

            Laboratorio lab = new Laboratorio(); lab.setId(3L);
            Startup startup = new Startup(); startup.setId(1L);
            Protecao protecao = new Protecao(); protecao.setId(2L);

            when(repository.existsByEmail("vinculos@uece.br")).thenReturn(false);
            when(laboratorioRepository.findById(3L)).thenReturn(Optional.of(lab));
            when(startupRepository.findAllById(List.of(1L))).thenReturn(List.of(startup));
            when(protecaoRepository.findAllById(List.of(2L))).thenReturn(List.of(protecao));
            when(repository.save(any(Pessoa.class))).thenAnswer(i -> i.getArgument(0));

            pessoaService.criar(dto, admin);

            ArgumentCaptor<Pessoa> pessoaCaptor = ArgumentCaptor.forClass(Pessoa.class);
            verify(repository).save(pessoaCaptor.capture());

            Pessoa salva = pessoaCaptor.getValue();
            assertThat(salva.getLaboratorio()).isEqualTo(lab);
            assertThat(salva.getStartups()).contains(startup);
            assertThat(salva.getProtecoes()).contains(protecao);
        }

        @Test
        @DisplayName("Deve lançar BusinessException se e-mail já existe")
        void deveLancarExcecaoSeEmailExiste() {
            PessoaCreateDTO dto = new PessoaCreateDTO("Existente", "existente@uece.br", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
            when(repository.existsByEmail("existente@uece.br")).thenReturn(true);

            assertThatThrownBy(() -> pessoaService.criar(dto, admin))
                    .isInstanceOf(BusinessException.class)
                    .hasMessageContaining("Já existe uma pessoa cadastrada com este e-mail.");
        }
    }

    // =========================================================
    // BUSCAR
    // =========================================================
    @Nested
    @DisplayName("buscarPorId()")
    class BuscarPorId {

        @Test
        @DisplayName("Deve buscar pessoa pendente se usuário for o dono")
        void deveBuscarSeForDono() {
            when(repository.findById(10L)).thenReturn(Optional.of(pessoaPadrao));

            PessoaResponseDTO resposta = pessoaService.buscarPorId(10L, professor);
            assertThat(resposta.nome()).isEqualTo("Dr. Inovador");
        }

        @Test
        @DisplayName("Deve lançar exceção se usuário comum tentar buscar pessoa pendente de outro")
        void deveLancarExcecaoSeNaoAutorizado() {
            Usuario bisbilhoteiro = new Usuario();
            bisbilhoteiro.setId(99L);
            bisbilhoteiro.setRole(UserRole.PROFESSOR);

            when(repository.findById(10L)).thenReturn(Optional.of(pessoaPadrao));

            assertThatThrownBy(() -> pessoaService.buscarPorId(10L, bisbilhoteiro))
                    .isInstanceOf(BusinessException.class)
                    .hasMessage("Pessoa ainda não validada.");
        }
    }

    // =========================================================
    // ATUALIZAR E DELETAR
    // =========================================================
    @Nested
    @DisplayName("Atualização e Deleção (Fluxos Híbridos)")
    class Modificacoes {

        @Test
        @DisplayName("ATUALIZAR: Deve criar solicitação de edição se for dono não-admin")
        void deveCriarSolicitacaoDeEdicaoSeDono() {
            PessoaUpdateDTO dto = new PessoaUpdateDTO("Novo Nome", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
            when(repository.findById(10L)).thenReturn(Optional.of(pessoaPadrao));

            PessoaResponseDTO resultado = pessoaService.atualizar(10L, dto, professor);

            assertThat(resultado).isNull();
            verify(solicitacaoService).registrarSolicitacao(TipoEntidade.PESSOA, 10L, TipoAcao.EDICAO, dto, 2L);
            verify(repository, never()).save(any());
        }

        @Test
        @DisplayName("ATUALIZAR: Deve atualizar diretamente e reindexar se for admin")
        void deveAtualizarSeAdmin() {
            PessoaUpdateDTO dto = new PessoaUpdateDTO("Nome Editado", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
            when(repository.findById(10L)).thenReturn(Optional.of(pessoaPadrao));
            when(repository.save(any(Pessoa.class))).thenReturn(pessoaPadrao);

            PessoaResponseDTO resultado = pessoaService.atualizar(10L, dto, admin);

            assertThat(resultado.nome()).isEqualTo("Nome Editado");
            verify(indexador).removerIndex("pessoas", 10L);
            verify(indexador).indexar(any());
        }

        @Test
        @DisplayName("DELETAR: Deve criar solicitação de exclusão se for dono não-admin")
        void deveCriarSolicitacaoDeExclusaoSeDono() {
            when(repository.findById(10L)).thenReturn(Optional.of(pessoaPadrao));

            boolean excluido = pessoaService.deletar(10L, professor);

            assertThat(excluido).isFalse();
            verify(solicitacaoService).registrarSolicitacao(TipoEntidade.PESSOA, 10L, TipoAcao.EXCLUSAO, null, 2L);
            verify(repository, never()).delete((Pessoa) any());
        }

        @Test
        @DisplayName("DELETAR: Deve deletar diretamente e remover do index se for admin")
        void deveDeletarSeAdmin() {
            when(repository.findById(10L)).thenReturn(Optional.of(pessoaPadrao));

            boolean excluido = pessoaService.deletar(10L, admin);

            assertThat(excluido).isTrue();
            verify(repository).delete(pessoaPadrao);
            verify(indexador).removerIndex("pessoas", 10L);
            verify(auditoriaService).registrarLog(eq("Pessoa"), eq(10L), eq(AcaoAuditoria.DELECAO), eq(1L), any());
        }
    }

    // =========================================================
    // VÍNCULOS
    // =========================================================
    @Nested
    @DisplayName("Vínculos (Laboratório, Startup, Proteção)")
    class Vinculos {

        @Test
        @DisplayName("Deve vincular startup com sucesso")
        void deveVincularStartup() {
            Startup startup = new Startup(); startup.setId(5L);

            when(repository.findById(10L)).thenReturn(Optional.of(pessoaPadrao));
            when(startupRepository.findById(5L)).thenReturn(Optional.of(startup));

            pessoaService.vincularStartup(10L, 5L, admin);

            assertThat(pessoaPadrao.getStartups()).contains(startup);
            verify(repository).save(pessoaPadrao);
            verify(auditoriaService).registrarLog(eq("Pessoa"), eq(10L), eq(AcaoAuditoria.VINCULO), eq(1L), anyString());
        }

        @Test
        @DisplayName("Deve desvincular laboratório com sucesso")
        void deveDesvincularLaboratorio() {
            Laboratorio lab = new Laboratorio(); lab.setId(9L);
            pessoaPadrao.setLaboratorio(lab);

            when(repository.findById(10L)).thenReturn(Optional.of(pessoaPadrao));

            pessoaService.desvincularLaboratorio(10L, 9L, admin);

            assertThat(pessoaPadrao.getLaboratorio()).isNull();
            verify(repository).save(pessoaPadrao);
        }

        @Test
        @DisplayName("Deve lançar exceção ao tentar desvincular startup que não pertence à pessoa")
        void deveLancarExcecaoAoDesvincularStartupInexistente() {
            Startup startupAlheia = new Startup(); startupAlheia.setId(99L);
            when(repository.findById(10L)).thenReturn(Optional.of(pessoaPadrao)); // pessoaPadrao tem HashSet de startups vazio

            assertThatThrownBy(() -> pessoaService.desvincularStartup(10L, 99L, admin))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("não estava vinculada");
        }
    }
}