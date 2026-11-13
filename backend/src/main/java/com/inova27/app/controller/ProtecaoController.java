package com.inova27.app.controller;

import com.inova27.app.dto.protecao.ProtecaoCreateDTO;
import com.inova27.app.dto.protecao.ProtecaoResponseDTO;
import com.inova27.app.dto.protecao.ProtecaoUpdateDTO;
import com.inova27.app.model.Usuario;
import com.inova27.app.security.MfaGuard;
import com.inova27.app.service.ProtecaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/protecoes")
@RequiredArgsConstructor
public class ProtecaoController {

    private static final String KEY_ERRO = "erro";
    private static final String KEY_MENSAGEM = "mensagem";
    private static final String MSG_NAO_AUTENTICADO = "Usuário não autenticado.";

    private final ProtecaoService service;

    private final MfaGuard mfaGuard;

    @PostMapping
    public ResponseEntity<Object> criar(
            @RequestBody @Valid ProtecaoCreateDTO dto,
            Authentication authentication,
            @RequestHeader(value = "X-MFA-PIN", required = false) String pin) {
        if (authentication == null || !(authentication.getPrincipal() instanceof Usuario usuario)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, MSG_NAO_AUTENTICADO));
        }
        mfaGuard.check((Usuario) authentication.getPrincipal(), pin);
        ProtecaoResponseDTO response = service.criar(dto, usuario.getId());
        return ResponseEntity
                .created(URI.create("/protecoes/" + response.id()))
                .body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> atualizar(
            @PathVariable Long id,
            @RequestBody @Valid ProtecaoUpdateDTO dto,
            Authentication authentication,
            @RequestHeader(value = "X-MFA-PIN", required = false) String pin) {
        if (authentication == null || !(authentication.getPrincipal() instanceof Usuario usuario)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, MSG_NAO_AUTENTICADO));
        }
        mfaGuard.check((Usuario) authentication.getPrincipal(), pin);
        ProtecaoResponseDTO response = service.atualizar(id, dto, usuario.getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<Object> listarTodas() {
        List<ProtecaoResponseDTO> protecoes = service.listarTodas();
        return ResponseEntity.ok(protecoes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> buscarPorId(@PathVariable Long id) {
        ProtecaoResponseDTO protecao = service.buscarPorId(id);
        return ResponseEntity.ok(protecao);
    }

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
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    // ========================================================================
    // 🔹 ENDPOINTS DE RELACIONAMENTOS
    // ========================================================================

    // 🎮 JOGOS
    @PutMapping("/{protecaoId}/jogo/{jogoId}")
    public ResponseEntity<Object> vincularJogo(
            @PathVariable Long protecaoId,
            @PathVariable Long jogoId,
            Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof Usuario usuario)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, MSG_NAO_AUTENTICADO));
        }
        service.vincularJogo(protecaoId, jogoId, usuario.getId());
        return ResponseEntity.ok(Map.of(KEY_MENSAGEM, "Jogo vinculado com sucesso à proteção."));
    }

    @DeleteMapping("/{protecaoId}/jogo/{jogoId}")
    public ResponseEntity<Object> desvincularJogo(
            @PathVariable Long protecaoId,
            @PathVariable Long jogoId,
            Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof Usuario usuario)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, MSG_NAO_AUTENTICADO));
        }
        service.desvincularJogo(protecaoId, jogoId, usuario.getId());
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}