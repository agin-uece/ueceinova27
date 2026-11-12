package com.inova27.app.controller;

import com.inova27.app.dto.solicitaravaliacao.AvaliarSolicitacaoDTO;
import com.inova27.app.model.*;
import com.inova27.app.security.MfaGuard;
import com.inova27.app.service.SolicitacaoAlteracaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin/solicitacoes")
@RequiredArgsConstructor
public class SolicitacaoAlteracaoController {

    private static final String KEY_ERRO = "erro";
    private static final String KEY_MENSAGEM = "mensagem";

    private final SolicitacaoAlteracaoService service;

    private final MfaGuard mfaGuard;

    @GetMapping
    public ResponseEntity<Object> listar(
            @RequestParam(required = false) TipoEntidade entidade,
            @RequestParam(required = false) TipoAcao acao,
            @RequestParam(required = false) StatusValidacao status,
            @PageableDefault(size = 20, sort = "dataSolicitacao") Pageable pageable,
            Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof Usuario usuario) || usuario.getRole() != UserRole.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(KEY_ERRO, "Acesso negado. Apenas administradores podem ver esta área."));
        }
        Page<SolicitacaoAlteracao> resultados = service.buscarComFiltros(entidade, acao, status, pageable);
        return ResponseEntity.ok(resultados);
    }

    @PutMapping("/{id}/avaliar")
    public ResponseEntity<Object> avaliar(
            @PathVariable Long id,
            @RequestBody AvaliarSolicitacaoDTO dto,
            Authentication authentication,
            @RequestHeader(value = "X-MFA-PIN", required = false) String pin) {
        if (authentication == null || !(authentication.getPrincipal() instanceof Usuario usuario) || usuario.getRole() != UserRole.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(KEY_ERRO, "Acesso negado. Apenas administradores podem aprovar alterações."));
        }
        mfaGuard.check((Usuario) authentication.getPrincipal(), pin);
        service.avaliarSolicitacao(id, dto.aprovado(), dto.justificativa(), usuario);
        String statusFinal = dto.aprovado() ? "aprovada e aplicada" : "rejeitada";
        return ResponseEntity.ok(Map.of(KEY_MENSAGEM, "Solicitação " + statusFinal + " com sucesso."));
    }
}