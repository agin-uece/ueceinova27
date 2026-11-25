package com.inova27.app.dto.startup;


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

        Long incubacaoId,
        String incubacao,

        Set<String> fotos,
        Set<String> pessoas,
        String cnpj,
        String instagram
) {}