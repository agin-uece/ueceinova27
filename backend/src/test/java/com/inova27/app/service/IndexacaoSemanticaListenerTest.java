package com.inova27.app.service;

import com.inova27.app.config.AsyncConfig;
import com.inova27.app.dto.buscasemantica.DocumentoSemantico;
import com.inova27.app.dto.buscasemantica.IndexacaoSemanticaEvent;
import com.inova27.app.exception.OllamaIntegrationException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.support.AbstractPlatformTransactionManager;
import org.springframework.transaction.support.DefaultTransactionStatus;
import org.springframework.transaction.support.TransactionTemplate;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.mockito.Mockito.*;

@DisplayName("IndexacaoSemanticaListener - execução assíncrona pós-commit")
class IndexacaoSemanticaListenerTest {

    private final DocumentoSemantico doc = new DocumentoSemantico("jogos", 10L, "Xadrez", "desc", "texto");

    @Nested
    @DisplayName("Testes unitários do listener")
    class Unitarios {

        @Test
        @DisplayName("Deve chamar indexador.indexar ao receber evento válido")
        void deveChamarIndexar() {
            IndexadorSemanticoService indexador = mock(IndexadorSemanticoService.class);
            IndexacaoSemanticaListener listener = new IndexacaoSemanticaListener(indexador);

            listener.aoIndexarDocumento(new IndexacaoSemanticaEvent(doc));

            verify(indexador).indexar(doc);
        }

        @Test
        @DisplayName("Quando o Ollama falhar em segundo plano, marca como não indexado sem propagar exceção")
        void naoPropagaExcecaoQuandoOllamaFalhar() {
            IndexadorSemanticoService indexador = mock(IndexadorSemanticoService.class);
            doThrow(new OllamaIntegrationException("Ollama indisponível")).when(indexador).indexar(doc);
            IndexacaoSemanticaListener listener = new IndexacaoSemanticaListener(indexador);

            assertThatCode(() -> listener.aoIndexarDocumento(new IndexacaoSemanticaEvent(doc)))
                    .doesNotThrowAnyException();

            verify(indexador).indexar(doc);
            verify(indexador).marcarNaoIndexado(doc);
        }

        @Test
        @DisplayName("Não propaga exceção mesmo se marcarNaoIndexado também falhar")
        void naoPropagaExcecaoSeMarcarNaoIndexadoFalhar() {
            IndexadorSemanticoService indexador = mock(IndexadorSemanticoService.class);
            doThrow(new OllamaIntegrationException("Ollama indisponível")).when(indexador).indexar(doc);
            doThrow(new RuntimeException("DB indisponível")).when(indexador).marcarNaoIndexado(doc);
            IndexacaoSemanticaListener listener = new IndexacaoSemanticaListener(indexador);

            assertThatCode(() -> listener.aoIndexarDocumento(new IndexacaoSemanticaEvent(doc)))
                    .doesNotThrowAnyException();

            verify(indexador).marcarNaoIndexado(doc);
        }

        @Test
        @DisplayName("Deve ignorar evento com documento nulo")
        void ignoraDocumentoNulo() {
            IndexadorSemanticoService indexador = mock(IndexadorSemanticoService.class);
            IndexacaoSemanticaListener listener = new IndexacaoSemanticaListener(indexador);

            listener.aoIndexarDocumento(new IndexacaoSemanticaEvent(null));

            verifyNoInteractions(indexador);
        }
    }

    @Nested
    @DisplayName("Integração Spring (@TransactionalEventListener AFTER_COMMIT + @Async)")
    class IntegracaoSpring {

        @Configuration
        @EnableTransactionManagement
        static class TestConfig {

            @Bean
            PlatformTransactionManager transactionManager() {
                return new AbstractPlatformTransactionManager() {
                    @Override
                    protected Object doGetTransaction() {
                        return new Object();
                    }

                    @Override
                    protected void doBegin(Object transaction, TransactionDefinition definition) {
                        // no-op in-memory transaction
                    }

                    @Override
                    protected void doCommit(DefaultTransactionStatus status) {
                        // no-op in-memory commit
                    }

                    @Override
                    protected void doRollback(DefaultTransactionStatus status) {
                        // no-op in-memory rollback
                    }
                };
            }

            @Bean
            IndexadorSemanticoService indexadorSemanticoService() {
                return mock(IndexadorSemanticoService.class);
            }

            @Bean
            IndexacaoSemanticaListener indexacaoSemanticaListener(IndexadorSemanticoService indexador) {
                return new IndexacaoSemanticaListener(indexador);
            }
        }

        @Test
        @DisplayName("Executa indexação apenas após commit e em thread assíncrona dedicada")
        void executaAposCommitEmThreadAssincrona() throws Exception {
            try (var ctx = new AnnotationConfigApplicationContext(AsyncConfig.class, TestConfig.class)) {
                IndexadorSemanticoService indexador = ctx.getBean(IndexadorSemanticoService.class);
                TransactionTemplate tx = new TransactionTemplate(ctx.getBean(PlatformTransactionManager.class));

                CountDownLatch latch = new CountDownLatch(1);
                AtomicReference<String> threadName = new AtomicReference<>();
                doAnswer(inv -> {
                    threadName.set(Thread.currentThread().getName());
                    latch.countDown();
                    return null;
                }).when(indexador).indexar(doc);

                tx.executeWithoutResult(status -> {
                    ctx.publishEvent(new IndexacaoSemanticaEvent(doc));
                    // Antes do commit, o Ollama ainda não deve ter sido acionado
                    verifyNoInteractions(indexador);
                });

                assertThat(latch.await(5, TimeUnit.SECONDS)).isTrue();
                assertThat(threadName.get()).startsWith("indexacao-semantica-");
                verify(indexador, times(1)).indexar(doc);
            }
        }

        @Test
        @DisplayName("Não aciona o Ollama se a transação sofrer rollback")
        void naoExecutaQuandoHaRollback() throws Exception {
            try (var ctx = new AnnotationConfigApplicationContext(AsyncConfig.class, TestConfig.class)) {
                IndexadorSemanticoService indexador = ctx.getBean(IndexadorSemanticoService.class);
                TransactionTemplate tx = new TransactionTemplate(ctx.getBean(PlatformTransactionManager.class));

                tx.executeWithoutResult(status -> {
                    ctx.publishEvent(new IndexacaoSemanticaEvent(doc));
                    status.setRollbackOnly();
                });

                // Pequena espera para garantir que nenhum worker assíncrono foi disparado
                Thread.sleep(200);
                verifyNoInteractions(indexador);
            }
        }
    }
}
