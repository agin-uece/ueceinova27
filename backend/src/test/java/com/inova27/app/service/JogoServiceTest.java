package com.inova27.app.service;

import com.inova27.app.dto.jogo.JogoCreateDTO;
import com.inova27.app.dto.jogo.JogoResponseDTO;
import com.inova27.app.dto.jogo.JogoUpdateDTO;
import com.inova27.app.exception.JogoJaExisteException;
import com.inova27.app.exception.JogoNaoEncontradoException;
import com.inova27.app.exception.PermissaoNegadaException;
import com.inova27.app.mapper.DocumentoSemanticoMapper;
import com.inova27.app.model.*;
import com.inova27.app.repository.EngineRepository;
import com.inova27.app.repository.JogoRepository;
import com.inova27.app.repository.LinguagemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("JogoService - Testes Unitários")
class JogoServiceTest {

    @Mock private JogoRepository repository;
    @Mock private DocumentoSemanticoMapper mapper;
    @Mock private IndexadorSemanticoService indexador;
    @Mock private EngineRepository engineRepository;
    @Mock private LinguagemRepository linguagemRepository;
    @Mock private AuditoriaService auditoriaService;
    @Mock private SolicitacaoAlteracaoService solicitacaoService;

    @InjectMocks
    private JogoService jogoService;

    private Usuario admin;
    private Usuario professor;
    private Jogo jogoPadrao;

    @BeforeEach
    void setUp() {
        admin = new Usuario();
        admin.setId(1L);
        admin.setRole(UserRole.ADMIN);

        professor = new Usuario();
        professor.setId(2L);
        professor.setRole(UserRole.PROFESSOR);

        jogoPadrao = new Jogo();
        jogoPadrao.setId(10L);
        jogoPadrao.setNome("Jogo Educativo");
        jogoPadrao.setUserInclusaoId(2L); // Pertence ao professor
        jogoPadrao.setStatus(StatusValidacao.PENDENTE);
    }

    // =========================================================
    // CRIAR
    // =========================================================
    @Nested
    @DisplayName("criar()")
    class Criar {

        @Test
        @DisplayName("Deve criar jogo PENDENTE se for usuário comum (Professor)")
        void deveCriarPendenteSeUsuarioComum() {
            JogoCreateDTO dto = new JogoCreateDTO("Novo Jogo", "Desc", null, null, null, null, null, null, null, null, null, null, null, null, null);

            when(repository.existsByNome("Novo Jogo")).thenReturn(false);
            when(repository.save(any(Jogo.class))).thenAnswer(i -> {
                Jogo j = i.getArgument(0);
                j.setId(11L);
                return j;
            });

            JogoResponseDTO resultado = jogoService.criar(dto, professor);

            assertThat(resultado.status()).isEqualTo(StatusValidacao.PENDENTE);
            verify(solicitacaoService).enviarEmailNotificacaoCriacao(TipoEntidade.JOGO, "Novo Jogo");
            verify(indexador, never()).indexar(any()); // Pendente não vai pro motor de busca
            verify(auditoriaService).registrarLog(eq("Jogo"), eq(11L), eq(AcaoAuditoria.CRIACAO), eq(2L), any());
        }

        @Test
        @DisplayName("Deve criar jogo APROVADO e indexar se usuário for ADMIN")
        void deveCriarAprovadoSeAdmin() {
            JogoCreateDTO dto = new JogoCreateDTO("Super Jogo", "Desc", null, null, null, null, null, null, null, null, null, null, null, null, null);

            when(repository.existsByNome("Super Jogo")).thenReturn(false);
            when(repository.save(any(Jogo.class))).thenAnswer(i -> {
                Jogo j = i.getArgument(0);
                j.setId(12L);
                return j;
            });

            JogoResponseDTO resultado = jogoService.criar(dto, admin);

            assertThat(resultado.status()).isEqualTo(StatusValidacao.APROVADO);
            verify(solicitacaoService, never()).enviarEmailNotificacaoCriacao(any(), any());
            verify(mapper).fromJogo(any(Jogo.class));
            verify(indexador).indexar(any());
        }

