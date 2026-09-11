package com.inova27.app.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
public class JacksonConfig {

    @Bean
    @Primary
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        // Regista suporte para LocalDate, LocalDateTime, etc.
        mapper.registerModule(new JavaTimeModule());
        // Impede erro se o JSON vier vazio
        mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
        // Formata datas como String legível (ISO-8601) em vez de timestamps numéricos
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        return mapper;
    }
}