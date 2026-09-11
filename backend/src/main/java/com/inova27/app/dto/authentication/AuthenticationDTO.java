package com.inova27.app.dto.authentication;

import jakarta.validation.constraints.NotBlank;

public record AuthenticationDTO(
        @NotBlank(message = "O email não pode estar vazio") String email,
        @NotBlank(message = "A senha não pode estar vazia") String senha
) {}
