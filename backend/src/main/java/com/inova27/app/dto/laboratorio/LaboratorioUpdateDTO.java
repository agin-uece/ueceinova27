package com.inova27.app.dto.laboratorio;

import com.inova27.app.model.NaturezaLaboratorio;

import java.time.LocalTime;
import java.util.Set;

public record LaboratorioUpdateDTO(
        String nome,
        String descricao,
        String coordenacao,
        String area,
        String email,
        String site,
        String telefone,
        Set<NaturezaLaboratorio> naturezas,
        String vinculado,
        LocalTime horarioAbertura,
        LocalTime horarioFechamento,
        String urlFoto,
        String localizacao,
        String parcerias,
        String infraestrutura,

        Set<String> tags,
        String instagram,
        String resolucao,
        Integer qtdPessoas,
        Integer qtdMestrando,
        Integer qtdDoutorandos,
        Integer qtdPosDoc
) {}