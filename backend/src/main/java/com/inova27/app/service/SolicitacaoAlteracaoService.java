package com.inova27.app.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.inova27.app.dto.jogo.JogoUpdateDTO;
import com.inova27.app.dto.pessoa.PessoaUpdateDTO;
import com.inova27.app.dto.servico.ServicoUpdateDTO;
import com.inova27.app.dto.laboratorio.LaboratorioUpdateDTO;
import com.inova27.app.dto.startup.StartupUpdateDTO;
import com.inova27.app.dto.protecao.ProtecaoUpdateDTO;
import com.inova27.app.exception.BusinessException;
import com.inova27.app.model.*;
import com.inova27.app.repository.SolicitacaoAlteracaoRepository;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Slf4j
public class SolicitacaoAlteracaoService {

    private final SolicitacaoAlteracaoRepository repository;
    private final ObjectMapper objectMapper;
    private final JogoService jogoService;
    private final EmailService emailService;
    private final LaboratorioService laboratorioService;
    private final StartupService startupService;
    private final PessoaService pessoaService;
    private final ServicoService servicoService;
    private final ProtecaoService protecaoService;

    @Value("${email.destinatario.agin}")
    private String destinatarioAgin;

    @Value("${app.frontend.url}")
    private String frontendUrl;


    @Autowired
    public SolicitacaoAlteracaoService(
            SolicitacaoAlteracaoRepository repository,
            ObjectMapper objectMapper,
            @Lazy JogoService jogoService,
            EmailService emailService,
            @Lazy LaboratorioService laboratorioService,
            @Lazy StartupService startupService,
            @Lazy PessoaService pessoaService,
            @Lazy ServicoService servicoService,
            @Lazy ProtecaoService protecaoService
    ) {
        this.repository = repository;
        this.objectMapper = objectMapper;
        this.jogoService = jogoService;
        this.emailService = emailService;
        this.laboratorioService = laboratorioService;
        this.startupService = startupService;
        this.pessoaService = pessoaService;
        this.servicoService = servicoService;
        this.protecaoService = protecaoService;
    }

    // ==========================================
    // NOTIFICAÇÃO DE NOVO CADASTRO
    // ==========================================
    public void enviarEmailNotificacaoCriacao(TipoEntidade entidade, String nomeItem) {
        try {
            String entidadeFormatada = formatarEntidade(entidade);

            String htmlMessage =
                    "<div style='font-family: Arial; padding:20px'>" +
                            "<h2>Olá, Administrador! 🛡️</h2>" +
                            "<p>Novo cadastro de <b>" + entidadeFormatada + "</b> (" + nomeItem + ") aguardando aprovação.</p>" +
                            "<a href='" + frontendUrl + "/gestao/administracao/aprovacoes'>Acessar Aprovações</a>" +
                            "</div>";

            emailService.sendEmail(
                    destinatarioAgin,
                    "Novo Cadastro Pendente",
                    htmlMessage,
                    EmailType.CONTACT
            );

        } catch (Exception e) {
            log.error("Erro ao enviar email de criação", e);
        }
    }

    // ==========================================
    // CRIAR SOLICITAÇÃO
    // ==========================================
    public void registrarSolicitacao(TipoEntidade entidade, Long entidadeId, TipoAcao acao, Object dto, Long usuarioId) {
        try {
            String json = dto != null ? objectMapper.writeValueAsString(dto) : null;

            SolicitacaoAlteracao s = new SolicitacaoAlteracao();
            s.setEntidade(entidade);
            s.setEntidadeId(entidadeId);
            s.setTipoAcao(acao);
            s.setDadosNovos(json);
            s.setSolicitanteId(usuarioId);
            s.setStatus(StatusValidacao.PENDENTE);

            SolicitacaoAlteracao salva = repository.save(s);

            enviarEmailNotificacaoAdmin(salva);

        } catch (JsonProcessingException e) {
            throw new BusinessException("Erro ao serializar dados da solicitação");
        }
    }

    // ==========================================
    // EMAIL ADMIN
    // ==========================================
    private void enviarEmailNotificacaoAdmin(SolicitacaoAlteracao s) {
        try {
            String entidade = formatarEntidade(s.getEntidade());
            String acao = s.getTipoAcao() == TipoAcao.EXCLUSAO ? "Exclusão 🗑️" : "Edição ✏️";

            String html =
                    "<div style='font-family: Arial; padding:20px'>" +
                            "<h2>Nova Solicitação</h2>" +
                            "<p>" + acao + " em <b>" + entidade + "</b></p>" +
                            "<a href='" + frontendUrl + "/gestao/administracao/aprovacoes'>Aprovar</a>" +
                            "</div>";

            emailService.sendEmail(
                    destinatarioAgin,
                    "Nova Solicitação",
                    html,
                    EmailType.CONTACT
            );

        } catch (Exception e) {
            log.error("Erro email", e);
        }
    }

