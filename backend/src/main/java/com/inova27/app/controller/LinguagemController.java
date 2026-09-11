package com.inova27.app.controller;

import com.inova27.app.dto.linguagem.LinguagemCreateDTO;
import com.inova27.app.dto.linguagem.LinguagemResponseDTO;
import com.inova27.app.dto.linguagem.LinguagemUpdateDTO;
import com.inova27.app.service.LinguagemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/linguagens")
@RequiredArgsConstructor
public class LinguagemController {

    private static final String KEY_ERRO = "erro";

    private final LinguagemService service;

    // 🔹 POST
    @PostMapping
    public ResponseEntity<Object> criar(@RequestBody @Valid LinguagemCreateDTO dto) {
        try {
            LinguagemResponseDTO novaLinguagem = service.criar(dto);
            return ResponseEntity
                    .created(URI.create("/api/linguagens/" + novaLinguagem.id()))
                    .body(novaLinguagem);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(KEY_ERRO, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(KEY_ERRO, "Erro ao criar linguagem."));
        }
    }

    // 🔹 GET (TODOS)
    @GetMapping
    public ResponseEntity<Object> listarTodos() {
        try {
            List<LinguagemResponseDTO> linguagens = service.listarTodos();
            return ResponseEntity.ok(linguagens);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(KEY_ERRO, "Erro ao buscar a lista de linguagens."));
        }
    }

    // 🔹 GET (POR ID)
    @GetMapping("/{id}")
    public ResponseEntity<Object> buscarPorId(@PathVariable Long id) {
        try {
            LinguagemResponseDTO linguagem = service.buscarPorId(id);
            return ResponseEntity.ok(linguagem);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(KEY_ERRO, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(KEY_ERRO, "Erro interno ao buscar linguagem."));
        }
    }

    // 🔹 PUT (UPDATE)
    @PutMapping("/{id}")
    public ResponseEntity<Object> atualizar(@PathVariable Long id, @RequestBody @Valid LinguagemUpdateDTO dto) {
        try {
            LinguagemResponseDTO linguagemAtualizada = service.atualizar(id, dto);
            return ResponseEntity.ok(linguagemAtualizada);
        } catch (IllegalArgumentException e) {
            HttpStatus status = e.getMessage().contains("não encontrada") ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST;
            return ResponseEntity.status(status).body(Map.of(KEY_ERRO, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(KEY_ERRO, "Erro ao atualizar linguagem."));
        }
    }

    // 🔹 DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletar(@PathVariable Long id) {
        try {
            service.deletar(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(KEY_ERRO, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(KEY_ERRO, "Erro ao excluir a linguagem."));
        }
    }
}