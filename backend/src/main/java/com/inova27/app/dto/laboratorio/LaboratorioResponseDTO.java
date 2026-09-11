package com.inova27.app.dto.laboratorio;

import com.inova27.app.model.NaturezaLaboratorio;

import java.time.LocalDateTime;
import java.util.Set;

public record LaboratorioResponseDTO(
        Long id,
        String nome,//
        String descricao,//
        String coordenacao,//
        String area,//
        String email,//
        String site,//
        String telefone,//
        Set<NaturezaLaboratorio> naturezas,
        String vinculado,//
        LocalDateTime horarioAbertura,//
        LocalDateTime horarioFechamento,//
        String urlFoto,//
        String localizacao,//
        String parcerias,
        String infraestrutura,

        Set<String> tags,
        Set<String> pessoas,
        Long userInclusaoId,
        String instagram,
        String resolucao,
        Integer qtdPessoas,
        Integer qtdMestrando,
        Integer qtdDoutorandos,
        Integer qtdPosDoc
) {}