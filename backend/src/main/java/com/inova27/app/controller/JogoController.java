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
        try {
            Page<JogoResponseDTO> resultados = service.buscarComFiltrosPaginado(filtro, pageable);
            return ResponseEntity.ok(resultados);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Erro nos parâmetros de busca: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Ocorreu um erro interno ao tentar buscar os jogos: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<Object> criar(
            @RequestBody @Valid JogoCreateDTO dto,
            Authentication authentication,
            @RequestHeader(value = "X-MFA-PIN", required = false) String pin) {

        try {
            Usuario usuario = (authentication != null && authentication.getPrincipal() instanceof Usuario u) ? u : null;

            if (usuario != null) {
                mfaGuard.check(usuario, pin);
            }

            JogoResponseDTO novoJogo = service.criar(dto, usuario);

            return ResponseEntity.status(HttpStatus.CREATED).body(novoJogo);

        } catch (com.inova27.app.exception.MfaRequiredException e) {
            throw e;
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(KEY_ERRO, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(KEY_ERRO, "Erro ao criar jogo."));
        }
    }

    @PutMapping("/{id}/validar")
    public ResponseEntity<Object> validar(
            @PathVariable Long id,
            @RequestParam boolean aprovado,
            Authentication authentication,
            @RequestHeader(value = "X-MFA-PIN", required = false) String pin) {
        try {
            if (authentication == null || !(authentication.getPrincipal() instanceof Usuario usuario)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of(KEY_ERRO, USER_AUTH_MESSAGE));
            }

            mfaGuard.check(usuario, pin);
            service.validarJogo(id, aprovado, usuario);

            return ResponseEntity.ok(Map.of(KEY_MENSAGEM, "Validação realizada."));

        } catch (com.inova27.app.exception.MfaRequiredException e) {
            throw e;
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of(KEY_ERRO, e.getMessage()));
        }
    }

    @GetMapping("/meus")
    public ResponseEntity<Object> listarMinhas(
            Authentication authentication,
            @RequestParam(required = false) StatusValidacao status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        try {
            if (authentication == null || !(authentication.getPrincipal() instanceof Usuario usuario)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, USER_AUTH_MESSAGE));
            }
            Pageable pageable = PageRequest.of(page, size);
            Page<JogoResponseDTO> jogos = (status != null)
                    ? service.listarPorUsuarioEStatus(usuario.getId(), status, pageable)
                    : service.listarPorUsuario(usuario.getId(), pageable);
            return ResponseEntity.ok(jogos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(KEY_ERRO, "Erro ao buscar jogos do usuário."));
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<Object> listarPorStatus(@PathVariable StatusValidacao status) {
        try {
            List<JogoResponseDTO> jogos = service.listarPorStatus(status);
            return ResponseEntity.ok(jogos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(KEY_ERRO, "Erro ao buscar jogos."));
        }
    }

    @GetMapping
    public ResponseEntity<Object> listarTodos() {
        try {
            List<JogoResponseDTO> jogos = service.listarTodos();
            return ResponseEntity.ok(jogos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(KEY_ERRO, "Erro ao buscar a lista de jogos."));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> buscarPorId(@PathVariable Long id) {
        try {
            JogoResponseDTO jogo = service.buscarPorId(id);
            return ResponseEntity.ok(jogo);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(KEY_ERRO, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(KEY_ERRO, "Erro interno ao buscar jogo."));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> atualizar(
            @PathVariable Long id,
            @RequestBody @Valid JogoUpdateDTO dto,
            Authentication authentication,
            @RequestHeader(value = "X-MFA-PIN", required = false) String pin) {
        try {
            if (authentication == null || !(authentication.getPrincipal() instanceof Usuario)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, "Utilizador não autenticado."));
            }
            Usuario usuario = (Usuario) authentication.getPrincipal();
            JogoResponseDTO jogoAtualizado = service.atualizar(id, dto, usuario);
            if (jogoAtualizado == null) {
                return ResponseEntity.accepted().body(Map.of(KEY_MENSAGEM, "Solicitação de edição enviada com sucesso. Aguardando aprovação do administrador."));
            }
            mfaGuard.check((Usuario) authentication.getPrincipal(), pin);
            return ResponseEntity.ok(jogoAtualizado);
        } catch (com.inova27.app.exception.MfaRequiredException e) {
            throw e;
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(KEY_ERRO, e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(KEY_ERRO, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(KEY_ERRO, "Erro ao atualizar jogo."));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletar(
            @PathVariable Long id,
            Authentication authentication,
            @RequestHeader(value = "X-MFA-PIN", required = false) String pin) {
        try {
            if (authentication == null || !(authentication.getPrincipal() instanceof Usuario)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, USER_AUTH_MESSAGE));
            }
            Usuario usuario = (Usuario) authentication.getPrincipal();
            mfaGuard.check((Usuario) authentication.getPrincipal(), pin);
            boolean deletadoImediatamente = service.deletar(id, usuario);
            if (!deletadoImediatamente) {
                return ResponseEntity.accepted().body(Map.of(KEY_MENSAGEM, "Solicitação de exclusão enviada com sucesso. Aguardando aprovação do administrador."));
            }
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (com.inova27.app.exception.MfaRequiredException e) {
            throw e;
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(KEY_ERRO, e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(KEY_ERRO, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(KEY_ERRO, "Erro ao excluir o jogo."));
        }
    }
}