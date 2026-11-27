package com.inova27.app.dto.authentication;

import com.inova27.app.model.UserRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RegisterDTO(

        @NotBlank(message = "O email não pode estar vazio")
        String email,

        String senha,

        @NotBlank(message = "O nome não pode estar vazio")
        String nome,

        @NotNull(message = "A permissão (role) é obrigatória")
        UserRole role,

        @NotBlank(message = "O email secundário não pode estar vazio")
        String emailSecundario,

        String codigoConfirmacao

) {
    public RegisterDTO(String email, String senha, String nome, UserRole role, String emailSecundario) {
        this(email, senha, nome, role, emailSecundario, null);
    }
}