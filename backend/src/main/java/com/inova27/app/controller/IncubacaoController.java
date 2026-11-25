package com.inova27.app.controller;

import com.inova27.app.dto.incubacao.IncubacaoRequestDTO;
import com.inova27.app.dto.incubacao.IncubacaoResponseDTO;
import com.inova27.app.model.Usuario;
import com.inova27.app.service.IncubacaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

// Leitura pública; criar/editar/excluir só para ADMIN (SecurityConfig). Erros pelo GlobalExceptionHandler.
@RestController
@RequestMapping("/incubacoes")
@RequiredArgsConstructor
public class IncubacaoController {

    private final IncubacaoService service;

    @GetMapping
    public List<IncubacaoResponseDTO> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public IncubacaoResponseDTO buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public ResponseEntity<IncubacaoResponseDTO> criar(@RequestBody @Valid IncubacaoRequestDTO dto,
                                                      @AuthenticationPrincipal Usuario usuario) {
        IncubacaoResponseDTO criada = service.criar(dto, usuario.getId());
        return ResponseEntity.created(URI.create("/incubacoes/" + criada.id())).body(criada);
    }

    @PutMapping("/{id}")
    public IncubacaoResponseDTO atualizar(@PathVariable Long id, @RequestBody @Valid IncubacaoRequestDTO dto,
                                          @AuthenticationPrincipal Usuario usuario) {
        return service.atualizar(id, dto, usuario.getId());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id, @AuthenticationPrincipal Usuario usuario) {
        service.excluir(id, usuario.getId());
        return ResponseEntity.noContent().build();
    }
}
