package com.inova27.app.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DatabaseSchemaFixRunner implements ApplicationRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(ApplicationArguments args) {
        try {
            jdbcTemplate.execute("""
                ALTER TABLE IF EXISTS laboratorios
                    ALTER COLUMN horario_abertura TYPE TIME USING horario_abertura::TIME,
                    ALTER COLUMN horario_fechamento TYPE TIME USING horario_fechamento::TIME;
            """);
            log.info("Verificação/ajuste de colunas de horário em 'laboratorios' concluída.");
        } catch (Exception e) {
            log.warn("Aviso ao verificar colunas de 'laboratorios': {}", e.getMessage());
        }
    }
}