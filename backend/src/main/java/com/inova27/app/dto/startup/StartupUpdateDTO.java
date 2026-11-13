package com.inova27.app.dto.startup;

import com.inova27.app.model.StatusStartup;
import com.inova27.app.utils.CnpjUtils;
import org.hibernate.validator.constraints.br.CNPJ;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

public record StartupUpdateDTO(
        String nome,
        String descricao,
        String area,
        LocalDate dataFundacao,
        String site,
        String email,
        String telefone,
        String logo,

        StatusStartup status,

        Set<String> fotos,
        @CNPJ(format = CNPJ.Format.ALPHANUMERIC, message = "CNPJ inválido.")
        String cnpj,
        String instagram,
        List<Long> pessoasIds
) {
    // Normaliza antes da validação: aceita com ou sem máscara e letras minúsculas; grava sempre "12ABC34501DE35"
    public StartupUpdateDTO {
        cnpj = CnpjUtils.normalizar(cnpj);
    }
}