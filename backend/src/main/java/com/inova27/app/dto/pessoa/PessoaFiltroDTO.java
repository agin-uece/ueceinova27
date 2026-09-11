package com.inova27.app.dto.pessoa;

import com.inova27.app.model.Papel;

public record PessoaFiltroDTO(
        String nome,
        String areaPesquisa,
        String titulacao,
        String instituicao,
        Papel papel,
        String curso,
        String anoFormacao,
        Long startupId,
        Long protecaoId,
        Long laboratorioId
) {}