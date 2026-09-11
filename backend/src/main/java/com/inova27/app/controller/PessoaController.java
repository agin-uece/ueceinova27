package com.inova27.app.controller;

import com.inova27.app.dto.pessoa.PessoaCreateDTO;
import com.inova27.app.dto.pessoa.PessoaFiltroDTO;
import com.inova27.app.dto.pessoa.PessoaResponseDTO;
import com.inova27.app.dto.pessoa.PessoaUpdateDTO;
import com.inova27.app.model.StatusValidacao;
import com.inova27.app.model.Usuario;
import com.inova27.app.security.MfaGuard;
import com.inova27.app.service.PessoaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/pessoas")
@RequiredArgsConstructor
public class PessoaController {

    private static final String KEY_ERRO = "erro";
    private static final String KEY_MENSAGEM = "mensagem";
    private static final String MSG_NAO_AUTENTICADO = "Usuário não autenticado.";

    private final PessoaService service;

    private final MfaGuard mfaGuard;

    @PostMapping
    public ResponseEntity<Object> criar(
            @RequestBody @Valid PessoaCreateDTO dto,
            Authentication authentication,
            @RequestHeader(value = "X-MFA-PIN", required = false) String pin) {
        try {
            Usuario usuario = null;
            if (authentication != null && authentication.getPrincipal() instanceof Usuario u) {
                usuario = u;
                mfaGuard.check((Usuario) authentication.getPrincipal(), pin);
            }
            PessoaResponseDTO novaPessoa = service.criar(dto, usuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(novaPessoa);
        } catch (com.inova27.app.exception.MfaRequiredException e) {
            throw e;
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(KEY_ERRO, "Erro ao criar pessoa."));
        }
    }

