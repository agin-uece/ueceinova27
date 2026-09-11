package com.inova27.app.dto.authentication;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PrimeiroAcessoDTO(
        @NotBlank String token,
        @NotBlank @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres") String novaSenha
) {}