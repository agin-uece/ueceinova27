package com.inova27.app.dto.protecao;

import com.inova27.app.model.NaturezaProtecao;
import com.inova27.app.model.TipoProtecao;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

public record ProtecaoCreateDTO(
        String codId,
        String nome,
        String resumo,
        String instituicao,
        NaturezaProtecao natureza,
        LocalDate dataDeposito,
        String infoExtra,
        Set<TipoProtecao> tipos,
        String area,
        String nivelMaturidade,
        String aplicacao,
        String status,
        Long jogoId,
        List<String> inventores,
        String titular,
        String diferencialTecnologico,
        String numeroProtocolo
) {}