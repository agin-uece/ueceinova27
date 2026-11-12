package com.inova27.app.service;

import com.inova27.app.dto.engine.EngineCreateDTO;
import com.inova27.app.dto.engine.EngineResponseDTO;
import com.inova27.app.dto.engine.EngineUpdateDTO;
import com.inova27.app.exception.EngineJaExisteException;
import com.inova27.app.exception.EngineNaoEncontradaException;
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
        if (repository.existsByNome(dto.nome())) {
            throw new EngineJaExisteException(dto.nome());
        }

        Engine engine = new Engine();
        engine.setNome(dto.nome());

        Engine salva = repository.save(engine);
        return toResponseDTO(salva);
    }

    // 🔹 READ ALL
    @Transactional(readOnly = true)
    public List<EngineResponseDTO> listarTodos() {
        return repository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    // 🔹 READ BY ID
    @Transactional(readOnly = true)
    public EngineResponseDTO buscarPorId(Long id) {
        Engine engine = repository.findById(id)
                .orElseThrow(() -> new EngineNaoEncontradaException(id));
        return toResponseDTO(engine);
    }

    // 🔹 UPDATE
    @Transactional
    public EngineResponseDTO atualizar(Long id, EngineUpdateDTO dto) {
        Engine engine = repository.findById(id)
                .orElseThrow(EngineNaoEncontradaException::new);

        // Verifica se o novo nome já existe e pertence a outra engine
        if (!engine.getNome().equalsIgnoreCase(dto.nome()) && repository.existsByNome(dto.nome())) {
            throw new EngineJaExisteException(dto.nome());
        }

        engine.setNome(dto.nome());
        Engine atualizada = repository.save(engine);

        return toResponseDTO(atualizada);
    }

    // 🔹 DELETE
    @Transactional
    public void deletar(Long id) {
        Engine engine = repository.findById(id)
                .orElseThrow(EngineNaoEncontradaException::new);

        repository.delete(engine);
    }

    // 🔹 MAPPER
    private EngineResponseDTO toResponseDTO(Engine engine) {
        return new EngineResponseDTO(engine.getId(), engine.getNome());
    }
}
