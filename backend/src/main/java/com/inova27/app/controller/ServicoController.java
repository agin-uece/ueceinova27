package com.inova27.app.controller;

import com.inova27.app.dto.servico.*;
import com.inova27.app.model.Usuario;
import com.inova27.app.security.MfaGuard;
import com.inova27.app.service.ServicoService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/servicos")
@RequiredArgsConstructor
public class ServicoController {

    private static final String KEY_ERRO = "erro";
    private static final String MSG_NAO_AUTENTICADO = "Usuário não autenticado.";

    private final ServicoService service;

    private final MfaGuard mfaGuard;

    // 🔹 CREATE
    @PostMapping
    public ResponseEntity<Object> criar(
            @RequestBody @Valid ServicoCreateDTO dto,
            Authentication authentication,
            @RequestHeader(value = "X-MFA-PIN", required = false) String pin) {
        if (authentication == null || !(authentication.getPrincipal() instanceof Usuario usuario)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, MSG_NAO_AUTENTICADO));
        }
        mfaGuard.check((Usuario) authentication.getPrincipal(), pin);
        ServicoResponseDTO novo = service.criar(dto, usuario.getId());
        return ResponseEntity
                .created(URI.create("/servicos/" + novo.id()))
                .body(novo);
    }

    // 🔹 READ ALL
    @GetMapping
    public ResponseEntity<List<ServicoResponseDTO>> listar() {
        return ResponseEntity.ok(service.listarTodos());
    }

    // 🔹 READ BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Object> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    // 🔹 UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Object> atualizar(
            @PathVariable Long id,
            @RequestBody @Valid ServicoUpdateDTO dto,
            Authentication authentication,
            @RequestHeader(value = "X-MFA-PIN", required = false) String pin) {
        if (authentication == null || !(authentication.getPrincipal() instanceof Usuario usuario)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, MSG_NAO_AUTENTICADO));
        }
        mfaGuard.check((Usuario) authentication.getPrincipal(), pin);
        return ResponseEntity.ok(service.atualizar(id, dto, usuario.getId()));
    }

    // 🔹 DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletar(
            @PathVariable Long id,
            Authentication authentication,
            @RequestHeader(value = "X-MFA-PIN", required = false) String pin) {
        if (authentication == null || !(authentication.getPrincipal() instanceof Usuario usuario)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, MSG_NAO_AUTENTICADO));
        }
        mfaGuard.check((Usuario) authentication.getPrincipal(), pin);
        service.deletar(id, usuario.getId());
        return ResponseEntity.noContent().build();
    }

    // 🔹 BUSCAR COM FILTROS
    @GetMapping("/buscar")
    public ResponseEntity<Object> buscarComFiltros(
            ServicoFiltroDTO filtro,
            @PageableDefault(size = 10, sort = "areaAtuacao") Pageable pageable) {
        Page<ServicoResponseDTO> resultados = service.buscarComFiltrosPaginado(filtro, pageable);
        return ResponseEntity.ok(resultados);
    }
}