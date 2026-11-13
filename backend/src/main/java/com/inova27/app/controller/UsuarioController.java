package com.inova27.app.controller;

import com.inova27.app.dto.usuarios.ConcluirRecuperacaoEmailDTO;
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
        if (authentication == null || !(authentication.getPrincipal() instanceof Usuario usuario)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, MSG_NAO_AUTENTICADO));
        }
        if (usuario.getRole() != UserRole.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Apenas administradores podem ver usuários pendentes.");
        }
        List<UsuarioResponseDTO> lista = service.listarNaoValidados();
        return ResponseEntity.ok(lista);
    }

    @PutMapping("/{id}/validar")
    public ResponseEntity<Object> validarUsuario(
            @PathVariable Long id,
            @RequestHeader(value = "X-MFA-PIN", required = false) String pin,
            Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof Usuario usuarioLogado)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, MSG_NAO_AUTENTICADO));
        }
        mfaGuard.check((Usuario) authentication.getPrincipal(), pin);
        UsuarioResponseDTO usuario = service.validarUsuario(id, usuarioLogado.getRole(), usuarioLogado.getId());
        return ResponseEntity.ok(usuario);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> buscarPorId(@PathVariable Long id) {
        UsuarioResponseDTO usuario = service.buscarPorId(id);
        return ResponseEntity.ok(usuario);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> atualizar(
            @PathVariable Long id,
            @RequestBody UsuarioUpdateDTO dados,
            @RequestHeader(value = "X-MFA-PIN", required = false) String pin,
            Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof Usuario usuarioLogado)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, MSG_NAO_AUTENTICADO));
        }
        if (usuarioLogado.getRole() != UserRole.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Apenas administradores podem atualizar usuários.");
        }
        mfaGuard.check(usuarioLogado, pin); // pode alterar o perfil (ex.: promover a ADMIN)
        UsuarioResponseDTO atualizado = service.atualizar(id, dados, usuarioLogado.getId());
        return ResponseEntity.ok(atualizado);
    }

    @PutMapping("/meus-dados")
    public ResponseEntity<Object> atualizarMeusDados(
            @RequestBody UsuarioUpdateDTO dados,
            @RequestHeader(value = "X-MFA-PIN", required = false) String pin,
            Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof Usuario usuarioLogado)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, MSG_NAO_AUTENTICADO));
        }
        mfaGuard.check((Usuario) authentication.getPrincipal(), pin);
        UsuarioResponseDTO atualizado = service.atualizarMeusDados(usuarioLogado.getId(), dados);
        return ResponseEntity.ok(atualizado);
    }

    @GetMapping("/meus-dados")
    public ResponseEntity<Object> buscarMeusDados(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof Usuario usuarioLogado)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, MSG_NAO_AUTENTICADO));
        }
        UsuarioResponseDTO meusDados = service.buscarPorId(usuarioLogado.getId());
        return ResponseEntity.ok(meusDados);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletar(
            @PathVariable Long id,
            @RequestHeader(value = "X-MFA-PIN", required = false) String pin,
            Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof Usuario usuarioLogado)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, MSG_NAO_AUTENTICADO));
        }
        if (usuarioLogado.getRole() != UserRole.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Apenas administradores podem deletar usuários.");
        }
        mfaGuard.check(usuarioLogado, pin);
        service.deletar(id, usuarioLogado.getId());
        return ResponseEntity.noContent().build();
    }

    // Passo 1: PIN enviado ao e-mail secundário (resposta idêntica exista ou não a conta)
    @PostMapping("/recuperar-email/solicitar")
    public ResponseEntity<Object> solicitarRecuperacaoEmail(@RequestBody @Valid SolicitarRecuperacaoEmailDTO dto) {
        service.solicitarRecuperacaoEmail(dto.emailAtual());
        return ResponseEntity.ok(Map.of("message", "Se a conta possuir um e-mail secundário cadastrado, um código foi enviado para ele."));
    }

    // Passo 2: valida o PIN e envia um código de confirmação ao novo e-mail principal
    @PostMapping("/recuperar-email/confirmar")
    public ResponseEntity<Object> confirmarRecuperacaoEmail(@RequestBody @Valid ConfirmarRecuperacaoEmailDTO dto) {
        service.confirmarRecuperacaoEmail(dto.emailAtual(), dto.pin(), dto.novoEmailPrincipal(), dto.novoEmailSecundario());
        return ResponseEntity.accepted().body(Map.of("message", "Enviamos um código de confirmação para o novo e-mail principal."));
    }

    // Passo 3: valida o código recebido no novo e-mail e aplica a troca
    @PostMapping("/recuperar-email/concluir")
    public ResponseEntity<Object> concluirRecuperacaoEmail(@RequestBody @Valid ConcluirRecuperacaoEmailDTO dto) {
        service.concluirRecuperacaoEmail(dto.emailAtual(), dto.codigo(), dto.novoEmailPrincipal(), dto.novoEmailSecundario());
        return ResponseEntity.ok(Map.of("message", "E-mails atualizados com sucesso. Você já pode fazer login com o novo e-mail."));
    }
}