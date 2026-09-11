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
        try {
            if (authentication == null || !(authentication.getPrincipal() instanceof Usuario usuario)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, MSG_NAO_AUTENTICADO));
            }
            mfaGuard.check((Usuario) authentication.getPrincipal(), pin);
            ServicoResponseDTO novo = service.criar(dto, usuario.getId());
            return ResponseEntity
                    .created(URI.create("/servicos/" + novo.id()))
                    .body(novo);
        } catch (com.inova27.app.exception.MfaRequiredException e) {
            throw e;
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(KEY_ERRO, e.getMessage()));
        }
    }

    // 🔹 READ ALL
    @GetMapping
    public ResponseEntity<List<ServicoResponseDTO>> listar() {
        return ResponseEntity.ok(service.listarTodos());
    }

    // 🔹 READ BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Object> buscar(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(service.buscarPorId(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(KEY_ERRO, e.getMessage()));
        }
    }

    // 🔹 UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Object> atualizar(
            @PathVariable Long id,
            @RequestBody @Valid ServicoUpdateDTO dto,
            Authentication authentication,
            @RequestHeader(value = "X-MFA-PIN", required = false) String pin) {
        try {
            if (authentication == null || !(authentication.getPrincipal() instanceof Usuario usuario)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, MSG_NAO_AUTENTICADO));
            }
            mfaGuard.check((Usuario) authentication.getPrincipal(), pin);
            return ResponseEntity.ok(service.atualizar(id, dto, usuario.getId()));
        } catch (com.inova27.app.exception.MfaRequiredException e) {
            throw e;
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(KEY_ERRO, e.getMessage()));
        }
    }

    // 🔹 DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletar(
            @PathVariable Long id,
            Authentication authentication,
            @RequestHeader(value = "X-MFA-PIN", required = false) String pin) {
        try {
            if (authentication == null || !(authentication.getPrincipal() instanceof Usuario usuario)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, MSG_NAO_AUTENTICADO));
            }
            mfaGuard.check((Usuario) authentication.getPrincipal(), pin);
            service.deletar(id, usuario.getId());
            return ResponseEntity.noContent().build();
        } catch (com.inova27.app.exception.MfaRequiredException e) {
            throw e;
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(KEY_ERRO, e.getMessage()));
        }
    }

    // 🔹 BUSCAR COM FILTROS
    @GetMapping("/buscar")
    public ResponseEntity<Object> buscarComFiltros(
            ServicoFiltroDTO filtro,
            @PageableDefault(size = 10, sort = "areaAtuacao") Pageable pageable) {
        try {
            Page<ServicoResponseDTO> resultados = service.buscarComFiltrosPaginado(filtro, pageable);
            return ResponseEntity.ok(resultados);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(KEY_ERRO, "Erro nos parâmetros de busca: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(KEY_ERRO, "Ocorreu um erro interno ao tentar buscar os serviços."));
        }
    }
}