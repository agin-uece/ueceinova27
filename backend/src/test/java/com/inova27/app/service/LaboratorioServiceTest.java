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
            LaboratorioCreateDTO dto = new LaboratorioCreateDTO("Lab Inovação", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
            when(repository.save(any())).thenReturn(labPadrao);

            laboratorioService.criar(dto, pesquisador);

            verify(solicitacaoService).enviarEmailNotificacaoCriacao(TipoEntidade.LABORATORIO, labPadrao.getNome());
            verify(indexador, never()).indexar(any());
        }

        @Test
        @DisplayName("Deve criar lab APROVADO se for ADMIN")
        void deveCriarAprovado() {
            LaboratorioCreateDTO dto = new LaboratorioCreateDTO("Lab Admin", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
            when(repository.save(any())).thenAnswer(i -> {
                Laboratorio l = i.getArgument(0);
                l.setStatus(StatusValidacao.APROVADO);
                return l;
            });

            laboratorioService.criar(dto, admin);

            verify(indexador).indexar(any());
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
            verify(indexador).indexar(any());
        }

        @Test
        @DisplayName("Deve rejeitar lab sem indexar")
        void deveRejeitar() {
            when(repository.findById(10L)).thenReturn(Optional.of(labPadrao));
            laboratorioService.validarLaboratorio(10L, false, admin);
            assertThat(labPadrao.getStatus()).isEqualTo(StatusValidacao.REJEITADO);
            verify(indexador, never()).indexar(any());
        }
    }

    @Nested
    @DisplayName("Atualização e Deleção")
    class AtualizacaoDelecao {
        @Test
        @DisplayName("Admin deve atualizar diretamente")
        void adminAtualizaDireto() {
            LaboratorioUpdateDTO dto = new LaboratorioUpdateDTO("Novo Nome", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
            when(repository.findById(10L)).thenReturn(Optional.of(labPadrao));
            when(repository.save(any())).thenReturn(labPadrao);

            laboratorioService.atualizar(10L, dto, admin);

            verify(repository).save(any());
            verify(auditoriaService).registrarLog(any(), any(), any(), any(), any());
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
            LaboratorioUpdateDTO dto = new LaboratorioUpdateDTO("Nome", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
            when(repository.findById(10L)).thenReturn(Optional.of(labPadrao));

            laboratorioService.atualizar(10L, dto, pesquisador);

            verify(solicitacaoService).registrarSolicitacao(eq(TipoEntidade.LABORATORIO), eq(10L), eq(TipoAcao.EDICAO), any(), eq(2L));
        }
    }

    @Nested
    @DisplayName("Tratamento de Exceções")
    class Excecoes {
        @Test
        @DisplayName("Deve lançar BusinessException em caso de erro genérico")
        void erroGenerico() {
            when(repository.findById(99L)).thenThrow(new RuntimeException("DB Error"));
            assertThatThrownBy(() -> laboratorioService.buscarPorId(99L))
                    .isInstanceOf(BusinessException.class);
        }
    }
}