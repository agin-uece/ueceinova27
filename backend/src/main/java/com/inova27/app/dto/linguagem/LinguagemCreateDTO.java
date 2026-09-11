package com.inova27.app.dto.linguagem;

import jakarta.validation.constraints.NotBlank;

public record LinguagemCreateDTO(
        @NotBlank(message = "O nome da linguagem é obrigatório") String nome
) {}