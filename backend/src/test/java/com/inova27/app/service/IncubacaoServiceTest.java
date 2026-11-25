package com.inova27.app.service;

import com.inova27.app.dto.incubacao.IncubacaoRequestDTO;
import com.inova27.app.dto.incubacao.IncubacaoResponseDTO;
import com.inova27.app.exception.ConflitoException;
import com.inova27.app.exception.ResourceNotFoundException;
import com.inova27.app.model.AcaoAuditoria;
import com.inova27.app.model.Incubacao;
import com.inova27.app.repository.IncubacaoRepository;
import com.inova27.app.repository.StartupRepository;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("IncubacaoService - CRUD das incubações")
class IncubacaoServiceTest {

    private static final Validator VALIDATOR = Validation.buildDefaultValidatorFactory().getValidator();

    @Mock private IncubacaoRepository repository;
    @Mock private StartupRepository startupRepository;
    @Mock private AuditoriaService auditoriaService;

    @InjectMocks
    private IncubacaoService service;

    private Incubacao incubada;

    @BeforeEach
    void setUp() {
        incubada = new Incubacao("Incubada");
        incubada.setId(1L);
    }

    @Test
    @DisplayName("Lista em ordem alfabética")
    void lista() {
        Incubacao outros = new Incubacao("Outros");
        outros.setId(5L);
        when(repository.findAllByOrderByNomeAsc()).thenReturn(List.of(incubada, outros));

        assertThat(service.listar()).containsExactly(
                new IncubacaoResponseDTO(1L, "Incubada"), new IncubacaoResponseDTO(5L, "Outros"));
    }

    @Test
    @DisplayName("Cria com o nome sem espaços nas pontas e registra auditoria")
    void cria() {
        when(repository.existsByNomeIgnoreCase("Inovação Aberta")).thenReturn(false);
        when(repository.save(any())).thenAnswer(i -> {
            Incubacao nova = i.getArgument(0);
            nova.setId(4L);
            return nova;
        });

        IncubacaoResponseDTO criada = service.criar(new IncubacaoRequestDTO("  Inovação Aberta "), 9L);

        assertThat(criada).isEqualTo(new IncubacaoResponseDTO(4L, "Inovação Aberta"));
        verify(auditoriaService).registrarLog(eq("Incubacao"), eq(4L), eq(AcaoAuditoria.CRIACAO), eq(9L), any());
    }

    @Test
    @DisplayName("Nome já existente (ignorando maiúsculas): 409")
    void criaDuplicada() {
        when(repository.existsByNomeIgnoreCase("INCUBADA")).thenReturn(true);

        assertThatThrownBy(() -> service.criar(new IncubacaoRequestDTO("INCUBADA"), 9L))
                .isInstanceOf(ConflitoException.class)
                .hasMessage("Já existe uma incubação com este nome.");
        verify(repository, never()).save(any());
    }

    @Test
    @DisplayName("Renomeia; nome de outra incubação dá 409")
    void atualiza() {
        when(repository.findById(1L)).thenReturn(Optional.of(incubada));
        when(repository.existsByNomeIgnoreCaseAndIdNot("Incubada (UECE)", 1L)).thenReturn(false);
        when(repository.existsByNomeIgnoreCaseAndIdNot("Associada", 1L)).thenReturn(true);
        when(repository.save(any())).thenAnswer(i -> i.getArgument(0));

        assertThat(service.atualizar(1L, new IncubacaoRequestDTO("Incubada (UECE)"), 9L).nome()).isEqualTo("Incubada (UECE)");
        assertThatThrownBy(() -> service.atualizar(1L, new IncubacaoRequestDTO("Associada"), 9L))
                .isInstanceOf(ConflitoException.class);
    }

    @Test
    @DisplayName("Id inexistente: 404")
    void inexistente() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.buscarPorId(99L)).isInstanceOf(ResourceNotFoundException.class);
        assertThatThrownBy(() -> service.atualizar(99L, new IncubacaoRequestDTO("X"), 9L)).isInstanceOf(ResourceNotFoundException.class);
        assertThatThrownBy(() -> service.excluir(99L, 9L)).isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("Exclusão de incubação usada por alguma startup (inclusive desativada): 409, nada é apagado")
    void excluiEmUso() {
        when(repository.findById(1L)).thenReturn(Optional.of(incubada));
        when(startupRepository.existeComIncubacao(1L)).thenReturn(true);

        assertThatThrownBy(() -> service.excluir(1L, 9L))
                .isInstanceOf(ConflitoException.class)
                .hasMessageContaining("em uso por startups");
        verify(repository, never()).delete(any());
    }

    @Test
    @DisplayName("Exclusão de incubação sem uso apaga e registra auditoria")
    void excluiLivre() {
        when(repository.findById(1L)).thenReturn(Optional.of(incubada));
        when(startupRepository.existeComIncubacao(1L)).thenReturn(false);

        service.excluir(1L, 9L);

        verify(repository).delete(incubada);
        verify(auditoriaService).registrarLog(eq("Incubacao"), eq(1L), eq(AcaoAuditoria.DELECAO), eq(9L), any());
    }

    @Test
    @DisplayName("Validação do nome: obrigatório e com no máximo 20 caracteres (espaços nas pontas não contam)")
    void validacaoNome() {
        assertThat(erros(new IncubacaoRequestDTO("12345678901234567890"))).isEmpty();
        assertThat(erros(new IncubacaoRequestDTO("  12345678901234567890  "))).isEmpty();
        assertThat(erros(new IncubacaoRequestDTO("123456789012345678901")))
                .containsExactly("O nome da incubação deve ter no máximo 20 caracteres.");
        assertThat(erros(new IncubacaoRequestDTO("   "))).containsExactly("O nome da incubação é obrigatório.");
        assertThat(erros(new IncubacaoRequestDTO(null))).containsExactly("O nome da incubação é obrigatório.");
    }

    private static java.util.Set<String> erros(IncubacaoRequestDTO dto) {
        return VALIDATOR.validate(dto).stream().map(ConstraintViolation::getMessage).collect(Collectors.toSet());
    }
}
