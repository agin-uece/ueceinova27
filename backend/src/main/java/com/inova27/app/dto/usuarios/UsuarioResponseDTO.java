package com.inova27.app.dto.usuarios;

import com.inova27.app.model.UserRole;
import com.inova27.app.model.Usuario; // Adicione este import

public record UsuarioResponseDTO(
        Long id,
        String email,
        String nome,
        UserRole role,
        boolean validado,
        String emailSecundario
) {
    // 💡 Construtor "mágico" que sabe transformar uma Entidade em um DTO
    public UsuarioResponseDTO(Usuario usuario) {
        this(
                usuario.getId(),
                usuario.getEmail(),
                usuario.getNome(),
                usuario.getRole(),
                usuario.isValidado(),
                usuario.getEmailSecundario()
        );
    }
}