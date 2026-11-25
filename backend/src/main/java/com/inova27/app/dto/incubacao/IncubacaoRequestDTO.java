package com.inova27.app.dto.incubacao;

import com.inova27.app.model.Incubacao;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record IncubacaoRequestDTO(
        @NotBlank(message = "O nome da incubação é obrigatório.")
        @Size(max = Incubacao.TAMANHO_MAXIMO_NOME, message = "O nome da incubação deve ter no máximo 20 caracteres.")
        String nome
) {
    // Normaliza antes da validação: espaços nas pontas não contam para o limite
    public IncubacaoRequestDTO {
        nome = nome == null ? null : nome.trim();
    }
}
