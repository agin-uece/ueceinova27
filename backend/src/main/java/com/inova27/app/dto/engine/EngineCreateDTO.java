package com.inova27.app.dto.engine;

import jakarta.validation.constraints.NotBlank;

public record EngineCreateDTO(
        @NotBlank(message = "O nome da engine é obrigatório") String nome
) {}