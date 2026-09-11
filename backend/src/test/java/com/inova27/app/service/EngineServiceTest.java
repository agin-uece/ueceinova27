package com.inova27.app.service;

import com.inova27.app.dto.engine.EngineCreateDTO;
import com.inova27.app.dto.engine.EngineResponseDTO;
import com.inova27.app.dto.engine.EngineUpdateDTO;
import com.inova27.app.exception.EngineJaExisteException;
import com.inova27.app.exception.EngineNaoEncontradaException;
import com.inova27.app.exception.EngineServiceException;
import com.inova27.app.model.Engine;
import com.inova27.app.repository.EngineRepository;
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
class EngineServiceTest {

    @Mock
    private EngineRepository repository;

    @InjectMocks
    private EngineService engineService;

    private Engine enginePadrao;

    @BeforeEach
    void setUp() {
        enginePadrao = new Engine();
        enginePadrao.setId(1L);
        enginePadrao.setNome("Unreal Engine 5");
    }

    // ==========================================
    // TESTES DE CREATE
    // ==========================================

    @Test
    @DisplayName("Deve criar uma nova engine com sucesso")
    void testCriar_Sucesso() {
        EngineCreateDTO dto = new EngineCreateDTO("Unreal Engine 5");

        when(repository.existsByNome(dto.nome())).thenReturn(false);
        when(repository.save(any(Engine.class))).thenReturn(enginePadrao);

        EngineResponseDTO response = engineService.criar(dto);

        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.nome()).isEqualTo("Unreal Engine 5");
    }

    @Test
    @DisplayName("Deve lançar EngineServiceException com causa EngineJaExisteException ao criar nome duplicado")
    void testCriar_NomeJaExiste() {
        EngineCreateDTO dto = new EngineCreateDTO("Unreal Engine 5");

        when(repository.existsByNome(dto.nome())).thenReturn(true);

        // O catch() do seu serviço envelopa a EngineJaExisteException dentro de uma EngineServiceException
        assertThatThrownBy(() -> engineService.criar(dto))
                .isInstanceOf(EngineServiceException.class)
                .hasMessageContaining("Erro interno ao criar engine")
                .hasCauseInstanceOf(EngineJaExisteException.class);

        verify(repository, never()).save(any());
    }

    // ==========================================
    // TESTES DE READ
    // ==========================================

    @Test
    @DisplayName("Deve listar todas as engines")
    void testListarTodos_Sucesso() {
        when(repository.findAll()).thenReturn(List.of(enginePadrao));

        List<EngineResponseDTO> response = engineService.listarTodos();

        assertThat(response).hasSize(1);
        assertThat(response.get(0).nome()).isEqualTo("Unreal Engine 5");
    }

    @Test
    @DisplayName("Deve lançar EngineServiceException ao ocorrer erro no listarTodos")
    void testListarTodos_ErroInterno() {
        // Simulando um erro catastrófico no banco para cair no bloco catch
        when(repository.findAll()).thenThrow(new RuntimeException("Falha no banco"));

        assertThatThrownBy(() -> engineService.listarTodos())
                .isInstanceOf(EngineServiceException.class)
                .hasMessageContaining("Erro ao buscar a lista de engines");
    }

    @Test
    @DisplayName("Deve buscar engine por ID com sucesso")
    void testBuscarPorId_Sucesso() {
        when(repository.findById(1L)).thenReturn(Optional.of(enginePadrao));

        EngineResponseDTO response = engineService.buscarPorId(1L);

        assertThat(response.id()).isEqualTo(1L);
    }

    @Test
    @DisplayName("Deve lançar EngineServiceException com causa EngineNaoEncontradaException ao buscar ID inexistente")
    void testBuscarPorId_NaoEncontrado() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> engineService.buscarPorId(99L))
                .isInstanceOf(EngineServiceException.class)
                .hasMessageContaining("Erro interno ao buscar engine")
                .hasCauseInstanceOf(EngineNaoEncontradaException.class);
    }

    // ==========================================
    // TESTES DE UPDATE
    // ==========================================

    @Test
    @DisplayName("Deve atualizar o nome da engine com sucesso")
    void testAtualizar_Sucesso() {
        EngineUpdateDTO dto = new EngineUpdateDTO("Unity");

        Engine engineAtualizada = new Engine();
        engineAtualizada.setId(1L);
        engineAtualizada.setNome("Unity");

        when(repository.findById(1L)).thenReturn(Optional.of(enginePadrao));
        when(repository.existsByNome("Unity")).thenReturn(false);
        when(repository.save(any(Engine.class))).thenReturn(engineAtualizada);

        EngineResponseDTO response = engineService.atualizar(1L, dto);

        assertThat(response.nome()).isEqualTo("Unity");
    }


    @Test
    @DisplayName("Deve lançar EngineServiceException com causa EngineJaExisteException na atualização")
    void testAtualizar_NomeJaExiste() {
        EngineUpdateDTO dto = new EngineUpdateDTO("Godot");

        when(repository.findById(1L)).thenReturn(Optional.of(enginePadrao));
        when(repository.existsByNome("Godot")).thenReturn(true);

        assertThatThrownBy(() -> engineService.atualizar(1L, dto))
                .isInstanceOf(EngineServiceException.class)
                .hasMessageContaining("Erro interno ao atualizar engine")
                .hasCauseInstanceOf(EngineJaExisteException.class);

        verify(repository, never()).save(any());
    }

    // ==========================================
    // TESTES DE DELETE
    // ==========================================

    @Test
    @DisplayName("Deve deletar a engine com sucesso")
    void testDeletar_Sucesso() {
        when(repository.findById(1L)).thenReturn(Optional.of(enginePadrao));

        // Como o método é void, apenas chamamos e depois verificamos se o repositório rodou o delete
        engineService.deletar(1L);

        verify(repository, times(1)).delete(enginePadrao);
    }

    @Test
    @DisplayName("Deve lançar EngineServiceException com causa EngineNaoEncontradaException ao deletar ID inexistente")
    void testDeletar_NaoEncontrado() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> engineService.deletar(99L))
                .isInstanceOf(EngineServiceException.class)
                .hasMessageContaining("Erro interno ao deletar engine")
                .hasCauseInstanceOf(EngineNaoEncontradaException.class);

        verify(repository, never()).delete(any());
    }
}