package com.inova27.app.dto.buscasemantica;

public record DocumentoSemantico(
        String entidade,
        Long idOrigem,
        String titulo,
        String descricao,
        String textoCompleto
) {}
