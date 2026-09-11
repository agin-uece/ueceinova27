package com.inova27.app.dto.servico;

import java.util.Set;

public record ServicoUpdateDTO(
        Set<Long> prestadoresIds,
        String areaAtuacao,
        String descricao,
        String contato,
        String email,
        String telefone
) {}