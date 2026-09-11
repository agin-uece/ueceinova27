package com.inova27.app.dto.usuarios;

import com.inova27.app.model.UserRole;

public record UsuarioUpdateDTO(

        String email,
        String nome,
        UserRole role,
        Boolean validado,
        String emailSecundario

) {}