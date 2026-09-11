package com.inova27.app.service;

import com.inova27.app.dto.engine.EngineCreateDTO;
import com.inova27.app.dto.engine.EngineResponseDTO;
import com.inova27.app.dto.engine.EngineUpdateDTO;
import com.inova27.app.exception.EngineJaExisteException;
import com.inova27.app.exception.EngineNaoEncontradaException;
import com.inova27.app.exception.EngineServiceException;
import com.inova27.app.model.Engine;
import com.inova27.app.repository.EngineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EngineService {

    private final EngineRepository repository;

    // 🔹 CREATE
    @Transactional
    public EngineResponseDTO criar(EngineCreateDTO dto) {
        try {
            if (repository.existsByNome(dto.nome())) {
                throw new EngineJaExisteException(dto.nome());
            }

            Engine engine = new Engine();
            engine.setNome(dto.nome());

            Engine salva = repository.save(engine);
            return toResponseDTO(salva);

        } catch (Exception e) {
            throw new EngineServiceException("Erro interno ao criar engine", e);
        }
    }

    // 🔹 READ ALL
    @Transactional(readOnly = true)
    public List<EngineResponseDTO> listarTodos() {
        try {
            return repository.findAll()
                    .stream()
                    .map(this::toResponseDTO)
                    .toList();
        } catch (Exception e) {
            throw new EngineServiceException("Erro ao buscar a lista de engines", e);
        }
    }

    // 🔹 READ BY ID
    @Transactional(readOnly = true)
    public EngineResponseDTO buscarPorId(Long id) {
        try {
            Engine engine = repository.findById(id)
                    .orElseThrow(() -> new EngineNaoEncontradaException(id));
            return toResponseDTO(engine);
        } catch (Exception e) {
            throw new EngineServiceException("Erro interno ao buscar engine", e);
        }
    }

    // 🔹 UPDATE
    @Transactional
    public EngineResponseDTO atualizar(Long id, EngineUpdateDTO dto) {
        try {
            Engine engine = repository.findById(id)
                    .orElseThrow(EngineNaoEncontradaException::new);

            // Verifica se o novo nome já existe e pertence a outra engine
            if (!engine.getNome().equalsIgnoreCase(dto.nome()) && repository.existsByNome(dto.nome())) {
                throw new EngineJaExisteException(dto.nome());
            }

            engine.setNome(dto.nome());
            Engine atualizada = repository.save(engine);

            return toResponseDTO(atualizada);

        } catch (Exception e) {
            throw new EngineServiceException("Erro interno ao atualizar engine", e);
        }
    }

    // 🔹 DELETE
    @Transactional
    public void deletar(Long id) {
        try {
            Engine engine = repository.findById(id)
                    .orElseThrow(EngineNaoEncontradaException::new);

            repository.delete(engine);
        } catch (Exception e) {
            throw new EngineServiceException("Erro interno ao deletar engine", e);
        }
    }

    // 🔹 MAPPER
    private EngineResponseDTO toResponseDTO(Engine engine) {
        return new EngineResponseDTO(engine.getId(), engine.getNome());
    }
}