        @Test
        @DisplayName("Deve lançar JogoJaExisteException quando nome já existe")
        void deveLancarExcecaoSeNomeJaExiste() {
            JogoCreateDTO dto = new JogoCreateDTO("Tetris", null, null, null, null, null, null, null, null, null, null, null, null, null, null);
            when(repository.existsByNome("Tetris")).thenReturn(true);

            assertThatThrownBy(() -> jogoService.criar(dto, admin))
                    .isInstanceOf(RuntimeException.class)
                    .hasCauseInstanceOf(JogoJaExisteException.class);
        }
    }

    // =========================================================
    // VALIDAR
    // =========================================================
    @Nested
    @DisplayName("validarJogo()")
    class ValidarJogo {

        @Test
        @DisplayName("Deve aprovar jogo, salvar no indexador e registrar auditoria")
        void deveAprovarJogo() {
            when(repository.findById(10L)).thenReturn(Optional.of(jogoPadrao));

            jogoService.validarJogo(10L, true, admin);

            assertThat(jogoPadrao.getStatus()).isEqualTo(StatusValidacao.APROVADO);
            verify(repository).save(jogoPadrao);
            verify(indexador).indexar(any());
            verify(auditoriaService).registrarLog(eq("Jogo"), eq(10L), eq(AcaoAuditoria.VALIDACAO), eq(1L), contains("APROVADO"));
        }

        @Test
        @DisplayName("Deve rejeitar jogo sem indexar")
        void deveRejeitarJogo() {
            when(repository.findById(10L)).thenReturn(Optional.of(jogoPadrao));

            jogoService.validarJogo(10L, false, admin);

            assertThat(jogoPadrao.getStatus()).isEqualTo(StatusValidacao.REJEITADO);
            verify(repository).save(jogoPadrao);
            verify(indexador, never()).indexar(any());
            verify(auditoriaService).registrarLog(eq("Jogo"), eq(10L), eq(AcaoAuditoria.VALIDACAO), eq(1L), contains("REJEITADO"));
        }
    }

    // =========================================================
    // ATUALIZAR
    // =========================================================
    @Nested
    @DisplayName("atualizar()")
    class Atualizar {

        @Test
        @DisplayName("Deve registrar solicitação se o usuário não for admin (Owner)")
        void deveRegistrarSolicitacaoSeNaoAdmin() {
            JogoUpdateDTO dto = new JogoUpdateDTO("Nome Editado", null, null, null, null, null, null, null, null, null, null, null, null, null, null);
            when(repository.findById(10L)).thenReturn(Optional.of(jogoPadrao));

            JogoResponseDTO resultado = jogoService.atualizar(10L, dto, professor);

            assertThat(resultado).isNull(); // Como não é admin, retorna null e cria solicitação
            verify(solicitacaoService).registrarSolicitacao(TipoEntidade.JOGO, 10L, TipoAcao.EDICAO, dto, 2L);
            verify(repository, never()).save(any());
        }

        @Test
        @DisplayName("Deve atualizar diretamente se usuário for admin")
        void deveAtualizarDiretamenteSeAdmin() {
            JogoUpdateDTO dto = new JogoUpdateDTO("Nome Editado Admin", null, null, null, null, null, null, null, null, null, null, null, null, null, null);
            jogoPadrao.setStatus(StatusValidacao.APROVADO); // Para testar re-indexação

            when(repository.findById(10L)).thenReturn(Optional.of(jogoPadrao));
            when(repository.save(any(Jogo.class))).thenReturn(jogoPadrao);

            JogoResponseDTO resultado = jogoService.atualizar(10L, dto, admin);

            assertThat(resultado.nome()).isEqualTo("Nome Editado Admin");
            verify(repository).save(jogoPadrao);
            verify(indexador).removerIndex("jogos", 10L);
            verify(indexador).indexar(any());
            verify(auditoriaService).registrarLog(eq("Jogo"), eq(10L), eq(AcaoAuditoria.EDICAO), eq(1L), eq(dto));
        }