    @GetMapping("/minhas")
    public ResponseEntity<Object> listarMinhas(
            Authentication authentication,
            @RequestParam(required = false) StatusValidacao status) {
        try {
            if (authentication == null || !(authentication.getPrincipal() instanceof Usuario usuario)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, MSG_NAO_AUTENTICADO));
            }
            List<PessoaResponseDTO> pessoas = (status != null)
                    ? service.listarPorUsuarioEStatus(usuario.getId(), status)
                    : service.listarPorUsuario(usuario.getId());
            return ResponseEntity.ok(pessoas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(KEY_ERRO, "Erro ao buscar pessoas do usuário."));
        }
    }

    @PutMapping("/{id}/validar")
    public ResponseEntity<Object> validar(
            @PathVariable Long id,
            @RequestParam boolean aprovado,
            Authentication authentication) {
        try {
            if (authentication == null || !(authentication.getPrincipal() instanceof Usuario usuario)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, MSG_NAO_AUTENTICADO));
            }
            service.validarPessoa(id, aprovado, usuario);
            return ResponseEntity.ok(Map.of(KEY_MENSAGEM, "Validação realizada."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(KEY_ERRO, e.getMessage()));
        }
    }

    @GetMapping("/buscar")
    public ResponseEntity<Object> buscarComFiltros(
            PessoaFiltroDTO filtro,
            @PageableDefault(size = 10, sort = "nome") Pageable pageable) {
        try {
            Page<PessoaResponseDTO> resultados = service.buscarComFiltrosPaginado(filtro, pageable);
            return ResponseEntity.ok(resultados);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(KEY_ERRO, "Erro nos parâmetros de busca: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(KEY_ERRO, "Ocorreu um erro interno ao tentar buscar as pessoas."));
        }
    }

    @GetMapping("/prestadores")
    public ResponseEntity<Object> listarPrestadoresAprovados() {
        try {
            List<PessoaResponseDTO> prestadores = service.listarAprovadosComServicos();
            return ResponseEntity.ok(prestadores);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(KEY_ERRO, "Erro ao buscar pessoas prestadoras de serviço."));
        }
    }

    @GetMapping("/pendentes")
    public ResponseEntity<Object> listarPendentes() {
        try {
            List<PessoaResponseDTO> pessoas = service.listarPendentes();
            return ResponseEntity.ok(pessoas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(KEY_ERRO, "Erro ao buscar pessoas pendentes de validação."));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> atualizar(
            @PathVariable Long id,
            @RequestBody @Valid PessoaUpdateDTO dto,
            Authentication authentication,
            @RequestHeader(value = "X-MFA-PIN", required = false) String pin) {
        try {
            if (authentication == null || !(authentication.getPrincipal() instanceof Usuario)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, MSG_NAO_AUTENTICADO));
            }
            Usuario usuario = (Usuario) authentication.getPrincipal();
            mfaGuard.check((Usuario) authentication.getPrincipal(), pin);
            PessoaResponseDTO pessoaAtualizada = service.atualizar(id, dto, usuario);
            if (pessoaAtualizada == null) {
                return ResponseEntity.accepted().body(Map.of(KEY_MENSAGEM, "Solicitação de edição enviada com sucesso. Aguardando aprovação do administrador."));
            }
            return ResponseEntity.ok(pessoaAtualizada);
        } catch (com.inova27.app.exception.MfaRequiredException e) {
            throw e;
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(KEY_ERRO, e.getMessage()));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(KEY_ERRO, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(KEY_ERRO, "Erro ao atualizar pessoa."));
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<Object> listarPorStatus(@PathVariable StatusValidacao status) {
        try {
            List<PessoaResponseDTO> pessoas = service.listarPorStatus(status);
            return ResponseEntity.ok(pessoas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(KEY_ERRO, "Erro ao buscar pessoas."));
        }
    }

    @GetMapping
    public ResponseEntity<Object> listarTodosAprovados() {
        try {
            List<PessoaResponseDTO> pessoas = service.listarPorStatus(StatusValidacao.APROVADO);
            return ResponseEntity.ok(pessoas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(KEY_ERRO, "Erro ao buscar pessoas."));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> buscarPorId(@PathVariable Long id, Authentication authentication) {
        try {
            Usuario usuario = null;
            if (authentication != null && authentication.getPrincipal() instanceof Usuario u) {
                usuario = u;
            }
            PessoaResponseDTO pessoa = service.buscarPorId(id, usuario);
            return ResponseEntity.ok(pessoa);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(KEY_ERRO, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(KEY_ERRO, e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletar(
            @PathVariable Long id,
            Authentication authentication,
            @RequestHeader(value = "X-MFA-PIN", required = false) String pin) {
        try {
            if (authentication == null || !(authentication.getPrincipal() instanceof Usuario)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, MSG_NAO_AUTENTICADO));
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
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(KEY_ERRO, e.getMessage()));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(KEY_ERRO, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(KEY_ERRO, "Erro ao excluir a pessoa."));
        }
    }

    // ========================================================================
    // 🔹 ENDPOINTS DE RELACIONAMENTOS
    // ========================================================================

    // 🔬 LABORATÓRIO
    @PutMapping("/{pessoaId}/laboratorio/{laboratorioId}")
    public ResponseEntity<Object> vincularLaboratorio(
            @PathVariable Long pessoaId,
            @PathVariable Long laboratorioId,
            Authentication authentication) {
        try {
            Usuario usuario = null;
            if (authentication != null && authentication.getPrincipal() instanceof Usuario u) {
                usuario = u;
            }
            service.vincularLaboratorio(pessoaId, laboratorioId, usuario);
            return ResponseEntity.ok(Map.of(KEY_MENSAGEM, "Laboratório vinculado com sucesso."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(KEY_ERRO, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(KEY_ERRO, e.getMessage()));
        }
    }

    @DeleteMapping("/{pessoaId}/laboratorio/{laboratorioId}")
    public ResponseEntity<Object> desvincularLaboratorio(
            @PathVariable Long pessoaId,
            @PathVariable Long laboratorioId,
            Authentication authentication) {
        try {
            Usuario usuario = null;
            if (authentication != null && authentication.getPrincipal() instanceof Usuario u) {
                usuario = u;
            }
            service.desvincularLaboratorio(pessoaId, laboratorioId, usuario);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(KEY_ERRO, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(KEY_ERRO, e.getMessage()));
        }
    }

    // 🚀 STARTUPS
    @PutMapping("/{pessoaId}/startups/{startupId}")
    public ResponseEntity<Object> vincularStartup(
            @PathVariable Long pessoaId,
            @PathVariable Long startupId,
            Authentication authentication) {
        try {
            Usuario usuario = null;
            if (authentication != null && authentication.getPrincipal() instanceof Usuario u) {
                usuario = u;
            }
            service.vincularStartup(pessoaId, startupId, usuario);
            return ResponseEntity.ok(Map.of(KEY_MENSAGEM, "Startup vinculada com sucesso."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(KEY_ERRO, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(KEY_ERRO, e.getMessage()));
        }
    }

    @DeleteMapping("/{pessoaId}/startups/{startupId}")
    public ResponseEntity<Object> desvincularStartup(
            @PathVariable Long pessoaId,
            @PathVariable Long startupId,
            Authentication authentication) {
        try {
            Usuario usuario = null;
            if (authentication != null && authentication.getPrincipal() instanceof Usuario u) {
                usuario = u;
            }
            service.desvincularStartup(pessoaId, startupId, usuario);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(KEY_ERRO, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(KEY_ERRO, e.getMessage()));
        }
    }

    // 🛡️ PROTEÇÕES
    @PutMapping("/{pessoaId}/protecoes/{protecaoId}")
    public ResponseEntity<Object> vincularProtecao(
            @PathVariable Long pessoaId,
            @PathVariable Long protecaoId,
            Authentication authentication) {
        try {
            Usuario usuario = null;
            if (authentication != null && authentication.getPrincipal() instanceof Usuario u) {
                usuario = u;
            }
            service.vincularProtecao(pessoaId, protecaoId, usuario);
            return ResponseEntity.ok(Map.of(KEY_MENSAGEM, "Proteção vinculada com sucesso."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(KEY_ERRO, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(KEY_ERRO, e.getMessage()));
        }
    }

    @DeleteMapping("/{pessoaId}/protecoes/{protecaoId}")
    public ResponseEntity<Object> desvincularProtecao(
            @PathVariable Long pessoaId,
            @PathVariable Long protecaoId,
            Authentication authentication) {
        try {
            Usuario usuario = null;
            if (authentication != null && authentication.getPrincipal() instanceof Usuario u) {
                usuario = u;
            }
            service.desvincularProtecao(pessoaId, protecaoId, usuario);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(KEY_ERRO, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(KEY_ERRO, e.getMessage()));
        }
    }
}