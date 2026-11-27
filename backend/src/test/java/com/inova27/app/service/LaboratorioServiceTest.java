package com.inova27.app.service;

import com.inova27.app.dto.laboratorio.LaboratorioCreateDTO;
import com.inova27.app.dto.laboratorio.LaboratorioResponseDTO;
import com.inova27.app.dto.laboratorio.LaboratorioUpdateDTO;
import com.inova27.app.exception.BusinessException;
import com.inova27.app.exception.ResourceNotFoundException;
import com.inova27.app.exception.UnauthorizedActionException;
import com.inova27.app.mapper.DocumentoSemanticoMapper;
import com.inova27.app.model.*;
import com.inova27.app.repository.LaboratorioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("LaboratorioService - Testes Unitários")
class LaboratorioServiceTest {

    @Mock private LaboratorioRepository repository;
    @Mock private DocumentoSemanticoMapper mapper;
    @Mock private IndexadorSemanticoService indexador;
    @Mock private AuditoriaService auditoriaService;
    @Mock private SolicitacaoAlteracaoService solicitacaoService;

    @InjectMocks
    private LaboratorioService laboratorioService;

    private Usuario admin;
    private Usuario pesquisador;
    private Laboratorio labPadrao;

    @BeforeEach
    void setUp() {
        admin = new Usuario(); admin.setId(1L); admin.setRole(UserRole.ADMIN);
        pesquisador = new Usuario(); pesquisador.setId(2L); pesquisador.setRole(UserRole.PROFESSOR);

        labPadrao = new Laboratorio();
        labPadrao.setId(10L);
        labPadrao.setNome("Lab de IA");
        labPadrao.setUserInclusaoId(2L);
        labPadrao.setStatus(StatusValidacao.PENDENTE);
    }

