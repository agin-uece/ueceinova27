package com.inova27.app.dto.servico;

import java.util.Set;

public record ServicoResponseDTO(
        Long id,
        Set<String> prestadoresNomes,
        String areaAtuacao,
        String descricao,
        String contato,
        String email,
        String telefone
) {}