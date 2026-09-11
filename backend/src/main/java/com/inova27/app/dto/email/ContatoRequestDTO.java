package com.inova27.app.dto.email;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ContatoRequestDTO(
        @NotBlank(message = "O nome é obrigatório")
        String nome,

        @NotBlank(message = "O e-mail é obrigatório")
        @Email(message = "Formato de e-mail inválido")
        String email,

        @NotBlank(message = "O assunto é obrigatório")
        @Size(max = 100, message = "O assunto deve ter no máximo 100 caracteres")
        String assunto,

        @NotBlank(message = "A mensagem é obrigatória")
        @Size(max = 2000, message = "A mensagem deve ter no máximo 2000 caracteres")
        String mensagem
) {}