    @Nested
    @DisplayName("Criação de Laboratório")
    class Criar {
        @Test
        @DisplayName("Deve criar lab PENDENTE para pesquisador e notificar")
        void deveCriarPendente() {
            LaboratorioCreateDTO dto = new LaboratorioCreateDTO("Lab Inovação", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
            when(repository.save(any())).thenReturn(labPadrao);

            laboratorioService.criar(dto, pesquisador);

            verify(solicitacaoService).enviarEmailNotificacaoCriacao(TipoEntidade.LABORATORIO, labPadrao.getNome());
            verify(indexador, never()).agendarIndexacao(any());
        }

        @Test
        @DisplayName("Deve criar lab APROVADO se for ADMIN")
        void deveCriarAprovado() {
            LaboratorioCreateDTO dto = new LaboratorioCreateDTO("Lab Admin", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
            when(repository.save(any())).thenAnswer(i -> {
                Laboratorio l = i.getArgument(0);
                l.setStatus(StatusValidacao.APROVADO);
                return l;
            });

            laboratorioService.criar(dto, admin);

            verify(indexador).agendarIndexacao(any());
            verify(solicitacaoService, never()).enviarEmailNotificacaoCriacao(any(), any());
        }
    }

    @Nested
    @DisplayName("Validação e Auditoria")
    class Validacao {
        @Test
        @DisplayName("Deve aprovar lab e indexar no motor semântico")
        void deveAprovar() {
            when(repository.findById(10L)).thenReturn(Optional.of(labPadrao));
            laboratorioService.validarLaboratorio(10L, true, admin);
            assertThat(labPadrao.getStatus()).isEqualTo(StatusValidacao.APROVADO);
            verify(indexador).agendarIndexacao(any());
        }

        @Test
        @DisplayName("Deve rejeitar lab sem indexar")
        void deveRejeitar() {
            when(repository.findById(10L)).thenReturn(Optional.of(labPadrao));
            laboratorioService.validarLaboratorio(10L, false, admin);
            assertThat(labPadrao.getStatus()).isEqualTo(StatusValidacao.REJEITADO);
            verify(indexador, never()).agendarIndexacao(any());
        }
    }

    @Nested
    @DisplayName("Atualização e Deleção")
    class AtualizacaoDelecao {
        @Test
        @DisplayName("Admin deve atualizar diretamente")
        void adminAtualizaDireto() {
            LaboratorioUpdateDTO dto = new LaboratorioUpdateDTO("Novo Nome", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
            when(repository.findById(10L)).thenReturn(Optional.of(labPadrao));
            when(repository.save(any())).thenReturn(labPadrao);

            laboratorioService.atualizar(10L, dto, admin);

            verify(repository).save(any());
            verify(auditoriaService).registrarLog(any(), any(), any(), any(), any());
        }

        @Test
        @DisplayName("Excluir laboratório NÃO apaga as pessoas: apenas desvincula")
        void deletarLabDesvinculaPessoas() {
            Pessoa pessoa = new Pessoa();
            pessoa.setLaboratorio(labPadrao);
            labPadrao.getPessoas().add(pessoa);
            when(repository.findById(10L)).thenReturn(Optional.of(labPadrao));

            assertThat(laboratorioService.deletar(10L, admin)).isTrue();

            assertThat(pessoa.getLaboratorio()).isNull();
            verify(repository).delete(labPadrao);
        }

        @Test
        @DisplayName("Pesquisador deve ter pedido negado ao deletar lab de outro")
        void pesquisadorNaoDeletaAlheio() {
            Usuario outro = new Usuario(); outro.setId(99L);
            when(repository.findById(10L)).thenReturn(Optional.of(labPadrao));

            assertThatThrownBy(() -> laboratorioService.deletar(10L, outro))
                    .isInstanceOf(UnauthorizedActionException.class);
        }

        @Test
        @DisplayName("Pesquisador deve criar solicitação ao editar seu próprio lab")
        void donoCriaSolicitacaoEdicao() {
            LaboratorioUpdateDTO dto = new LaboratorioUpdateDTO("Nome", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
            when(repository.findById(10L)).thenReturn(Optional.of(labPadrao));

            laboratorioService.atualizar(10L, dto, pesquisador);

            verify(solicitacaoService).registrarSolicitacao(eq(TipoEntidade.LABORATORIO), eq(10L), eq(TipoAcao.EDICAO), any(), eq(2L));
        }

        @Test
        @DisplayName("Admin não deve conseguir atualizar nome para um já existente em outro laboratório")
        void adminNaoAtualizaParaNomeDuplicado() {
            LaboratorioUpdateDTO dto = new LaboratorioUpdateDTO(" Larces ", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
            when(repository.findById(10L)).thenReturn(Optional.of(labPadrao));
            when(repository.existsByNomeIgnoreCaseAndIdNot("Larces", 10L)).thenReturn(true);

            assertThatThrownBy(() -> laboratorioService.atualizar(10L, dto, admin))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("Já existe um laboratório com esse nome");

            verify(repository, never()).save(any());
        }

        @Test
        @DisplayName("Pesquisador não deve criar solicitação de edição com nome já existente em outro laboratório")
        void donoNaoSolicitaEdicaoComNomeDuplicado() {
            LaboratorioUpdateDTO dto = new LaboratorioUpdateDTO("Larces", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
            when(repository.findById(10L)).thenReturn(Optional.of(labPadrao));
            when(repository.existsByNomeIgnoreCaseAndIdNot("Larces", 10L)).thenReturn(true);

            assertThatThrownBy(() -> laboratorioService.atualizar(10L, dto, pesquisador))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("Já existe um laboratório com esse nome");

            verify(solicitacaoService, never()).registrarSolicitacao(any(), any(), any(), any(), any());
        }

        @Test
        @DisplayName("Admin deve conseguir atualizar mantendo o próprio nome")
        void adminAtualizaMantendoProprioNome() {
            LaboratorioUpdateDTO dto = new LaboratorioUpdateDTO("Lab de IA", "Nova desc", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
            when(repository.findById(10L)).thenReturn(Optional.of(labPadrao));
            when(repository.existsByNomeIgnoreCaseAndIdNot("Lab de IA", 10L)).thenReturn(false);
            when(repository.save(any())).thenReturn(labPadrao);

            laboratorioService.atualizar(10L, dto, admin);

            verify(repository).save(labPadrao);
        }

        @Test
        @DisplayName("Admin grava curso e centro separados e eles voltam na resposta")
        void adminAtualizaCursoECentro() {
            // posições 9 e 10 do LaboratorioUpdateDTO: curso, centro
            LaboratorioUpdateDTO dto = new LaboratorioUpdateDTO(null, null, null, null, null, null, null, null,
                    "Ciência da Computação", "CCT", null, null, null, null, null, null, null, null, null, null, null, null, null);
            when(repository.findById(10L)).thenReturn(Optional.of(labPadrao));
            when(repository.save(any())).thenAnswer(i -> i.getArgument(0));

            LaboratorioResponseDTO resposta = laboratorioService.atualizar(10L, dto, admin);

            assertThat(labPadrao.getCurso()).isEqualTo("Ciência da Computação");
            assertThat(labPadrao.getCentro()).isEqualTo("CCT");
            assertThat(resposta.curso()).isEqualTo("Ciência da Computação");
            assertThat(resposta.centro()).isEqualTo("CCT");
        }
    }

    @Nested
    @DisplayName("Tratamento de Exceções")
    class Excecoes {
        @Test
        @DisplayName("Erro genérico do banco é propagado (vira 500 no handler global)")
        void erroGenerico() {
            when(repository.findById(99L)).thenThrow(new RuntimeException("DB Error"));
            assertThatThrownBy(() -> laboratorioService.buscarPorId(99L, null))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessage("DB Error");
        }
    }
}