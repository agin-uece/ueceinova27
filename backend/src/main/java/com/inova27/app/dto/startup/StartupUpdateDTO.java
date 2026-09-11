package com.inova27.app.dto.startup;

import com.inova27.app.model.StatusStartup;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

public record StartupUpdateDTO(
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
        String cnpj,
        String instagram,
        List<Long> pessoasIds
) {}