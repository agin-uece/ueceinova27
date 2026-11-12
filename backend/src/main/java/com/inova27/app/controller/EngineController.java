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
        EngineResponseDTO novaEngine = service.criar(dto);
        return ResponseEntity
                .created(URI.create("/engines/" + novaEngine.id()))
                .body(novaEngine);
    }

    // 🔹 GET (TODOS)
    @GetMapping
    public ResponseEntity<Object> listarTodos() {
        List<EngineResponseDTO> engines = service.listarTodos();
        return ResponseEntity.ok(engines);
    }

    // 🔹 GET (POR ID)
    @GetMapping("/{id}")
    public ResponseEntity<Object> buscarPorId(@PathVariable Long id) {
        EngineResponseDTO engine = service.buscarPorId(id);
        return ResponseEntity.ok(engine);
    }

    // 🔹 PUT (UPDATE)
    @PutMapping("/{id}")
    public ResponseEntity<Object> atualizar(@PathVariable Long id, @RequestBody @Valid EngineUpdateDTO dto) {
        EngineResponseDTO engineAtualizada = service.atualizar(id, dto);
        return ResponseEntity.ok(engineAtualizada);
    }

    // 🔹 DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}