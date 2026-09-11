package com.inova27.app.dto.pessoa;

import com.inova27.app.model.Papel;

import java.util.Set;

public record PessoaResponseDTO(
        Long id,
        String nome,
        String email,
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

        String laboratorio,
        Set<String> protecoes,
        Set<String> startups,
        String matricula,
        Set<String> servicos,
        Long userInclusaoId
) {}