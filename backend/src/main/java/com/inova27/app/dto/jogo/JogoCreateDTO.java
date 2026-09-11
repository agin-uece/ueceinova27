package com.inova27.app.dto.jogo;

import com.inova27.app.model.GeneroJogo;
import com.inova27.app.model.Plataforma;
import com.inova27.app.model.TipoJogo;
import com.inova27.app.model.EstagioDesenvolvimento;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

public record JogoCreateDTO(
        @NotBlank @Size(max = 150) String nome,
        @Size(max = 1000) String descricao,
        GeneroJogo genero,
        Plataforma plataforma,
        LocalDate dataLancamento,
        @Size(max = 300) String linkDownload,
        @Size(max = 200) String site,
        Long engineId,
        Set<Long> linguagensIds,
        TipoJogo tipoJogo,
        String anoDesenvolvimento,
        EstagioDesenvolvimento estagioDesenvolvimento,
        String urlFoto,
        String faixaEtaria,
        List<String> criadores
) {}