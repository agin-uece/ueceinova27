package com.inova27.app.dto.jogo;

import com.inova27.app.model.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

public record JogoResponseDTO(
        Long id,
        String nome,//
        String descricao,//
        GeneroJogo genero,//
        Plataforma plataforma,//
        LocalDate dataLancamento,//
        String linkDownload,//
        String site,//
        Set<String> linguagens,//
        String engine,//
        Set<String> protecoes,
        TipoJogo tipoJogo,//
        String anoDesenvolvimento,//
        EstagioDesenvolvimento estagioDesenvolvimento,//
        String urlFoto,//
        StatusValidacao status,
        String faixaEtaria,
        Long userInclusaoId,
        List<String> criadores

) {}