    // ==========================================
    // BUSCA
    // ==========================================
    public Page<SolicitacaoAlteracao> buscarComFiltros(TipoEntidade entidade, TipoAcao acao, StatusValidacao status, Pageable pageable) {
        Specification<SolicitacaoAlteracao> spec = (root, query, cb) -> cb.conjunction();

        if (entidade != null)
            spec = spec.and((r, q, cb) -> cb.equal(r.get("entidade"), entidade));

        if (acao != null)
            spec = spec.and((r, q, cb) -> cb.equal(r.get("tipoAcao"), acao));

        if (status != null)
            spec = spec.and((r, q, cb) -> cb.equal(r.get("status"), status));

        return repository.findAll(spec, pageable);
    }

    // ==========================================
    // AVALIAR
    // ==========================================
    @Transactional
    public void avaliarSolicitacao(Long id, boolean aprovado, String justificativa, Usuario admin) throws Exception {

        SolicitacaoAlteracao s = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Não encontrada"));

        if (s.getStatus() != StatusValidacao.PENDENTE)
            throw new IllegalArgumentException("Já avaliada");

        s.setAvaliadorId(admin.getId());
        s.setDataAvaliacao(LocalDateTime.now());
        s.setJustificativaAlteracao(justificativa);

        if (!aprovado) {
            s.setStatus(StatusValidacao.REJEITADO);
            repository.save(s);
            return;
        }

        s.setStatus(StatusValidacao.APROVADO);

        aplicarAlteracaoNaEntidadeReal(s, admin);

        repository.save(s);
    }

    // ==========================================
    // CORE (COMPLEXIDADE REDUZIDA)
    // ==========================================
    private void aplicarAlteracaoNaEntidadeReal(SolicitacaoAlteracao s, Usuario admin) throws Exception {


        if (s.getTipoAcao() == TipoAcao.EXCLUSAO) {
            executarExclusao(s.getEntidade(), s.getEntidadeId(), admin);
        } else if (s.getTipoAcao() == TipoAcao.EDICAO) {
            executarEdicao(s, admin);
        } else {
            throw new IllegalArgumentException("Ação não suportada: " + s.getTipoAcao());
        }
    }

    // 🔥 DIVISÃO 1: LIDA APENAS COM EXCLUSÃO
    private void executarExclusao(TipoEntidade entidade, Long id, Usuario admin) {
        switch (entidade) {
            case JOGO: jogoService.deletar(id, admin); break;
            case LABORATORIO: laboratorioService.deletar(id, admin); break;
            case STARTUP: startupService.deletar(id, admin.getId()); break;
            case PESSOA: pessoaService.deletar(id, admin); break;
            case SERVICO: servicoService.deletar(id, admin.getId()); break;
            case PROTECAO: protecaoService.deletar(id, admin.getId()); break;
            default: throw new IllegalArgumentException("Entidade não suportada: " + entidade);
        }
    }

    // 🔥 DIVISÃO 2: LIDA APENAS COM EDIÇÃO E DESSERIALIZAÇÃO DE DADOS
    private void executarEdicao(SolicitacaoAlteracao s, Usuario admin) throws Exception {
        String json = s.getDadosNovos();
        if (json == null) throw new IllegalArgumentException("Dados vazios");

        Long id = s.getEntidadeId();

        switch (s.getEntidade()) {
            case JOGO:
                jogoService.atualizar(id, objectMapper.readValue(json, JogoUpdateDTO.class), admin);
                break;
            case LABORATORIO:
                laboratorioService.atualizar(id, objectMapper.readValue(json, LaboratorioUpdateDTO.class), admin);
                break;
            case STARTUP:
                startupService.atualizar(id, objectMapper.readValue(json, StartupUpdateDTO.class), admin.getId());
                break;
            case PESSOA:
                pessoaService.atualizar(id, objectMapper.readValue(json, PessoaUpdateDTO.class), admin);
                break;
            case SERVICO:
                servicoService.atualizar(id, objectMapper.readValue(json, ServicoUpdateDTO.class), admin.getId());
                break;
            case PROTECAO:
                protecaoService.atualizar(id, objectMapper.readValue(json, ProtecaoUpdateDTO.class), admin.getId());
                break;
            default:
                throw new IllegalArgumentException("Entidade não suportada: " + s.getEntidade());
        }
    }

    // ==========================================
    // UTIL
    // ==========================================
    private String formatarEntidade(TipoEntidade entidade) {
        String nome = entidade.name();
        return nome.substring(0, 1).toUpperCase() + nome.substring(1).toLowerCase();
    }
}