        @Test
        @DisplayName("Deve negar atualização se usuário não for dono nem admin")
        void deveLancarPermissaoNegada() {
            Usuario outroUsuario = new Usuario();
            outroUsuario.setId(99L);
            outroUsuario.setRole(UserRole.PROFESSOR);

            JogoUpdateDTO dto = new JogoUpdateDTO("Hacker", null, null, null, null, null, null, null, null, null, null, null, null, null, null);
            when(repository.findById(10L)).thenReturn(Optional.of(jogoPadrao));

            assertThatThrownBy(() -> jogoService.atualizar(10L, dto, outroUsuario))
                    .isInstanceOf(RuntimeException.class)
                    .hasCauseInstanceOf(PermissaoNegadaException.class);
        }
    }

    // =========================================================
    // DELETAR
    // =========================================================
    @Nested
    @DisplayName("deletar()")
    class Deletar {

        @Test
        @DisplayName("Deve criar solicitação de deleção se dono não for admin")
        void deveRegistrarSolicitacaoDeDelecao() {
            when(repository.findById(10L)).thenReturn(Optional.of(jogoPadrao));

            boolean deletouDireto = jogoService.deletar(10L, professor);

            assertThat(deletouDireto).isFalse();
            verify(solicitacaoService).registrarSolicitacao(TipoEntidade.JOGO, 10L, TipoAcao.EXCLUSAO, null, 2L);
            verify(repository, never()).delete((Jogo) any());
        }

        @Test
        @DisplayName("Deve deletar diretamente e limpar motor de busca se for admin")
        void deveDeletarSeAdmin() {
            when(repository.findById(10L)).thenReturn(Optional.of(jogoPadrao));

            boolean deletouDireto = jogoService.deletar(10L, admin);

            assertThat(deletouDireto).isTrue();
            verify(repository).delete(jogoPadrao);
            verify(indexador).removerIndex("jogos", 10L);
            verify(auditoriaService).registrarLog(eq("Jogo"), eq(10L), eq(AcaoAuditoria.DELECAO), eq(1L), any());
        }


    }

    // =========================================================
    // BUSCAS SIMPLES
    // =========================================================
    @Nested
    @DisplayName("Buscas Básicas")
    class Buscas {

        @Test
        @DisplayName("Deve buscar jogo por ID com sucesso")
        void deveBuscarPorId() {
            when(repository.findById(10L)).thenReturn(Optional.of(jogoPadrao));

            JogoResponseDTO response = jogoService.buscarPorId(10L);

            assertThat(response.id()).isEqualTo(10L);
            assertThat(response.nome()).isEqualTo("Jogo Educativo");
        }

        @Test
        @DisplayName("Deve lançar JogoNaoEncontradoException")
        void deveLancarNaoEncontrado() {
            when(repository.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> jogoService.buscarPorId(99L))
                    .isInstanceOf(RuntimeException.class)
                    .hasCauseInstanceOf(JogoNaoEncontradoException.class);
        }

        @Test
        @DisplayName("Deve listar jogos paginados por usuário")
        void deveListarPorUsuario() {
            Page<Jogo> paginaDeJogos = new PageImpl<>(List.of(jogoPadrao));
            Pageable pageable = PageRequest.of(0, 10);

            when(repository.findByUserInclusaoId(2L, pageable)).thenReturn(paginaDeJogos);

            Page<JogoResponseDTO> resultado = jogoService.listarPorUsuario(2L, pageable);

            assertThat(resultado.getTotalElements()).isEqualTo(1);
            assertThat(resultado.getContent().get(0).nome()).isEqualTo("Jogo Educativo");
        }
    }
}