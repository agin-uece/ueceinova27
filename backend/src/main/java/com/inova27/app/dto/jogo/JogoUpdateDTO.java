package com.inova27.app.dto.jogo;

import com.inova27.app.model.GeneroJogo;
import com.inova27.app.model.Plataforma;
import com.inova27.app.model.TipoJogo;
import com.inova27.app.model.EstagioDesenvolvimento;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

public record JogoUpdateDTO(
        String nome,
        String descricao,
        GeneroJogo genero,
        Plataforma plataforma,
        LocalDate dataLancamento,
        String linkDownload,
        String site,
        Long engineId,
        Set<Long> linguagensIds,
        TipoJogo tipoJogo,
        String anoDesenvolvimento,
        EstagioDesenvolvimento estagioDesenvolvimento,
        String urlFoto,
        String faixaEtaria,
        List<String> criadores
) {}