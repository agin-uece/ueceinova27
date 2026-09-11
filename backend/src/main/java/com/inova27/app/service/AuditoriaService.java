package com.inova27.app.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.inova27.app.model.AcaoAuditoria;
import com.inova27.app.model.LogAuditoria;
import com.inova27.app.repository.LogAuditoriaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class AuditoriaService {

    private final LogAuditoriaRepository repository;
    private final ObjectMapper objectMapper;

    // Injeção de dependência via construtor
    public AuditoriaService(LogAuditoriaRepository repository) {
        this.repository = repository;
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule()); // Essencial para lidar com datas (LocalDate/LocalDateTime)
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void registrarLog(String entidadeNome, Long entidadeId, AcaoAuditoria acao, Long usuarioId, Object dados) {
        try {
            if (usuarioId == null) {
                return;
            }
            LogAuditoria log = new LogAuditoria();
            log.setEntidadeNome(entidadeNome);
            log.setEntidadeId(entidadeId);
            log.setAcao(acao);
            log.setUsuarioId(usuarioId);
            log.setDataHora(LocalDateTime.now());

            // 🔥 Transforma o Objeto (DTO) em uma String JSON
            if (dados != null) {
                String jsonDetalhes = objectMapper.writeValueAsString(dados);
                log.setDetalhes(jsonDetalhes);
            } else {
                log.setDetalhes("Sem dados adicionais.");
            }

            repository.save(log);

        }catch (Exception ignored) {
            // Falha de auditoria não deve impactar o fluxo principal
        }
    }
}