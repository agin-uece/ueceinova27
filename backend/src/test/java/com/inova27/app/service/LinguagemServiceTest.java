package com.inova27.app.service;

import com.inova27.app.dto.linguagem.LinguagemCreateDTO;
import com.inova27.app.dto.linguagem.LinguagemResponseDTO;
import com.inova27.app.dto.linguagem.LinguagemUpdateDTO;
import com.inova27.app.exception.BusinessException;
import com.inova27.app.exception.ResourceNotFoundException;
import com.inova27.app.model.Linguagem;
import com.inova27.app.repository.LinguagemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LinguagemServiceTest {

    @Mock
    private LinguagemRepository repository;

    @InjectMocks
    private LinguagemService linguagemService;

    private Linguagem linguagemPadrao;

    @BeforeEach
    void setUp() {
        // Objeto base que será usado em vários testes
        linguagemPadrao = new Linguagem();
        linguagemPadrao.setId(1L);
        linguagemPadrao.setNome("Java");
    }

    // ==========================================
    // TESTES DE CREATE (CRIAR)
    // ==========================================

    @Test
    @DisplayName("Deve criar uma nova linguagem com sucesso")
    void testCriar_Sucesso() {
        LinguagemCreateDTO dto = new LinguagemCreateDTO("Java");

        when(repository.existsByNome(dto.nome())).thenReturn(false);
        when(repository.save(any(Linguagem.class))).thenReturn(linguagemPadrao);

        LinguagemResponseDTO response = linguagemService.criar(dto);

        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.nome()).isEqualTo("Java");
        verify(repository, times(1)).save(any(Linguagem.class));
    }

    @Test
    @DisplayName("Deve lançar BusinessException ao tentar criar linguagem com nome já existente")
    void testCriar_NomeJaExiste() {
        LinguagemCreateDTO dto = new LinguagemCreateDTO("Java");

        when(repository.existsByNome(dto.nome())).thenReturn(true);

        assertThatThrownBy(() -> linguagemService.criar(dto))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Já existe uma linguagem cadastrada com este nome.");

        verify(repository, never()).save(any());
    }

    // ==========================================
    // TESTES DE READ (BUSCAR)
    // ==========================================

    @Test
    @DisplayName("Deve retornar lista de todas as linguagens")
    void testListarTodos() {
        when(repository.findAll()).thenReturn(List.of(linguagemPadrao));

        List<LinguagemResponseDTO> response = linguagemService.listarTodos();

        assertThat(response).hasSize(1);
        assertThat(response.get(0).nome()).isEqualTo("Java");
        verify(repository, times(1)).findAll();
    }

    @Test
    @DisplayName("Deve retornar a linguagem por ID com sucesso")
    void testBuscarPorId_Sucesso() {
        when(repository.findById(1L)).thenReturn(Optional.of(linguagemPadrao));

        LinguagemResponseDTO response = linguagemService.buscarPorId(1L);

        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.nome()).isEqualTo("Java");
    }

    @Test
    @DisplayName("Deve lançar ResourceNotFoundException ao buscar ID inexistente")
    void testBuscarPorId_NaoEncontrado() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> linguagemService.buscarPorId(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Linguagem não encontrada com o ID: 99");
    }

    // ==========================================
    // TESTES DE UPDATE (ATUALIZAR)
    // ==========================================

    @Test
    @DisplayName("Deve atualizar a linguagem com sucesso quando o nome muda")
    void testAtualizar_Sucesso() {
        LinguagemUpdateDTO dto = new LinguagemUpdateDTO("Python");

        Linguagem linguagemAtualizada = new Linguagem();
        linguagemAtualizada.setId(1L);
        linguagemAtualizada.setNome("Python");

        when(repository.findById(1L)).thenReturn(Optional.of(linguagemPadrao));
        when(repository.existsByNome(dto.nome())).thenReturn(false);
        when(repository.save(any(Linguagem.class))).thenReturn(linguagemAtualizada);

        LinguagemResponseDTO response = linguagemService.atualizar(1L, dto);

        assertThat(response.nome()).isEqualTo("Python");
        verify(repository, times(1)).save(any(Linguagem.class));
    }

    @Test
    @DisplayName("Deve lançar BusinessException ao atualizar para um nome que já pertence a outra linguagem")
    void testAtualizar_NomeJaExiste() {
        LinguagemUpdateDTO dto = new LinguagemUpdateDTO("C++");

        when(repository.findById(1L)).thenReturn(Optional.of(linguagemPadrao));
        when(repository.existsByNome(dto.nome())).thenReturn(true);

        assertThatThrownBy(() -> linguagemService.atualizar(1L, dto))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Já existe outra linguagem cadastrada com este nome.");

        verify(repository, never()).save(any());
    }

    @Test
    @DisplayName("Deve lançar ResourceNotFoundException ao tentar atualizar linguagem inexistente")
    void testAtualizar_NaoEncontrado() {
        LinguagemUpdateDTO dto = new LinguagemUpdateDTO("Python");

        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> linguagemService.atualizar(99L, dto))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Linguagem não encontrada para atualização.");
    }

    // ==========================================
    // TESTES DE DELETE (DELETAR)
    // ==========================================

    @Test
    @DisplayName("Deve deletar a linguagem com sucesso")
    void testDeletar_Sucesso() {
        when(repository.findById(1L)).thenReturn(Optional.of(linguagemPadrao));

        linguagemService.deletar(1L);

        verify(repository, times(1)).delete(linguagemPadrao);
    }

    @Test
    @DisplayName("Deve lançar ResourceNotFoundException ao tentar deletar linguagem inexistente")
    void testDeletar_NaoEncontrado() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> linguagemService.deletar(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Linguagem não encontrada para exclusão.");

        verify(repository, never()).delete(any());
    }
}