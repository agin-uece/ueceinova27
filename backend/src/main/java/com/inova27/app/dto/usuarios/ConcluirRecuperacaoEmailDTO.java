package com.inova27.app.dto.usuarios;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ConcluirRecuperacaoEmailDTO(
        @NotBlank String emailAtual,
        @NotBlank String codigo,
        @NotBlank @Email String novoEmailPrincipal,
        @Email String novoEmailSecundario // os e-mails devem ser os mesmos enviados no passo "confirmar"
) {}
