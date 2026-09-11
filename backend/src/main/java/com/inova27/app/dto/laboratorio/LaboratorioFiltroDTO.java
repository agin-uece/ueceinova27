package com.inova27.app.dto.laboratorio;

import com.inova27.app.model.NaturezaLaboratorio;

import java.util.Set;

public record LaboratorioFiltroDTO(
        String nome,
        String coordenacao,
        String area,
        Set<NaturezaLaboratorio> naturezas,
        String vinculado,
        String tag,
        Long pessoaId
) {}