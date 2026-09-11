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
        try {
            if (authentication == null || !(authentication.getPrincipal() instanceof Usuario usuario)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, MSG_NAO_AUTENTICADO));
            }
            mfaGuard.check((Usuario) authentication.getPrincipal(), pin);
            ProtecaoResponseDTO response = service.criar(dto, usuario.getId());
            return ResponseEntity
                    .created(URI.create("/api/protecoes/" + response.id()))
                    .body(response);
        } catch (com.inova27.app.exception.MfaRequiredException e) {
            throw e;
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(KEY_ERRO, "Erro ao criar proteção."));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> atualizar(
            @PathVariable Long id,
            @RequestBody @Valid ProtecaoUpdateDTO dto,
            Authentication authentication,
            @RequestHeader(value = "X-MFA-PIN", required = false) String pin) {
        try {
            if (authentication == null || !(authentication.getPrincipal() instanceof Usuario usuario)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, MSG_NAO_AUTENTICADO));
            }
            mfaGuard.check((Usuario) authentication.getPrincipal(), pin);
            ProtecaoResponseDTO response = service.atualizar(id, dto, usuario.getId());
            return ResponseEntity.ok(response);
        } catch (com.inova27.app.exception.MfaRequiredException e) {
            throw e;
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(KEY_ERRO, "Erro ao atualizar proteção."));
        }
    }

    @GetMapping
    public ResponseEntity<Object> listarTodas() {
        try {
            List<ProtecaoResponseDTO> protecoes = service.listarTodas();
            return ResponseEntity.ok(protecoes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(KEY_ERRO, "Erro ao buscar a lista de proteções."));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> buscarPorId(@PathVariable Long id) {
        try {
            ProtecaoResponseDTO protecao = service.buscarPorId(id);
            return ResponseEntity.ok(protecao);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(KEY_ERRO, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(KEY_ERRO, "Erro interno ao buscar proteção."));
        }
    }

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
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (com.inova27.app.exception.MfaRequiredException e) {
            throw e;
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(KEY_ERRO, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(KEY_ERRO, "Erro ao excluir a proteção."));
        }
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
        try {
            if (authentication == null || !(authentication.getPrincipal() instanceof Usuario usuario)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, MSG_NAO_AUTENTICADO));
            }
            service.vincularJogo(protecaoId, jogoId, usuario.getId());
            return ResponseEntity.ok(Map.of(KEY_MENSAGEM, "Jogo vinculado com sucesso à proteção."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(KEY_ERRO, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(KEY_ERRO, e.getMessage()));
        }
    }

    @DeleteMapping("/{protecaoId}/jogo/{jogoId}")
    public ResponseEntity<Object> desvincularJogo(
            @PathVariable Long protecaoId,
            @PathVariable Long jogoId,
            Authentication authentication) {
        try {
            if (authentication == null || !(authentication.getPrincipal() instanceof Usuario usuario)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, MSG_NAO_AUTENTICADO));
            }
            service.desvincularJogo(protecaoId, jogoId, usuario.getId());
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(KEY_ERRO, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(KEY_ERRO, e.getMessage()));
        }
    }
}