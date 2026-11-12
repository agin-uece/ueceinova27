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

// Erros são traduzidos em respostas HTTP pelo GlobalExceptionHandler
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
        Usuario usuario = usuarioLogado(authentication);
        if (usuario != null) {
            mfaGuard.check(usuario, pin);
        }
        PessoaResponseDTO novaPessoa = service.criar(dto, usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaPessoa);
    }

    @GetMapping("/minhas")
    public ResponseEntity<Object> listarMinhas(
            Authentication authentication,
            @RequestParam(required = false) StatusValidacao status) {
        if (!(usuarioLogado(authentication) instanceof Usuario usuario)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, MSG_NAO_AUTENTICADO));
        }
        List<PessoaResponseDTO> pessoas = (status != null)
                ? service.listarPorUsuarioEStatus(usuario.getId(), status)
                : service.listarPorUsuario(usuario.getId());
        return ResponseEntity.ok(pessoas);
    }

    @PutMapping("/{id}/validar")
    public ResponseEntity<Object> validar(
            @PathVariable Long id,
            @RequestParam boolean aprovado,
            Authentication authentication) {
        if (!(usuarioLogado(authentication) instanceof Usuario usuario)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, MSG_NAO_AUTENTICADO));
        }
        service.validarPessoa(id, aprovado, usuario);
        return ResponseEntity.ok(Map.of(KEY_MENSAGEM, "Validação realizada."));
    }

    @GetMapping("/buscar")
    public ResponseEntity<Object> buscarComFiltros(
            PessoaFiltroDTO filtro,
            @PageableDefault(size = 10, sort = "nome") Pageable pageable) {
        Page<PessoaResponseDTO> resultados = service.buscarComFiltrosPaginado(filtro, pageable);
        return ResponseEntity.ok(resultados);
    }

    @GetMapping("/prestadores")
    public ResponseEntity<Object> listarPrestadoresAprovados() {
        return ResponseEntity.ok(service.listarAprovadosComServicos());
    }

    @GetMapping("/pendentes")
    public ResponseEntity<Object> listarPendentes() {
        return ResponseEntity.ok(service.listarPendentes());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> atualizar(
            @PathVariable Long id,
            @RequestBody @Valid PessoaUpdateDTO dto,
            Authentication authentication,
            @RequestHeader(value = "X-MFA-PIN", required = false) String pin) {
        if (!(usuarioLogado(authentication) instanceof Usuario usuario)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, MSG_NAO_AUTENTICADO));
        }
        mfaGuard.check(usuario, pin);
        PessoaResponseDTO pessoaAtualizada = service.atualizar(id, dto, usuario);
        if (pessoaAtualizada == null) {
            return ResponseEntity.accepted().body(Map.of(KEY_MENSAGEM, "Solicitação de edição enviada com sucesso. Aguardando aprovação do administrador."));
        }
        return ResponseEntity.ok(pessoaAtualizada);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<Object> listarPorStatus(@PathVariable StatusValidacao status) {
        return ResponseEntity.ok(service.listarPorStatus(status));
    }

    @GetMapping
    public ResponseEntity<Object> listarTodosAprovados() {
        return ResponseEntity.ok(service.listarPorStatus(StatusValidacao.APROVADO));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> buscarPorId(@PathVariable Long id, Authentication authentication) {
        PessoaResponseDTO pessoa = service.buscarPorId(id, usuarioLogado(authentication));
        return ResponseEntity.ok(pessoa);
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

    // ========================================================================
    // 🔹 ENDPOINTS DE RELACIONAMENTOS (somente ADMIN, via SecurityConfig)
    // ========================================================================

    @PutMapping("/{pessoaId}/laboratorio/{laboratorioId}")
    public ResponseEntity<Object> vincularLaboratorio(
            @PathVariable Long pessoaId,
            @PathVariable Long laboratorioId,
            Authentication authentication) {
        service.vincularLaboratorio(pessoaId, laboratorioId, usuarioLogado(authentication));
        return ResponseEntity.ok(Map.of(KEY_MENSAGEM, "Laboratório vinculado com sucesso."));
    }

    @DeleteMapping("/{pessoaId}/laboratorio/{laboratorioId}")
    public ResponseEntity<Object> desvincularLaboratorio(
            @PathVariable Long pessoaId,
            @PathVariable Long laboratorioId,
            Authentication authentication) {
        service.desvincularLaboratorio(pessoaId, laboratorioId, usuarioLogado(authentication));
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PutMapping("/{pessoaId}/startups/{startupId}")
    public ResponseEntity<Object> vincularStartup(
            @PathVariable Long pessoaId,
            @PathVariable Long startupId,
            Authentication authentication) {
        service.vincularStartup(pessoaId, startupId, usuarioLogado(authentication));
        return ResponseEntity.ok(Map.of(KEY_MENSAGEM, "Startup vinculada com sucesso."));
    }

    @DeleteMapping("/{pessoaId}/startups/{startupId}")
    public ResponseEntity<Object> desvincularStartup(
            @PathVariable Long pessoaId,
            @PathVariable Long startupId,
            Authentication authentication) {
        service.desvincularStartup(pessoaId, startupId, usuarioLogado(authentication));
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PutMapping("/{pessoaId}/protecoes/{protecaoId}")
    public ResponseEntity<Object> vincularProtecao(
            @PathVariable Long pessoaId,
            @PathVariable Long protecaoId,
            Authentication authentication) {
        service.vincularProtecao(pessoaId, protecaoId, usuarioLogado(authentication));
        return ResponseEntity.ok(Map.of(KEY_MENSAGEM, "Proteção vinculada com sucesso."));
    }

    @DeleteMapping("/{pessoaId}/protecoes/{protecaoId}")
    public ResponseEntity<Object> desvincularProtecao(
            @PathVariable Long pessoaId,
            @PathVariable Long protecaoId,
            Authentication authentication) {
        service.desvincularProtecao(pessoaId, protecaoId, usuarioLogado(authentication));
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    private static Usuario usuarioLogado(Authentication authentication) {
        return authentication != null && authentication.getPrincipal() instanceof Usuario u ? u : null;
    }
}
