package com.inova27.app.dto.startup;

import com.inova27.app.model.StatusStartup;
import java.time.LocalDate;

public record StartupFiltroDTO(
        String nome,
        String area,
        LocalDate dataFundacao,
        StatusStartup status,
        Long pessoaId
) {}