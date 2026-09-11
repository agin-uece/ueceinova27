package com.inova27.app.service;

import com.inova27.app.dto.protecao.ProtecaoCreateDTO;
import com.inova27.app.dto.protecao.ProtecaoResponseDTO;
import com.inova27.app.dto.protecao.ProtecaoUpdateDTO;
import com.inova27.app.exception.BusinessException;
import com.inova27.app.mapper.DocumentoSemanticoMapper;
import com.inova27.app.model.*;
import com.inova27.app.repository.JogoRepository;
import com.inova27.app.repository.ProtecaoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ProtecaoService - Testes Unitários")
class ProtecaoServiceTest {

    @Mock private ProtecaoRepository repository;
    @Mock private JogoRepository jogoRepository;
    @Mock private AuditoriaService auditoriaService;
    @Mock private DocumentoSemanticoMapper mapper;
    @Mock private IndexadorSemanticoService indexador;

    @InjectMocks
    private ProtecaoService protecaoService;

    private Protecao protecaoPadrao;
    private Jogo jogoPadrao;

    @BeforeEach
    void setUp() {
        protecaoPadrao = new Protecao();
        protecaoPadrao.setId(10L);
        protecaoPadrao.setCodId("BR102026");
        protecaoPadrao.setNome("Algoritmo de Busca Semântica");
        protecaoPadrao.setNatureza(NaturezaProtecao.SOFTWARE);
        protecaoPadrao.setUserInclusaoId(1L);

        jogoPadrao = new Jogo();
        jogoPadrao.setId(5L);
        jogoPadrao.setNome("Jogo Educativo UECE");
    }

    // =========================================================
    // CRIAR
    // =========================================================
    @Nested
    @DisplayName("criar()")
    class Criar {

        @Test
        @DisplayName("Deve criar proteção com sucesso, indexar no motor e registrar auditoria")
        void deveCriarProtecaoComSucesso() {
            ProtecaoCreateDTO dto = new ProtecaoCreateDTO(
                    "BR102026", "Algoritmo de Busca Semântica", "Resumo", "UECE",
                    NaturezaProtecao.SOFTWARE, LocalDate.now(), "Info", null,
                    "TI", "TRL 4", "Educação", "Depositado", null,
                    List.of("Gabriel"), "UECE", "Uso de IA", "12345"
            );

            when(repository.existsByCodId("BR102026")).thenReturn(false);
            when(repository.save(any(Protecao.class))).thenAnswer(i -> {
                Protecao p = i.getArgument(0);
                p.setId(10L);
                return p;
            });

            ProtecaoResponseDTO resultado = protecaoService.criar(dto, 1L);

            assertThat(resultado).isNotNull();
            assertThat(resultado.nome()).isEqualTo("Algoritmo de Busca Semântica");

            verify(mapper).fromProtecao(any(Protecao.class));
            verify(indexador).indexar(any());
            verify(auditoriaService).registrarLog(eq("Protecao"), eq(10L), eq(AcaoAuditoria.CRIACAO), eq(1L), any(ProtecaoResponseDTO.class));
        }

        @Test
        @DisplayName("Deve vincular jogo se a natureza for SOFTWARE")
        void deveCriarEVincularJogo() {
            ProtecaoCreateDTO dto = new ProtecaoCreateDTO(
                    "BR102026", "Software Inova", null, null, NaturezaProtecao.SOFTWARE,
                    null, null, null, null, null, null, null, 5L, null, null, null, null
            );

            when(jogoRepository.findById(5L)).thenReturn(Optional.of(jogoPadrao));
            when(repository.save(any(Protecao.class))).thenAnswer(i -> i.getArgument(0));

            protecaoService.criar(dto, 1L);

            ArgumentCaptor<Protecao> captor = ArgumentCaptor.forClass(Protecao.class);
            verify(repository).save(captor.capture());
            assertThat(captor.getValue().getJogo()).isEqualTo(jogoPadrao);
        }

        @Test
        @DisplayName("Deve lançar exceção se nome for vazio")
        void deveLancarExcecaoSeNomeVazio() {
            ProtecaoCreateDTO dto = new ProtecaoCreateDTO(null, "   ", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);

            assertThatThrownBy(() -> protecaoService.criar(dto, 1L))
                    .isInstanceOf(BusinessException.class)
                    .hasMessage("O nome da proteção é obrigatório.");
            verify(repository, never()).save(any());
        }

        @Test
        @DisplayName("Deve lançar exceção se CodId já existir")
        void deveLancarExcecaoSeCodIdDuplicado() {
            ProtecaoCreateDTO dto = new ProtecaoCreateDTO("BR_EXISTE", "Nome Valido", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
            when(repository.existsByCodId("BR_EXISTE")).thenReturn(true);

            assertThatThrownBy(() -> protecaoService.criar(dto, 1L))
                    .isInstanceOf(BusinessException.class)
                    .hasMessage("Já existe uma proteção com este Código ID.");
        }

    }

    // =========================================================
    // BUSCAR E LISTAR
    // =========================================================
    @Nested
    @DisplayName("Consultas (Listar e Buscar)")
    class Consultas {

        @Test
        @DisplayName("Deve buscar proteção por ID")
        void deveBuscarPorId() {
            when(repository.findById(10L)).thenReturn(Optional.of(protecaoPadrao));

            ProtecaoResponseDTO resposta = protecaoService.buscarPorId(10L);
            assertThat(resposta.nome()).isEqualTo("Algoritmo de Busca Semântica");
        }

