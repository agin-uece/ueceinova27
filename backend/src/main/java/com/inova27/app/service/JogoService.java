package com.inova27.app.service;

import com.inova27.app.dto.jogo.JogoCreateDTO;
import com.inova27.app.dto.jogo.JogoFiltroDTO;
import com.inova27.app.dto.jogo.JogoResponseDTO;
import com.inova27.app.dto.jogo.JogoUpdateDTO;
import com.inova27.app.exception.*;
import com.inova27.app.mapper.DocumentoSemanticoMapper;
import com.inova27.app.model.*;
import com.inova27.app.repository.JogoRepository;
import com.inova27.app.specification.jogo.JogoSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JogoService {

    // 🔥 CONSTANTES PARA EVITAR DUPLICAÇÃO DE LITERAIS NO SONARQUBE
    private static final String ENTIDADE_JOGO = "Jogo";
    private static final String MSG_JOGO_NAO_ENCONTRADO = "Jogo não encontrado.";

    private final JogoRepository repository;
    private final DocumentoSemanticoMapper mapper;
    private final IndexadorSemanticoService indexador;
    private final AuditoriaService auditoriaService;
    private final SolicitacaoAlteracaoService solicitacaoService;

    public Page<JogoResponseDTO> buscarComFiltrosPaginado(JogoFiltroDTO filtro, Pageable pageable) {
        Specification<Jogo> specAprovado = (root, query, cb) ->
                cb.equal(root.get("status"), StatusValidacao.APROVADO);

        Specification<Jogo> specFinal = Specification.where(JogoSpecification.comFiltros(filtro)).and(specAprovado);

        return repository.findAll(specFinal, pageable).map(this::toResponseDTO);
    }

    @Transactional
    public JogoResponseDTO criar(JogoCreateDTO dto, Usuario user) {
        if (dto.nome() == null || dto.nome().isBlank()) {
            throw new IllegalArgumentException("O nome do jogo é obrigatório.");
        }
        String nomeNormalizado = dto.nome().trim();
        if (repository.existsByNomeIgnoreCase(nomeNormalizado)) {
            throw new JogoJaExisteException(nomeNormalizado);
        }

        Jogo jogo = new Jogo();
        jogo.setNome(nomeNormalizado);
        jogo.setDescricao(dto.descricao());
        jogo.setGenero(dto.genero());
        jogo.setPlataforma(dto.plataforma());
        jogo.setDataLancamento(dto.dataLancamento());
        jogo.setLinkDownload(dto.linkDownload());
        jogo.setSite(dto.site());

        if (user != null) {
            jogo.setUserInclusaoId(user.getId());
        }

        jogo.setTipoJogo(dto.tipoJogo());
        jogo.setAnoDesenvolvimento(dto.anoDesenvolvimento());
        jogo.setEstagioDesenvolvimento(dto.estagioDesenvolvimento());
        jogo.setUrlFoto(dto.urlFoto());

        jogo.setEngine(normalizarEngine(dto.engine()));

        if (dto.linguagens() != null) {
            jogo.setLinguagens(normalizarLinguagens(dto.linguagens()));
        }

        jogo.setFaixaEtaria(dto.faixaEtaria());
        jogo.setCriadores(dto.criadores());

        if (user != null && user.getRole() == UserRole.ADMIN) {
            jogo.setStatus(StatusValidacao.APROVADO);
        } else {
            jogo.setStatus(StatusValidacao.PENDENTE);
        }

        Jogo salvo = repository.save(jogo);

        if (salvo.getStatus() == StatusValidacao.PENDENTE) {
            solicitacaoService.enviarEmailNotificacaoCriacao(TipoEntidade.JOGO, salvo.getNome());
        }

        if (salvo.getStatus() == StatusValidacao.APROVADO) {
            var doc = mapper.fromJogo(salvo);
            indexador.indexar(doc);
        }

        JogoResponseDTO responseDTO = toResponseDTO(salvo);

        Long auditUserId = (user != null) ? user.getId() : null;
        auditoriaService.registrarLog(ENTIDADE_JOGO, salvo.getId(), AcaoAuditoria.CRIACAO, auditUserId, responseDTO);

        return responseDTO;
    }

    @Transactional
    public void validarJogo(Long id, boolean aprovado, Usuario adminLogado) {
        Jogo jogo = repository.findById(id)
                .orElseThrow(JogoNaoEncontradoException::new);

        if (aprovado) {
            jogo.setStatus(StatusValidacao.APROVADO);
            var doc = mapper.fromJogo(jogo);
            indexador.indexar(doc);
            repository.save(jogo);
        } else {
            jogo.setStatus(StatusValidacao.REJEITADO);
            repository.save(jogo);
            // Item rejeitado (inclusive se já estava aprovado) sai da busca pública
            indexador.removerIndex("jogos", jogo.getId());
        }

        String statusAlterado = aprovado ? "APROVADO" : "REJEITADO";
        auditoriaService.registrarLog(ENTIDADE_JOGO, jogo.getId(), AcaoAuditoria.VALIDACAO, adminLogado.getId(), "Status alterado para: " + statusAlterado);
    }

    @Transactional(readOnly = true)
    public Page<JogoResponseDTO> listarPorUsuario(Long usuarioId, Pageable pageable) {
        return repository.findByUserInclusaoId(usuarioId, pageable).map(this::toResponseDTO);
    }

    @Transactional(readOnly = true)
    public Page<JogoResponseDTO> listarPorUsuarioEStatus(Long usuarioId, StatusValidacao status, Pageable pageable) {
        Specification<Jogo> spec = (root, query, cb) ->
                cb.equal(root.get("userInclusaoId"), usuarioId);

        if (status != null) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("status"), status));
        }

        return repository.findAll(spec, pageable).map(this::toResponseDTO);
    }

    @Transactional(readOnly = true)
    public List<JogoResponseDTO> listarPorStatus(StatusValidacao status) {
        return repository.findByStatus(status)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<JogoResponseDTO> listarTodos() {
        return repository.findByStatus(StatusValidacao.APROVADO)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    // Jogo não aprovado só é visível para o admin e para quem o cadastrou (404 para os demais)
    @Transactional(readOnly = true)
    public JogoResponseDTO buscarPorId(Long id, Usuario usuario) {
        Jogo jogo = repository.findById(id)
                .orElseThrow(() -> new JogoNaoEncontradoException(id));
        if (jogo.getStatus() != StatusValidacao.APROVADO && !isAdmin(usuario) && !isOwner(jogo, usuario)) {
            throw new JogoNaoEncontradoException(id);
        }
        return toResponseDTO(jogo);
    }

    // 🔹 UPDATE (HÍBRIDO)
    @Transactional
    public JogoResponseDTO atualizar(Long id, JogoUpdateDTO dto, Usuario usuario) {
        Jogo jogo = repository.findById(id)
                .orElseThrow(JogoNaoEncontradoException::new);

        verificarPermissaoEdicao(jogo, usuario);

        if (dto.nome() != null && !dto.nome().isBlank()
                && repository.existsByNomeIgnoreCaseAndIdNot(dto.nome().trim(), id)) {
            throw new JogoJaExisteException(dto.nome().trim());
        }

        if (!isAdmin(usuario)) {
            solicitacaoService.registrarSolicitacao(
                    TipoEntidade.JOGO, id, TipoAcao.EDICAO, dto, usuario.getId());
            return null;
        }

        // 🔥 A COMPLEXIDADE COGNITIVA FOI DIVIDIDA ENTRE ESSES DOIS MÉTODOS
        aplicarAtributosBasicos(jogo, dto);
        aplicarRelacionamentos(jogo, dto);

        Jogo atualizado = repository.save(jogo);

        if (atualizado.getStatus() == StatusValidacao.APROVADO) {
            var doc = mapper.fromJogo(atualizado);
            indexador.indexar(doc);
        }

        auditoriaService.registrarLog(ENTIDADE_JOGO, atualizado.getId(), AcaoAuditoria.EDICAO, usuario.getId(), dto);

        return toResponseDTO(atualizado);
    }

    // 🔹 DELETE (HÍBRIDO)
    @Transactional
    public boolean deletar(Long id, Usuario usuario) {
        Jogo jogo = repository.findById(id)
                .orElseThrow(JogoNaoEncontradoException::new);

        boolean isAdmin = isAdmin(usuario);
        boolean isOwner = isOwner(jogo, usuario);

        if (!isAdmin && !isOwner) {
            throw new PermissaoNegadaException("Você não tem permissão para excluir este jogo.");
        }

        if (!isAdmin) {
            solicitacaoService.registrarSolicitacao(
                    TipoEntidade.JOGO, id, TipoAcao.EXCLUSAO, null, usuario.getId());
            return false;
        }

        JogoResponseDTO retrato = toResponseDTO(jogo);
        // As proteções (PI) continuam existindo; apenas deixam de apontar para o jogo excluído
        jogo.getProtecoes().forEach(p -> p.setJogo(null));
        repository.delete(jogo);
        indexador.removerIndex("jogos", id);

        auditoriaService.registrarLog(ENTIDADE_JOGO, id, AcaoAuditoria.DELECAO, usuario.getId(), retrato);

        return true;
    }

    // ========================================================================
    // 🔹 MÉTODOS PRIVADOS AUXILIARES
    // ========================================================================

    private boolean isAdmin(Usuario usuario) {
        return usuario != null && usuario.getRole() == UserRole.ADMIN;
    }

    private boolean isOwner(Jogo jogo, Usuario usuario) {
        return usuario != null && jogo.getUserInclusaoId() != null
                && jogo.getUserInclusaoId().equals(usuario.getId());
    }

    private void verificarPermissaoEdicao(Jogo jogo, Usuario usuario) {
        if (!isAdmin(usuario) && !isOwner(jogo, usuario)) {
            throw new PermissaoNegadaException("Você não tem permissão para atualizar este jogo.");
        }
    }

    // 🔥 DIVISÃO 1: Apenas os atributos básicos
    private void aplicarAtributosBasicos(Jogo jogo, JogoUpdateDTO dto) {
        if (dto.nome() != null && !dto.nome().isBlank()) jogo.setNome(dto.nome().trim());
        if (dto.descricao() != null) jogo.setDescricao(dto.descricao());
        if (dto.genero() != null) jogo.setGenero(dto.genero());
        if (dto.plataforma() != null) jogo.setPlataforma(dto.plataforma());
        if (dto.dataLancamento() != null) jogo.setDataLancamento(dto.dataLancamento());
        if (dto.linkDownload() != null) jogo.setLinkDownload(dto.linkDownload());
        if (dto.site() != null) jogo.setSite(dto.site());
        if (dto.tipoJogo() != null) jogo.setTipoJogo(dto.tipoJogo());
        if (dto.anoDesenvolvimento() != null) jogo.setAnoDesenvolvimento(dto.anoDesenvolvimento());
        if (dto.estagioDesenvolvimento() != null) jogo.setEstagioDesenvolvimento(dto.estagioDesenvolvimento());
        if (dto.faixaEtaria() != null) jogo.setFaixaEtaria(dto.faixaEtaria());
        if (dto.criadores() != null) jogo.setCriadores(dto.criadores());
        if (dto.urlFoto() != null) jogo.setUrlFoto(dto.urlFoto());
    }

    // 🔥 DIVISÃO 2: Engine e coleções de texto
    private void aplicarRelacionamentos(Jogo jogo, JogoUpdateDTO dto) {
        if (dto.engine() != null) {
            jogo.setEngine(normalizarEngine(dto.engine()));
        }

        if (dto.linguagens() != null) {
            jogo.setLinguagens(normalizarLinguagens(dto.linguagens()));
        }
    }

    private String normalizarEngine(String engine) {
        if (engine == null || engine.isBlank()) {
            return null;
        }
        return engine.trim();
    }

    private Set<String> normalizarLinguagens(Set<String> linguagens) {
        return linguagens.stream()
                .filter(l -> l != null && !l.isBlank())
                .map(String::trim)
                .collect(Collectors.toCollection(HashSet::new));
    }

    // 🔹 MAPPER
    private JogoResponseDTO toResponseDTO(Jogo jogo) {
        Set<String> nomesProtecoes = jogo.getProtecoes() == null ? new HashSet<>() :
                jogo.getProtecoes().stream().map(Protecao::getNome).collect(Collectors.toSet());

        Set<String> linguagens = jogo.getLinguagens() == null ? new HashSet<>() :
                new HashSet<>(jogo.getLinguagens());

        return new JogoResponseDTO(
                jogo.getId(),
                jogo.getNome(),
                jogo.getDescricao(),
                jogo.getGenero(),
                jogo.getPlataforma(),
                jogo.getDataLancamento(),
                jogo.getLinkDownload(),
                jogo.getSite(),
                linguagens,
                jogo.getEngine(),
                nomesProtecoes,
                jogo.getTipoJogo(),
                jogo.getAnoDesenvolvimento(),
                jogo.getEstagioDesenvolvimento(),
                jogo.getUrlFoto(),
                jogo.getStatus(),
                jogo.getFaixaEtaria(),
                jogo.getUserInclusaoId(),
                jogo.getCriadores()
        );
    }
}