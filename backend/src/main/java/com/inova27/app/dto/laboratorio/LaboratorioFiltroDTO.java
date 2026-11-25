package com.inova27.app.dto.laboratorio;

import com.inova27.app.model.NaturezaLaboratorio;

import java.util.Set;

public record LaboratorioFiltroDTO(
        String nome,
        String coordenacao,
        String area,
        Set<NaturezaLaboratorio> naturezas,
        String curso,
        String centro,
        String tag,
        Long pessoaId
) {}