package com.inova27.app.dto.startup;

import com.inova27.app.model.StatusStartup;
import com.inova27.app.utils.CnpjUtils;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.validator.constraints.br.CNPJ;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

public record StartupCreateDTO(
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
        @NotBlank(message = "O CNPJ é obrigatório.")
        @CNPJ(format = CNPJ.Format.ALPHANUMERIC, message = "CNPJ inválido.")
        String cnpj,
        String instagram,
        List<Long> pessoasIds
) {
    // Normaliza antes da validação: aceita com ou sem máscara e letras minúsculas; grava sempre "12ABC34501DE35"
    public StartupCreateDTO {
        cnpj = CnpjUtils.normalizar(cnpj);
    }
}