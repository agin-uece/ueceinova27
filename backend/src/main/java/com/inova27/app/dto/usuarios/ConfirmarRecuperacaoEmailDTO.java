package com.inova27.app.dto.usuarios;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ConfirmarRecuperacaoEmailDTO(
        @NotBlank String emailAtual,
        @NotBlank String pin,
        @NotBlank @Email String novoEmailPrincipal,
        @Email String novoEmailSecundario // Pode ser vazio se ele não quiser cadastrar um novo agora
) {}