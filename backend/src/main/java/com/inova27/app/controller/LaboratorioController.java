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
            Authentication authentication) {
        try {
            if (authentication == null || !(authentication.getPrincipal() instanceof Usuario)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, MSG_NAO_AUTENTICADO));
            }
            Usuario usuario = (Usuario) authentication.getPrincipal();
            service.validarLaboratorio(id, aprovado, usuario);
            return ResponseEntity.ok(Map.of(KEY_MENSAGEM, "Validação realizada."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(KEY_ERRO, e.getMessage()));
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<Object> listarPorStatus(@PathVariable StatusValidacao status) {
        try {
            List<LaboratorioResponseDTO> labs = service.listarPorStatus(status);
            return ResponseEntity.ok(labs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(KEY_ERRO, "Erro ao buscar laboratórios."));
        }
    }

    @PostMapping
    public ResponseEntity<Object> criar(
            @RequestBody @Valid LaboratorioCreateDTO dto,
            Authentication authentication,
            @RequestHeader(value = "X-MFA-PIN", required = false) String pin) {
        try {
            Usuario usuario = (authentication != null && authentication.getPrincipal() instanceof Usuario u) ? u : null;

            if (usuario != null) {
                mfaGuard.check(usuario, pin);
            }

            LaboratorioResponseDTO response = service.criar(dto, usuario);
            return ResponseEntity
                    .created(URI.create("/api/laboratorios/" + response.id()))
                    .body(response);
        } catch (com.inova27.app.exception.MfaRequiredException e) {
            throw e;
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(KEY_ERRO, e.getMessage()));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(KEY_ERRO, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(KEY_ERRO, "Erro ao criar laboratório."));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> atualizar(
            @PathVariable Long id,
            @RequestBody @Valid LaboratorioUpdateDTO dto,
            Authentication authentication,
            @RequestHeader(value = "X-MFA-PIN", required = false) String pin) {
        try {
            if (authentication == null || !(authentication.getPrincipal() instanceof Usuario)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, MSG_NAO_AUTENTICADO));
            }
            Usuario usuario = (Usuario) authentication.getPrincipal();
            mfaGuard.check((Usuario) authentication.getPrincipal(), pin);
            LaboratorioResponseDTO response = service.atualizar(id, dto, usuario);
            return ResponseEntity.ok(response);
        } catch (com.inova27.app.exception.MfaRequiredException e) {
            throw e;
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(KEY_ERRO, e.getMessage()));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(KEY_ERRO, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(KEY_ERRO, "Erro ao atualizar laboratório."));
        }
    }

    @GetMapping
    public ResponseEntity<Object> listarTodos() {
        try {
            List<LaboratorioResponseDTO> lista = service.listarTodos();
            return ResponseEntity.ok(lista);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(KEY_ERRO, "Erro ao buscar a lista de laboratórios."));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> buscarPorId(@PathVariable Long id) {
        try {
            LaboratorioResponseDTO response = service.buscarPorId(id);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(KEY_ERRO, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(KEY_ERRO, "Erro interno ao buscar laboratório."));
        }
    }

    @GetMapping("/buscar")
    public ResponseEntity<Object> buscarComFiltros(
            LaboratorioFiltroDTO filtro,
            @PageableDefault(size = 10, sort = "nome") Pageable pageable) {
        try {
            Page<LaboratorioResponseDTO> resultados = service.buscarComFiltrosPaginado(filtro, pageable);
            return ResponseEntity.ok(resultados);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(KEY_ERRO, "Erro nos parâmetros de busca: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(KEY_ERRO, "Ocorreu um erro interno ao tentar buscar os laboratórios."));
        }
    }

    @GetMapping("/meus")
    public ResponseEntity<Object> listarMinhas(
            Authentication authentication,
            @RequestParam(required = false) StatusValidacao status) {
        try {
            if (authentication == null || !(authentication.getPrincipal() instanceof Usuario usuario)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, MSG_NAO_AUTENTICADO));
            }
            List<LaboratorioResponseDTO> labs = (status != null)
                    ? service.listarPorUsuarioEStatus(usuario.getId(), status)
                    : service.listarPorUsuario(usuario.getId());
            return ResponseEntity.ok(labs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(KEY_ERRO, "Erro ao buscar laboratórios do usuário."));
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
            service.deletar(id, usuario);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (com.inova27.app.exception.MfaRequiredException e) {
            throw e;
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(KEY_ERRO, e.getMessage()));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(KEY_ERRO, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(KEY_ERRO, "Erro ao excluir o laboratório."));
        }
    }
}