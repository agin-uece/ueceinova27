package com.inova27.app.controller;

import com.inova27.app.dto.engine.EngineCreateDTO;
import com.inova27.app.dto.engine.EngineResponseDTO;
import com.inova27.app.dto.engine.EngineUpdateDTO;
import com.inova27.app.service.EngineService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/engines")
@RequiredArgsConstructor
public class EngineController {

    private final EngineService service;

    // 🔹 POST
    @PostMapping
    public ResponseEntity<Object> criar(@RequestBody @Valid EngineCreateDTO dto) {
        try {
            EngineResponseDTO novaEngine = service.criar(dto);
            return ResponseEntity
                    .created(URI.create("/api/engines/" + novaEngine.id()))
                    .body(novaEngine);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("erro", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("erro", "Erro ao criar engine."));
        }
    }

    // 🔹 GET (TODOS)
    @GetMapping
    public ResponseEntity<Object> listarTodos() {
        try {
            List<EngineResponseDTO> engines = service.listarTodos();
            return ResponseEntity.ok(engines);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("erro", "Erro ao buscar a lista de engines."));
        }
    }

    // 🔹 GET (POR ID)
    @GetMapping("/{id}")
    public ResponseEntity<Object> buscarPorId(@PathVariable Long id) {
        try {
            EngineResponseDTO engine = service.buscarPorId(id);
            return ResponseEntity.ok(engine);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("erro", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("erro", "Erro interno ao buscar engine."));
        }
    }

    // 🔹 PUT (UPDATE)
    @PutMapping("/{id}")
    public ResponseEntity<Object> atualizar(@PathVariable Long id, @RequestBody @Valid EngineUpdateDTO dto) {
        try {
            EngineResponseDTO engineAtualizada = service.atualizar(id, dto);
            return ResponseEntity.ok(engineAtualizada);
        } catch (IllegalArgumentException e) {
            HttpStatus status = e.getMessage().contains("não encontrada") ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST;
            return ResponseEntity.status(status).body(Map.of("erro", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("erro", "Erro ao atualizar engine."));
        }
    }

    // 🔹 DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletar(@PathVariable Long id) {
        try {
            service.deletar(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("erro", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("erro", "Erro ao excluir a engine."));
        }
    }
}