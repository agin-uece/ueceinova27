package com.inova27.app.dto.startup;

import java.time.LocalDate;

public record StartupFiltroDTO(
        String nome,
        String area,
        LocalDate dataFundacao,
        Long incubacaoId,
        Long pessoaId
) {}