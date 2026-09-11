package com.inova27.app.dto.startup;

import com.inova27.app.model.StatusStartup;

import java.time.LocalDate;
import java.util.Set;

public record StartupResponseDTO(
        Long id,
        String nome,
        String descricao,
        String area,
        LocalDate dataFundacao,
        String site,
        String email,
        String telefone,
        String logo,

        StatusStartup status,

        Set<String> fotos,
        Set<String> pessoas,
        String cnpj,
        String instagram
) {}