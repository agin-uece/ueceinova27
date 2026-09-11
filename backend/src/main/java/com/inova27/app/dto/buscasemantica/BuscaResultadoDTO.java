package com.inova27.app.dto.buscasemantica;

public record BuscaResultadoDTO(
        String entidade,
        Long idOrigem,
        String titulo,
        String descricao,
        Double similaridade
) {}