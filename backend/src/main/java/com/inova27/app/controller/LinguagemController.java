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
        LinguagemResponseDTO novaLinguagem = service.criar(dto);
        return ResponseEntity
                .created(URI.create("/linguagens/" + novaLinguagem.id()))
                .body(novaLinguagem);
    }

    // 🔹 GET (TODOS)
    @GetMapping
    public ResponseEntity<Object> listarTodos() {
        List<LinguagemResponseDTO> linguagens = service.listarTodos();
        return ResponseEntity.ok(linguagens);
    }

    // 🔹 GET (POR ID)
    @GetMapping("/{id}")
    public ResponseEntity<Object> buscarPorId(@PathVariable Long id) {
        LinguagemResponseDTO linguagem = service.buscarPorId(id);
        return ResponseEntity.ok(linguagem);
    }

    // 🔹 PUT (UPDATE)
    @PutMapping("/{id}")
    public ResponseEntity<Object> atualizar(@PathVariable Long id, @RequestBody @Valid LinguagemUpdateDTO dto) {
        LinguagemResponseDTO linguagemAtualizada = service.atualizar(id, dto);
        return ResponseEntity.ok(linguagemAtualizada);
    }

    // 🔹 DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}