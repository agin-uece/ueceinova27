package com.inova27.app.specification;

import com.inova27.app.dto.jogo.JogoFiltroDTO;
import com.inova27.app.dto.laboratorio.LaboratorioFiltroDTO;
import com.inova27.app.dto.pessoa.PessoaFiltroDTO;
import com.inova27.app.dto.servico.ServicoFiltroDTO;
import com.inova27.app.dto.startup.StartupFiltroDTO;
import com.inova27.app.specification.jogo.JogoSpecification;
import com.inova27.app.specification.laboratorio.LaboratorioSpecification;
import com.inova27.app.specification.pessoa.PessoaSpecification;
import com.inova27.app.specification.servico.ServicoSpecification;
import com.inova27.app.specification.startup.StartupSpecification;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Root;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.data.jpa.domain.Specification;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Todos os filtros de texto das páginas de pesquisa devem achar trechos ignorando maiúsculas e acentos
 * (LIKE '%termo%' sobre unaccent(lower(campo))), e nenhum pode cair no LIKE sensível a acento.
 */
@SuppressWarnings({"unchecked", "rawtypes"})
class FiltroTextoSpecificationTest {

    private CriteriaBuilder cb;
    private Root root;
    private CriteriaQuery query;

    @BeforeEach
    void setUp() {
        cb = mock(CriteriaBuilder.class, RETURNS_MOCKS);
        root = mock(Root.class, RETURNS_MOCKS);
        query = mock(CriteriaQuery.class, RETURNS_MOCKS);
    }

    @Test
    @DisplayName("Pessoa: nome, área de pesquisa, titulação, instituição e curso")
    void pessoa() {
        var filtro = new PessoaFiltroDTO("João", "Biotecnológica", "DOUTOR", "Ceará", null, "Computação",
                null, null, null, null);
        assertPadroes(PessoaSpecification.comFiltros(filtro),
                "%joao%", "%biotecnologica%", "%doutor%", "%ceara%", "%computacao%");
    }

    @Test
    @DisplayName("Laboratório: nome, coordenação, área, vínculo e tag")
    void laboratorio() {
        var filtro = new LaboratorioFiltroDTO("Gráf", "Antônio", "Visão", null, "Física", "Óptica", null);
        assertPadroes(LaboratorioSpecification.comFiltros(filtro),
                "%graf%", "%antonio%", "%visao%", "%fisica%", "%optica%");
    }

    @Test
    @DisplayName("Jogo: nome, engine e linguagem")
    void jogo() {
        var filtro = new JogoFiltroDTO("Matemát", null, null, null, null, null, "Unity", "Português", null, null);
        assertPadroes(JogoSpecification.comFiltros(filtro), "%matemat%", "%unity%", "%portugues%");
    }

    @Test
    @DisplayName("Startup: nome e área")
    void startup() {
        var filtro = new StartupFiltroDTO("Agro", "Precisão", null, null, null);
        assertPadroes(StartupSpecification.comFiltros(filtro), "%agro%", "%precisao%");
    }

    @Test
    @DisplayName("Serviço: área de atuação")
    void servico() {
        var filtro = new ServicoFiltroDTO(null, "Consultoría");
        assertPadroes(ServicoSpecification.comFiltros(filtro), "%consultoria%");
    }

    private void assertPadroes(Specification spec, String... esperados) {
        spec.toPredicate(root, query, cb);

        ArgumentCaptor<String> padroes = ArgumentCaptor.forClass(String.class);
        verify(cb, times(esperados.length)).like(any(Expression.class), padroes.capture(), eq('\\'));
        assertThat(padroes.getAllValues()).containsExactly(esperados);
        verify(cb, times(esperados.length)).function(eq("unaccent"), eq(String.class), any(Expression.class));
        verify(cb, never()).like(any(Expression.class), anyString());
    }
}
