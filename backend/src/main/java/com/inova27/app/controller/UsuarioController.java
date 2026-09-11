package com.inova27.app.controller;

import com.inova27.app.dto.usuarios.ConfirmarRecuperacaoEmailDTO;
import com.inova27.app.dto.usuarios.SolicitarRecuperacaoEmailDTO;
import com.inova27.app.dto.usuarios.UsuarioResponseDTO;
import com.inova27.app.dto.usuarios.UsuarioUpdateDTO;
import com.inova27.app.model.UserRole;
import com.inova27.app.model.Usuario;
import com.inova27.app.security.MfaGuard;
import com.inova27.app.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private static final String KEY_ERRO = "erro";
    private static final String MSG_NAO_AUTENTICADO = "Usuário não autenticado.";

    private final UsuarioService service;

    private final MfaGuard mfaGuard;

    @GetMapping("/pendentes")
    public ResponseEntity<Object> listarPendentes(Authentication authentication) {
        try {
            if (authentication == null || !(authentication.getPrincipal() instanceof Usuario usuario)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, MSG_NAO_AUTENTICADO));
            }
            if (usuario.getRole() != UserRole.ADMIN) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Apenas administradores podem ver usuários pendentes.");
            }
            List<UsuarioResponseDTO> lista = service.listarNaoValidados();
            return ResponseEntity.ok(lista);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(KEY_ERRO, "Erro ao buscar usuários pendentes."));
        }
    }

    @PutMapping("/{id}/validar")
    public ResponseEntity<Object> validarUsuario(
            @PathVariable Long id,
            @RequestHeader(value = "X-MFA-PIN", required = false) String pin,
            Authentication authentication) {
        try {
            if (authentication == null || !(authentication.getPrincipal() instanceof Usuario usuarioLogado)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, MSG_NAO_AUTENTICADO));
            }
            mfaGuard.check((Usuario) authentication.getPrincipal(), pin);
            UsuarioResponseDTO usuario = service.validarUsuario(id, usuarioLogado.getRole(), usuarioLogado.getId());
            return ResponseEntity.ok(usuario);
        } catch (com.inova27.app.exception.MfaRequiredException e) {
            throw e;
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(KEY_ERRO, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(KEY_ERRO, "Erro ao validar usuário."));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> buscarPorId(@PathVariable Long id) {
        try {
            UsuarioResponseDTO usuario = service.buscarPorId(id);
            return ResponseEntity.ok(usuario);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(KEY_ERRO, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(KEY_ERRO, "Erro ao buscar usuário."));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> atualizar(
            @PathVariable Long id,
            @RequestBody UsuarioUpdateDTO dados,
            Authentication authentication) {
        try {
            if (authentication == null || !(authentication.getPrincipal() instanceof Usuario usuarioLogado)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, MSG_NAO_AUTENTICADO));
            }
            if (usuarioLogado.getRole() != UserRole.ADMIN) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Apenas administradores podem atualizar usuários.");
            }
            UsuarioResponseDTO atualizado = service.atualizar(id, dados, usuarioLogado.getId());
            return ResponseEntity.ok(atualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(KEY_ERRO, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(KEY_ERRO, "Erro ao atualizar usuário."));
        }
    }

    @PutMapping("/meus-dados")
    public ResponseEntity<Object> atualizarMeusDados(
            @RequestBody UsuarioUpdateDTO dados,
            @RequestHeader(value = "X-MFA-PIN", required = false) String pin,
            Authentication authentication) {
        try {
            if (authentication == null || !(authentication.getPrincipal() instanceof Usuario usuarioLogado)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, MSG_NAO_AUTENTICADO));
            }
            mfaGuard.check((Usuario) authentication.getPrincipal(), pin);
            UsuarioResponseDTO atualizado = service.atualizarMeusDados(usuarioLogado.getId(), dados);
            return ResponseEntity.ok(atualizado);
        } catch (com.inova27.app.exception.MfaRequiredException e) {
            throw e;
        } catch (RuntimeException e) {
            if (e.getMessage().contains("inválido")) {
                throw e;
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(KEY_ERRO, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(KEY_ERRO, "Erro interno."));
        }
    }

    @GetMapping("/meus-dados")
    public ResponseEntity<Object> buscarMeusDados(Authentication authentication) {
        try {
            if (authentication == null || !(authentication.getPrincipal() instanceof Usuario usuarioLogado)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, MSG_NAO_AUTENTICADO));
            }
            UsuarioResponseDTO meusDados = service.buscarPorId(usuarioLogado.getId());
            return ResponseEntity.ok(meusDados);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(KEY_ERRO, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(KEY_ERRO, "Erro ao buscar os seus dados."));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletar(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            if (authentication == null || !(authentication.getPrincipal() instanceof Usuario usuarioLogado)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, MSG_NAO_AUTENTICADO));
            }
            if (usuarioLogado.getRole() != UserRole.ADMIN) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Apenas administradores podem deletar usuários.");
            }
            service.deletar(id, usuarioLogado.getId());
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(KEY_ERRO, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(KEY_ERRO, "Erro ao deletar usuário."));
        }
    }

    @PostMapping("/recuperar-email/solicitar")
    public ResponseEntity<Object> solicitarRecuperacaoEmail(@RequestBody @Valid SolicitarRecuperacaoEmailDTO dto) {
        try {
            service.solicitarRecuperacaoEmail(dto.emailAtual());
            return ResponseEntity.ok(Map.of("message", "Se um e-mail secundário estiver cadastrado, um código foi enviado para ele."));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(KEY_ERRO, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(KEY_ERRO, "Erro interno."));
        }
    }

    @PostMapping("/recuperar-email/confirmar")
    public ResponseEntity<Object> confirmarRecuperacaoEmail(@RequestBody @Valid ConfirmarRecuperacaoEmailDTO dto) {
        try {
            service.confirmarRecuperacaoEmail(dto.emailAtual(), dto.pin(), dto.novoEmailPrincipal(), dto.novoEmailSecundario());
            return ResponseEntity.ok(Map.of("message", "E-mails atualizados com sucesso. Você já pode fazer login com o novo e-mail."));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(KEY_ERRO, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(KEY_ERRO, "Erro interno ao confirmar alteração."));
        }
    }
}