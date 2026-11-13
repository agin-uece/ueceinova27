package com.inova27.app.controller;

import com.inova27.app.dto.jogo.JogoCreateDTO;
import com.inova27.app.dto.jogo.JogoFiltroDTO;
import com.inova27.app.dto.jogo.JogoResponseDTO;
import com.inova27.app.dto.jogo.JogoUpdateDTO;
import com.inova27.app.model.StatusValidacao;
import com.inova27.app.model.Usuario;
import com.inova27.app.security.MfaGuard;
import com.inova27.app.service.JogoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

// Erros são traduzidos em respostas HTTP pelo GlobalExceptionHandler
@RestController
@RequestMapping("/jogos")
@RequiredArgsConstructor
public class JogoController {

    private static final String KEY_ERRO = "erro";
    private static final String KEY_MENSAGEM = "mensagem";
    private static final String USER_AUTH_MESSAGE = "Usuário não autenticado.";

    private final JogoService service;

    private final MfaGuard mfaGuard;

    @GetMapping("/buscar")
    public ResponseEntity<Object> buscarComFiltros(
            JogoFiltroDTO filtro,
            @PageableDefault(size = 10, sort = "nome") Pageable pageable) {
        Page<JogoResponseDTO> resultados = service.buscarComFiltrosPaginado(filtro, pageable);
        return ResponseEntity.ok(resultados);
    }

    @PostMapping
    public ResponseEntity<Object> criar(
            @RequestBody @Valid JogoCreateDTO dto,
            Authentication authentication,
            @RequestHeader(value = "X-MFA-PIN", required = false) String pin) {
        Usuario usuario = usuarioLogado(authentication);
        if (usuario != null) {
            mfaGuard.check(usuario, pin);
        }
        JogoResponseDTO novoJogo = service.criar(dto, usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoJogo);
    }

    @PutMapping("/{id}/validar")
    public ResponseEntity<Object> validar(
            @PathVariable Long id,
            @RequestParam boolean aprovado,
            Authentication authentication,
            @RequestHeader(value = "X-MFA-PIN", required = false) String pin) {
        if (!(usuarioLogado(authentication) instanceof Usuario usuario)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, USER_AUTH_MESSAGE));
        }
        mfaGuard.check(usuario, pin);
        service.validarJogo(id, aprovado, usuario);
        return ResponseEntity.ok(Map.of(KEY_MENSAGEM, "Validação realizada."));
    }

    @GetMapping("/meus")
    public ResponseEntity<Object> listarMinhas(
            Authentication authentication,
            @RequestParam(required = false) StatusValidacao status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        if (!(usuarioLogado(authentication) instanceof Usuario usuario)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, USER_AUTH_MESSAGE));
        }
        Pageable pageable = PageRequest.of(page, size);
        Page<JogoResponseDTO> jogos = (status != null)
                ? service.listarPorUsuarioEStatus(usuario.getId(), status, pageable)
                : service.listarPorUsuario(usuario.getId(), pageable);
        return ResponseEntity.ok(jogos);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<Object> listarPorStatus(@PathVariable StatusValidacao status) {
        List<JogoResponseDTO> jogos = service.listarPorStatus(status);
        return ResponseEntity.ok(jogos);
    }

    @GetMapping
    public ResponseEntity<Object> listarTodos() {
        List<JogoResponseDTO> jogos = service.listarTodos();
        return ResponseEntity.ok(jogos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> buscarPorId(@PathVariable Long id, Authentication authentication) {
        JogoResponseDTO jogo = service.buscarPorId(id, usuarioLogado(authentication));
        return ResponseEntity.ok(jogo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> atualizar(
            @PathVariable Long id,
            @RequestBody @Valid JogoUpdateDTO dto,
            Authentication authentication,
            @RequestHeader(value = "X-MFA-PIN", required = false) String pin) {
        if (!(usuarioLogado(authentication) instanceof Usuario usuario)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, USER_AUTH_MESSAGE));
        }
        // MFA ANTES de alterar qualquer dado (antes a checagem vinha depois da gravação)
        mfaGuard.check(usuario, pin);
        JogoResponseDTO jogoAtualizado = service.atualizar(id, dto, usuario);
        if (jogoAtualizado == null) {
            return ResponseEntity.accepted().body(Map.of(KEY_MENSAGEM, "Solicitação de edição enviada com sucesso. Aguardando aprovação do administrador."));
        }
        return ResponseEntity.ok(jogoAtualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletar(
            @PathVariable Long id,
            Authentication authentication,
            @RequestHeader(value = "X-MFA-PIN", required = false) String pin) {
        if (!(usuarioLogado(authentication) instanceof Usuario usuario)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, USER_AUTH_MESSAGE));
        }
        mfaGuard.check(usuario, pin);
        boolean deletadoImediatamente = service.deletar(id, usuario);
        if (!deletadoImediatamente) {
            return ResponseEntity.accepted().body(Map.of(KEY_MENSAGEM, "Solicitação de exclusão enviada com sucesso. Aguardando aprovação do administrador."));
        }
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    private static Usuario usuarioLogado(Authentication authentication) {
        return authentication != null && authentication.getPrincipal() instanceof Usuario u ? u : null;
    }
}