        @Test
        @DisplayName("Deve listar todas as proteções")
        void deveListarTodas() {
            when(repository.findAll()).thenReturn(List.of(protecaoPadrao));

            List<ProtecaoResponseDTO> lista = protecaoService.listarTodas();
            assertThat(lista).hasSize(1);
            assertThat(lista.get(0).codId()).isEqualTo("BR102026");
        }

        @Test
        @DisplayName("Deve lançar exceção ao buscar ID inexistente")
        void deveLancarExcecaoSeIdNaoExiste() {
            when(repository.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> protecaoService.buscarPorId(99L))
                    .isInstanceOf(BusinessException.class)
                    .hasMessageContaining("Erro interno ao buscar proteção");
        }
    }

    // =========================================================
    // ATUALIZAR
    // =========================================================
    @Nested
    @DisplayName("atualizar()")
    class Atualizar {

        @Test
        @DisplayName("Deve atualizar campos, reindexar e auditar com sucesso")
        void deveAtualizarEReindexar() {
            ProtecaoUpdateDTO dto = new ProtecaoUpdateDTO(
                    null, "Nome Atualizado", "Novo Resumo", null, null, null, null, null,
                    null, null, null, null, null, null, null, null, null
            );

            when(repository.findById(10L)).thenReturn(Optional.of(protecaoPadrao));
            when(repository.save(any(Protecao.class))).thenReturn(protecaoPadrao);

            ProtecaoResponseDTO resultado = protecaoService.atualizar(10L, dto, 2L);

            assertThat(resultado.nome()).isEqualTo("Nome Atualizado");
            verify(indexador).removerIndex("protecoes", 10L);
            verify(indexador).indexar(any());
            verify(auditoriaService).registrarLog(eq("Protecao"), eq(10L), eq(AcaoAuditoria.EDICAO), eq(2L), eq(dto));
        }

        @Test
        @DisplayName("Deve lançar erro ao tentar atualizar ID inexistente")
        void deveLancarErroAoAtualizarInexistente() {
            ProtecaoUpdateDTO dto = new ProtecaoUpdateDTO(null, "Teste", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
            when(repository.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> protecaoService.atualizar(99L, dto, 1L))
                    .isInstanceOf(BusinessException.class)
                    .hasMessage("Erro interno ao atualizar proteção");
        }
    }

    // =========================================================
    // DELETAR
    // =========================================================
    @Nested
    @DisplayName("deletar()")
    class Deletar {

        @Test
        @DisplayName("Deve deletar, remover do indexador e auditar")
        void deveDeletarComSucesso() {
            when(repository.findById(10L)).thenReturn(Optional.of(protecaoPadrao));

            protecaoService.deletar(10L, 1L);

            verify(repository).delete(protecaoPadrao);
            verify(indexador).removerIndex("protecoes", 10L);
            verify(auditoriaService).registrarLog(eq("Protecao"), eq(10L), eq(AcaoAuditoria.DELECAO), eq(1L), any(ProtecaoResponseDTO.class));
        }
    }

    // =========================================================
    // VINCULAR E DESVINCULAR JOGO
    // =========================================================
    @Nested
    @DisplayName("Vínculos com Jogos")
    class Vinculos {

        @Test
        @DisplayName("Deve vincular jogo com sucesso")
        void deveVincularJogo() {
            when(repository.findById(10L)).thenReturn(Optional.of(protecaoPadrao));
            when(jogoRepository.findById(5L)).thenReturn(Optional.of(jogoPadrao));

            protecaoService.vincularJogo(10L, 5L, 1L);

            assertThat(protecaoPadrao.getJogo()).isEqualTo(jogoPadrao);
            verify(repository).save(protecaoPadrao);
            verify(auditoriaService).registrarLog(eq("Protecao"), eq(10L), eq(AcaoAuditoria.VINCULO), eq(1L), anyString());
        }

        @Test
        @DisplayName("Deve desvincular jogo com sucesso")
        void deveDesvincularJogo() {
            protecaoPadrao.setJogo(jogoPadrao); // Configura estado inicial vinculado
            when(repository.findById(10L)).thenReturn(Optional.of(protecaoPadrao));

            protecaoService.desvincularJogo(10L, 5L, 1L);

            assertThat(protecaoPadrao.getJogo()).isNull();
            verify(repository).save(protecaoPadrao);
            verify(auditoriaService).registrarLog(eq("Protecao"), eq(10L), eq(AcaoAuditoria.DESVINCULO), eq(1L), anyString());
        }

        @Test
        @DisplayName("Deve falhar ao desvincular se a proteção estiver ligada a outro jogo")
        void deveFalharDesvinculoIncompativel() {
            Jogo outroJogo = new Jogo();
            outroJogo.setId(99L);
            protecaoPadrao.setJogo(outroJogo);

            when(repository.findById(10L)).thenReturn(Optional.of(protecaoPadrao));

            assertThatThrownBy(() -> protecaoService.desvincularJogo(10L, 5L, 1L))
                    .isInstanceOf(BusinessException.class)
                    .hasMessage("Erro ao desvincular jogo"); // Exceção interna engolida pelo catch
        }
    }
}