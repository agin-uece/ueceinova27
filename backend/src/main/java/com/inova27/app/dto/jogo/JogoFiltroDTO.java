package com.inova27.app.dto.jogo;

import com.inova27.app.model.EstagioDesenvolvimento;
import com.inova27.app.model.GeneroJogo;
import com.inova27.app.model.Plataforma;
import com.inova27.app.model.TipoJogo;
import java.time.LocalDate;

public record JogoFiltroDTO(
        String nome,
        GeneroJogo genero,
        Plataforma plataforma,
        LocalDate dataLancamento,
        TipoJogo tipoJogo,
        EstagioDesenvolvimento estagioDesenvolvimento,
        Long engineId,
        Long linguagemId,
        Long protecaoId,
        String faixaEtaria

) {}