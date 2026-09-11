package com.inova27.app.dto.pessoa;

import com.inova27.app.model.Papel;

import java.util.List;

public record PessoaUpdateDTO(
        String nome,
        String telefone,
        String areaPesquisa,
        String titulacao,
        String instituicao,
        Papel papel,

        String site,
        String lattesURL,
        String linkD,
        String curso,
        String descricao,
        String anoFormacao,
        String urlFoto,
        String matricula,
        List<Long> startupIds,
        List<Long> protecaoIds,
        Long laboratorioId
) {}