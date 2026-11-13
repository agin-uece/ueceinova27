package com.inova27.app.controller;

import com.inova27.app.dto.laboratorio.LaboratorioCreateDTO;
import com.inova27.app.dto.laboratorio.LaboratorioFiltroDTO;
import com.inova27.app.dto.laboratorio.LaboratorioResponseDTO;
import com.inova27.app.dto.laboratorio.LaboratorioUpdateDTO;
import com.inova27.app.model.StatusValidacao;
import com.inova27.app.model.Usuario;
import com.inova27.app.security.MfaGuard;
import com.inova27.app.service.LaboratorioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Map;

// Erros são traduzidos em respostas HTTP pelo GlobalExceptionHandler
@RestController
@RequestMapping("/laboratorios")
@RequiredArgsConstructor
public class LaboratorioController {

    private static final String KEY_ERRO = "erro";
    private static final String KEY_MENSAGEM = "mensagem";
    private static final String MSG_NAO_AUTENTICADO = "Usuário não autenticado.";

    private final LaboratorioService service;

    private final MfaGuard mfaGuard;

    @PutMapping("/{id}/validar")
    public ResponseEntity<Object> validar(
            @PathVariable Long id,
            @RequestParam boolean aprovado,
            Authentication authentication,
            @RequestHeader(value = "X-MFA-PIN", required = false) String pin) {
        if (!(usuarioLogado(authentication) instanceof Usuario usuario)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, MSG_NAO_AUTENTICADO));
        }
        mfaGuard.check(usuario, pin); // igual a jogos e usuários
        service.validarLaboratorio(id, aprovado, usuario);
        return ResponseEntity.ok(Map.of(KEY_MENSAGEM, "Validação realizada."));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<Object> listarPorStatus(@PathVariable StatusValidacao status) {
        List<LaboratorioResponseDTO> labs = service.listarPorStatus(status);
        return ResponseEntity.ok(labs);
    }

    @PostMapping
    public ResponseEntity<Object> criar(
            @RequestBody @Valid LaboratorioCreateDTO dto,
            Authentication authentication,
            @RequestHeader(value = "X-MFA-PIN", required = false) String pin) {
        Usuario usuario = usuarioLogado(authentication);
        if (usuario != null) {
            mfaGuard.check(usuario, pin);
        }
        LaboratorioResponseDTO response = service.criar(dto, usuario);
        return ResponseEntity
                .created(URI.create("/laboratorios/" + response.id()))
                .body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> atualizar(
            @PathVariable Long id,
            @RequestBody @Valid LaboratorioUpdateDTO dto,
            Authentication authentication,
            @RequestHeader(value = "X-MFA-PIN", required = false) String pin) {
        if (!(usuarioLogado(authentication) instanceof Usuario usuario)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, MSG_NAO_AUTENTICADO));
        }
        mfaGuard.check(usuario, pin);
        LaboratorioResponseDTO response = service.atualizar(id, dto, usuario);
        if (response == null) {
            return ResponseEntity.accepted().body(Map.of(KEY_MENSAGEM, "Solicitação de edição enviada com sucesso. Aguardando aprovação do administrador."));
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<Object> listarTodos() {
        List<LaboratorioResponseDTO> lista = service.listarTodos();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> buscarPorId(@PathVariable Long id, Authentication authentication) {
        LaboratorioResponseDTO response = service.buscarPorId(id, usuarioLogado(authentication));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/buscar")
    public ResponseEntity<Object> buscarComFiltros(
            LaboratorioFiltroDTO filtro,
            @PageableDefault(size = 10, sort = "nome") Pageable pageable) {
        Page<LaboratorioResponseDTO> resultados = service.buscarComFiltrosPaginado(filtro, pageable);
        return ResponseEntity.ok(resultados);
    }

    @GetMapping("/meus")
    public ResponseEntity<Object> listarMinhas(
            Authentication authentication,
            @RequestParam(required = false) StatusValidacao status) {
        if (!(usuarioLogado(authentication) instanceof Usuario usuario)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, MSG_NAO_AUTENTICADO));
        }
        List<LaboratorioResponseDTO> labs = (status != null)
                ? service.listarPorUsuarioEStatus(usuario.getId(), status)
                : service.listarPorUsuario(usuario.getId());
        return ResponseEntity.ok(labs);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletar(
            @PathVariable Long id,
            Authentication authentication,
            @RequestHeader(value = "X-MFA-PIN", required = false) String pin) {
        if (!(usuarioLogado(authentication) instanceof Usuario usuario)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, MSG_NAO_AUTENTICADO));
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
