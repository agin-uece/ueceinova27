package com.inova27.app.config;

import com.inova27.app.repository.ProtecaoRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;

import javax.sql.DataSource;
import java.nio.charset.StandardCharsets;

@Slf4j
@Configuration
public class PortfolioInitializer {

    private static final String PROTOCOLO_REFERENCIA = "BR 10 2022 018032 6";
    private static final String SCRIPT_PORTFOLIO = "insert_portfolio_tecnologias_uece_2025.sql";

    @Bean
    @Order(2)
    CommandLineRunner importarPortfolioInicial(ProtecaoRepository protecaoRepository, DataSource dataSource) {
        return args -> {
            if (!protecaoRepository.existsByCodId(PROTOCOLO_REFERENCIA)) {
                log.info("Iniciando importação automática do portfólio de tecnologias UECE 2025...");
                ResourceDatabasePopulator populator = new ResourceDatabasePopulator();
                populator.setSqlScriptEncoding(StandardCharsets.UTF_8.name());
                populator.addScript(new ClassPathResource(SCRIPT_PORTFOLIO));
                populator.execute(dataSource);
                log.info("Importação do portfólio concluída com sucesso. Total de proteções no banco: {}",
                        protecaoRepository.count());
            }
        };
    }
}
