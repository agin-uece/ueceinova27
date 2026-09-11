package com.inova27.app.mapper;

import com.inova27.app.dto.buscasemantica.DocumentoSemantico;
import com.inova27.app.model.*;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.stream.Collectors;

@Component
public class DocumentoSemanticoMapper {

    // 🛡️ PROTEÇÃO
    public DocumentoSemantico fromProtecao(Protecao p) {

        String inventores = (p.getInventores() == null || p.getInventores().isEmpty()) ? "" :
                String.join(", ", p.getInventores());

        String tipos = (p.getTipos() == null || p.getTipos().isEmpty()) ? "" :
                p.getTipos().stream().map(Enum::name).collect(Collectors.joining(", "));

        String descricao = "Proteção do tipo " + safe(String.valueOf(p.getNatureza())) +
                ", titular " + safe(p.getTitular()) +
                ", área " + safe(p.getArea()) +
                ", instituição " + safe(p.getInstituicao());

        String texto = """
                Nome: %s
                Natureza: %s
                Titular: %s
                Instituicao: %s
                Area: %s
                Aplicacao: %s
                Nivel de Maturidade: %s
                Tipos: %s
                Inventores: %s
                Diferencial Tecnologico: %s
                Resumo: %s
                """.formatted(
                safe(p.getNome()),
                safe(String.valueOf(p.getNatureza())),
                safe(p.getTitular()),
                safe(p.getInstituicao()),
                safe(p.getArea()),
                safe(p.getAplicacao()),
                safe(p.getNivelMaturidade()),
                tipos,
                inventores,
                safe(p.getDiferencialTecnologico()),
                safe(p.getResumo())
        );

        return new DocumentoSemantico(
                "protecoes",
                p.getId(),
                p.getNome(),
                descricao,
                descricao + "\n" + texto
        );
    }

    // 🎮 JOGO
    public DocumentoSemantico fromJogo(Jogo j) {

        String engineNome = j.getEngine() != null ? j.getEngine().getNome() : "Não especificada";
        String linguagens = extrairNomesLinguagens(j.getLinguagens());

        String criadores = (j.getCriadores() == null || j.getCriadores().isEmpty()) ? "" :
                String.join(", ", j.getCriadores());

        String descricao = "Jogo do gênero " + safe(String.valueOf(j.getGenero())) +
                ", plataforma " + safe(String.valueOf(j.getPlataforma())) +
                ", tipo " + safe(String.valueOf(j.getTipoJogo())) +
                ", faixa etária " + safe(j.getFaixaEtaria());

        String texto = """
                Nome: %s
                Genero: %s
                Plataforma: %s
                Tipo de Jogo: %s
                Estagio de Desenvolvimento: %s
                Ano: %s
                Faixa Etaria: %s
                Engine: %s
                Linguagens: %s
                Criadores: %s
                Descricao: %s
                """.formatted(
                safe(j.getNome()),
                safe(String.valueOf(j.getGenero())),
                safe(String.valueOf(j.getPlataforma())),
                safe(String.valueOf(j.getTipoJogo())),
                safe(String.valueOf(j.getEstagioDesenvolvimento())),
                safe(j.getAnoDesenvolvimento()),
                safe(j.getFaixaEtaria()),
                engineNome,
                linguagens,
                criadores,
                safe(j.getDescricao())
        );
        String textoCompleto = descricao + "\n" + texto;

        return new DocumentoSemantico(
                "jogos",
                j.getId(),
                j.getNome(),
                descricao,
                textoCompleto
        );
    }

    // 👤 PESSOA
    public DocumentoSemantico fromPessoa(Pessoa p) {

        String nomeLab = p.getLaboratorio() != null ? p.getLaboratorio().getNome() : "Sem laboratório vinculado";

        String nomesStartups = (p.getStartups() == null || p.getStartups().isEmpty()) ? "" :
                p.getStartups().stream().map(Startup::getNome).collect(Collectors.joining(", "));

        String nomesProtecoes = (p.getProtecoes() == null || p.getProtecoes().isEmpty()) ? "" :
                p.getProtecoes().stream().map(Protecao::getNome).collect(Collectors.joining(", "));

        String descricao = "Pessoa com papel de " + safe(String.valueOf(p.getPapel())) +
                ", atua na área de " + safe(p.getAreaPesquisa()) +
                ", curso " + safe(p.getCurso()) +
                ", vinculada à instituição " + safe(p.getInstituicao());

        String texto = """
                Nome: %s
                Papel: %s
                Area de pesquisa: %s
                Instituicao: %s
                Titulacao: %s
                Curso: %s
                Ano de Formacao: %s
                Laboratorio: %s
                Startups: %s
                Protecoes: %s
                Descricao/Perfil: %s
                """.formatted(
                safe(p.getNome()),
                safe(String.valueOf(p.getPapel())),
                safe(p.getAreaPesquisa()),
                safe(p.getInstituicao()),
                safe(p.getTitulacao()),
                safe(p.getCurso()),
                safe(p.getAnoFormacao()),
                nomeLab,
                nomesStartups,
                nomesProtecoes,
                safe(p.getDescricao())
        );
        String textoCompleto = descricao + "\n" + texto;

        return new DocumentoSemantico(
                "pessoas",
                p.getId(),
                p.getNome(),
                descricao,
                textoCompleto
        );
    }

