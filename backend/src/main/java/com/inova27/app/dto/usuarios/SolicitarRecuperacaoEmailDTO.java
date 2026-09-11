package com.inova27.app.dto.usuarios;

import jakarta.validation.constraints.NotBlank;

public record SolicitarRecuperacaoEmailDTO(
        @NotBlank String emailAtual
) {}
