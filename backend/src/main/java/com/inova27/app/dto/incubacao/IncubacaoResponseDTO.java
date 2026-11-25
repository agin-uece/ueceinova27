package com.inova27.app.dto.incubacao;

import com.inova27.app.model.Incubacao;

public record IncubacaoResponseDTO(Long id, String nome) {

    public static IncubacaoResponseDTO de(Incubacao incubacao) {
        return new IncubacaoResponseDTO(incubacao.getId(), incubacao.getNome());
    }
}
