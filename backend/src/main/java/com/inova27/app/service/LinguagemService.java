package com.inova27.app.service;

import com.inova27.app.dto.linguagem.LinguagemCreateDTO;
import com.inova27.app.dto.linguagem.LinguagemResponseDTO;
import com.inova27.app.dto.linguagem.LinguagemUpdateDTO;
import com.inova27.app.exception.BusinessException;
import com.inova27.app.exception.ResourceNotFoundException;
import com.inova27.app.model.Linguagem;
import com.inova27.app.repository.LinguagemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LinguagemService {

    private final LinguagemRepository repository;

    // 🔹 CREATE
    @Transactional
    public LinguagemResponseDTO criar(LinguagemCreateDTO dto) {
        if (repository.existsByNome(dto.nome())) {
            throw new BusinessException("Já existe uma linguagem cadastrada com este nome.");
        }

        Linguagem linguagem = new Linguagem();
        linguagem.setNome(dto.nome());

        return toResponseDTO(repository.save(linguagem));
    }

    // 🔹 READ ALL
    @Transactional(readOnly = true)
    public List<LinguagemResponseDTO> listarTodos() {
        return repository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .toList(); // ✅ Java 16+
    }

    // 🔹 READ BY ID
    @Transactional(readOnly = true)
    public LinguagemResponseDTO buscarPorId(Long id) {
        Linguagem linguagem = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Linguagem não encontrada com o ID: " + id));

        return toResponseDTO(linguagem);
    }

    // 🔹 UPDATE
    @Transactional
    public LinguagemResponseDTO atualizar(Long id, LinguagemUpdateDTO dto) {
        Linguagem linguagem = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Linguagem não encontrada para atualização."));

        if (!linguagem.getNome().equalsIgnoreCase(dto.nome())
                && repository.existsByNome(dto.nome())) {
            throw new BusinessException("Já existe outra linguagem cadastrada com este nome.");
        }

        linguagem.setNome(dto.nome());

        return toResponseDTO(repository.save(linguagem));
    }

    // 🔹 DELETE
    @Transactional
    public void deletar(Long id) {
        Linguagem linguagem = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Linguagem não encontrada para exclusão."));

        repository.delete(linguagem);
    }

    // 🔹 MAPPER
    private LinguagemResponseDTO toResponseDTO(Linguagem linguagem) {
        return new LinguagemResponseDTO(
                linguagem.getId(),
                linguagem.getNome()
        );
    }
}