package com.inova27.app.dto.email;

import jakarta.validation.constraints.NotBlank;

public record ResetPasswordDTO(
        @NotBlank String token,
        @NotBlank String novaSenha
) {}