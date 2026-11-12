package com.inova27.app.controller;

import com.inova27.app.dto.startup.StartupCreateDTO;
import com.inova27.app.dto.startup.StartupFiltroDTO;
import com.inova27.app.dto.startup.StartupResponseDTO;
import com.inova27.app.dto.startup.StartupUpdateDTO;
import com.inova27.app.model.Usuario;
import com.inova27.app.security.MfaGuard;
import com.inova27.app.service.StartupService;
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
@RequestMapping("/startups")
@RequiredArgsConstructor

public class StartupController {

    private static final String KEY_ERRO = "erro";
    private static final String MSG_NAO_AUTENTICADO = "Usuário não autenticado.";

    private final StartupService service;

    private final MfaGuard mfaGuard;

    @PostMapping
    public ResponseEntity<Object> criar(
            @RequestBody @Valid StartupCreateDTO dto,
            Authentication authentication,
            @RequestHeader(value = "X-MFA-PIN", required = false) String pin) {
        if (authentication == null || !(authentication.getPrincipal() instanceof Usuario usuario)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, MSG_NAO_AUTENTICADO));
        }
        mfaGuard.check((Usuario) authentication.getPrincipal(), pin);
        StartupResponseDTO response = service.criar(dto, usuario.getId());
        return ResponseEntity
                .created(URI.create("/startups/" + response.id()))
                .body(response);
    }

    @GetMapping("/buscar")
    public ResponseEntity<Object> buscarComFiltros(
            StartupFiltroDTO filtro,
            @PageableDefault(size = 10, sort = "nome") Pageable pageable) {
        Page<StartupResponseDTO> resultados = service.buscarComFiltrosPaginado(filtro, pageable);
        return ResponseEntity.ok(resultados);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> atualizar(
            @PathVariable Long id,
            @RequestBody @Valid StartupUpdateDTO dto,
            Authentication authentication,
            @RequestHeader(value = "X-MFA-PIN", required = false) String pin) {
        if (authentication == null || !(authentication.getPrincipal() instanceof Usuario usuario)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, MSG_NAO_AUTENTICADO));
        }
        mfaGuard.check((Usuario) authentication.getPrincipal(), pin);
        StartupResponseDTO response = service.atualizar(id, dto, usuario.getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<Object> listarTodas() {
        List<StartupResponseDTO> startups = service.listarTodas();
        return ResponseEntity.ok(startups);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> buscarPorId(@PathVariable Long id) {
        StartupResponseDTO startup = service.buscarPorId(id);
        return ResponseEntity.ok(startup);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletar(
            @PathVariable Long id,
            Authentication authentication,
            @RequestHeader(value = "X-MFA-PIN", required = false) String pin) {
        if (authentication == null || !(authentication.getPrincipal() instanceof Usuario usuario)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(KEY_ERRO, MSG_NAO_AUTENTICADO));
        }
        mfaGuard.check((Usuario) authentication.getPrincipal(), pin);
        service.deletar(id, usuario.getId());
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}