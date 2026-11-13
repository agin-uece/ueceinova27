package com.inova27.app.config;

import com.inova27.app.dto.buscasemantica.DocumentoSemantico;
import com.inova27.app.exception.OllamaIntegrationException;
import com.inova27.app.mapper.DocumentoSemanticoMapper;
import com.inova27.app.repository.ProtecaoRepository;
import com.inova27.app.service.IndexadorSemanticoService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.DatabasePopulatorUtils;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

import javax.sql.DataSource;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Slf4j
@Configuration
public class PortfolioInitializer {

    private static final String PROTOCOLO_REFERENCIA = "BR 10 2022 018032 6";
    private static final String SCRIPT_PORTFOLIO = "insert_portfolio_tecnologias_uece_2025.sql";

    @Bean
    @Order(2)
    CommandLineRunner importarPortfolioInicial(ProtecaoRepository protecaoRepository,
                                               DataSource dataSource,
                                               PlatformTransactionManager transactionManager,
                                               DocumentoSemanticoMapper mapper,
                                               IndexadorSemanticoService indexador) {
        return args -> {
            TransactionTemplate transacao = new TransactionTemplate(transactionManager);
            importarSeNecessario(protecaoRepository, dataSource, transacao);
            indexarProtecoesSemIndice(protecaoRepository, transacao, mapper, indexador);
        };
    }

    // Tudo ou nada: se algum INSERT falhar, nada é gravado e a importação é tentada de novo no próximo start.
    // Uma falha aqui é registrada no log, mas não impede a aplicação de subir.
    private void importarSeNecessario(ProtecaoRepository protecaoRepository, DataSource dataSource, TransactionTemplate transacao) {
        if (protecaoRepository.existsByCodId(PROTOCOLO_REFERENCIA)) {
            return;
        }
        log.info("Iniciando importação automática do portfólio de tecnologias UECE 2025...");
        ResourceDatabasePopulator populator = new ResourceDatabasePopulator();
        populator.setSqlScriptEncoding(StandardCharsets.UTF_8.name());
        populator.addScript(new ClassPathResource(SCRIPT_PORTFOLIO));
        try {
            transacao.executeWithoutResult(status -> DatabasePopulatorUtils.execute(populator, dataSource));
            log.info("Importação do portfólio concluída com sucesso. Total de proteções no banco: {}",
                    protecaoRepository.count());
        } catch (RuntimeException e) {
            log.error("Importação do portfólio falhou e foi desfeita por completo; será tentada no próximo start.", e);
        }
    }

    // Proteções inseridas direto por SQL (como o portfólio) não passam pelo ProtecaoService e ficariam fora da busca.
    // ponytail: síncrono e uma chamada ao Ollama por proteção (~1-2 min para o portfólio, só no primeiro start).
    private void indexarProtecoesSemIndice(ProtecaoRepository protecaoRepository, TransactionTemplate transacao,
                                           DocumentoSemanticoMapper mapper, IndexadorSemanticoService indexador) {
        List<Long> ids = protecaoRepository.findIdsSemIndiceSemantico();
        if (ids.isEmpty()) {
            return;
        }
        log.info("Indexando {} proteções na busca semântica...", ids.size());
        int indexadas = 0;
        for (Long id : ids) {
            try {
                // Leitura em transação: o mapper acessa coleções lazy (tipos da proteção)
                DocumentoSemantico doc = transacao.execute(status ->
                        protecaoRepository.findById(id).map(mapper::fromProtecao).orElse(null));
                if (doc != null) {
                    indexador.indexar(doc);
                    indexadas++;
                }
            } catch (OllamaIntegrationException e) {
                log.warn("Ollama indisponível; {} de {} proteções indexadas. O restante será indexado no próximo start.",
                        indexadas, ids.size());
                return;
            } catch (RuntimeException e) {
                log.warn("Falha ao indexar a proteção {}: {}", id, e.getMessage());
            }
        }
        log.info("Indexação concluída: {} de {} proteções.", indexadas, ids.size());
    }
}