    // 🧪 LABORATÓRIO
    public DocumentoSemantico fromLaboratorio(Laboratorio l) {

        String tags = extrairTags(l.getTags());
        String naturezas = extrairNaturezas(l.getNaturezas());

        String descricao = "Laboratório da área " + safe(l.getArea()) +
                ", natureza " + naturezas +
                ", coordenado por " + safe(l.getCoordenacao()) +
                ", localizado em " + safe(l.getLocalizacao());

        String texto = """
                Nome: %s
                Area: %s
                Natureza: %s
                Vinculado a: %s
                Coordenacao: %s
                Localizacao: %s
                Parcerias: %s
                Resolucao: %s
                Tags/Palavras-chave: %s
                Infraestrutura: %s
                Descricao: %s
                """.formatted(
                safe(l.getNome()),
                safe(l.getArea()),
                naturezas,
                safe(l.getVinculado()),
                safe(l.getCoordenacao()),
                safe(l.getLocalizacao()),
                safe(l.getParcerias()),
                safe(l.getResolucao()),
                tags,
                safe(l.getInfraestrutura()),
                safe(l.getDescricao())
        );
        String textoCompleto = descricao + "\n" + texto;

        return new DocumentoSemantico(
                "laboratorios",
                l.getId(),
                l.getNome(),
                descricao,
                textoCompleto
        );
    }

    // 🚀 STARTUP
    public DocumentoSemantico fromStartup(Startup s) {

        String nomesPessoas = (s.getPessoas() == null || s.getPessoas().isEmpty()) ? "" :
                s.getPessoas().stream().map(Pessoa::getNome).collect(Collectors.joining(", "));

        String descricao = "Startup da área " + safe(s.getArea()) +
                ", fundada em " + safe(String.valueOf(s.getDataFundacao())) +
                ", status: " + safe(String.valueOf(s.getStatus()));

        String texto = """
                Nome: %s
                Area: %s
                Status: %s
                Data de fundacao: %s
                Membros: %s
                Descricao: %s
                """.formatted(
                safe(s.getNome()),
                safe(s.getArea()),
                safe(String.valueOf(s.getStatus())),
                safe(String.valueOf(s.getDataFundacao())),
                nomesPessoas,
                safe(s.getDescricao())
        );
        String textoCompleto = descricao + "\n" + texto;

        return new DocumentoSemantico(
                "startups",
                s.getId(),
                s.getNome(),
                descricao,
                textoCompleto
        );
    }

    // 💼 SERVIÇO
    public DocumentoSemantico fromServico(Servico s) {

        String prestadorNome = (s.getPrestadores() != null && !s.getPrestadores().isEmpty())
                ? s.getPrestadores().stream().map(Pessoa::getNome).collect(Collectors.joining(", "))
                : "Não especificado";

        String descricao = "Serviço na área de " + safe(s.getAreaAtuacao()) +
                ", prestado por " + prestadorNome;

        String texto = """
                Prestador: %s
                Area de Atuacao: %s
                Descricao: %s
                Contato: %s
                Email: %s
                Telefone: %s
                """.formatted(
                prestadorNome,
                safe(s.getAreaAtuacao()),
                safe(s.getDescricao()),
                safe(s.getContato()),
                safe(s.getEmail()),
                safe(s.getTelefone())
        );
        String textoCompleto = descricao + "\n" + texto;

        return new DocumentoSemantico(
                "servicos",
                s.getId(),
                "Serviço: " + safe(s.getAreaAtuacao()),
                descricao,
                textoCompleto
        );
    }

    // ==========================================================
    // 🛠️ MÉTODOS UTILITÁRIOS
    // ==========================================================

    private String safe(String s) {
        return (s == null || s.trim().isEmpty() || s.equals("null")) ? "" : s.trim();
    }

    private String extrairNomesLinguagens(Collection<Linguagem> linguagens) {
        if (linguagens == null || linguagens.isEmpty()) return "";
        return linguagens.stream()
                .map(Linguagem::getNome)
                .collect(Collectors.joining(", "));
    }

    private String extrairTags(Collection<String> tags) {
        if (tags == null || tags.isEmpty()) return "";
        return String.join(", ", tags);
    }

    private String extrairNaturezas(Collection<NaturezaLaboratorio> naturezas) {
        if (naturezas == null || naturezas.isEmpty()) return "";
        return naturezas.stream()
                .map(Enum::name)
                .collect(Collectors.joining(", "));
    }
}