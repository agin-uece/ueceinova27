package com.inova27.app.service;

import com.inova27.app.dto.pessoa.PessoaCreateDTO;
import com.inova27.app.dto.pessoa.PessoaFiltroDTO;
import com.inova27.app.dto.pessoa.PessoaResponseDTO;
import com.inova27.app.dto.pessoa.PessoaUpdateDTO;
import com.inova27.app.exception.BusinessException;
import com.inova27.app.exception.ResourceNotFoundException;
import com.inova27.app.mapper.DocumentoSemanticoMapper;
import com.inova27.app.model.*;
import com.inova27.app.repository.LaboratorioRepository;
import com.inova27.app.repository.PessoaRepository;
import com.inova27.app.repository.ProtecaoRepository;
import com.inova27.app.repository.StartupRepository;
import com.inova27.app.specification.pessoa.PessoaSpecification;
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
public class PessoaService {

    // 🔥 CONSTANTES DECLARADAS PARA ELIMINAR AS DUPLICAÇÕES APONTADAS PELO SONAR
    private static final String ENTIDADE_PESSOA = "Pessoa";
    private static final String MSG_PESSOA_NAO_ENCONTRADA = "Pessoa não encontrada.";
    private static final String MSG_LAB_NAO_ENCONTRADO = "Laboratório não encontrado.";
    private final PessoaRepository repository;
    private final LaboratorioRepository laboratorioRepository;
    private final StartupRepository startupRepository;
    private final ProtecaoRepository protecaoRepository;
    private final DocumentoSemanticoMapper mapper;
    private final IndexadorSemanticoService indexador;
    private final AuditoriaService auditoriaService;
    private final SolicitacaoAlteracaoService solicitacaoService;

    // 🔹 CREATE
    @Transactional
    public PessoaResponseDTO criar(PessoaCreateDTO dto, Usuario usuario) {

        if (repository.existsByEmail(dto.email())) {
            throw new BusinessException("Já existe uma pessoa cadastrada com este e-mail.");
        }

        Pessoa pessoa = new Pessoa();
        pessoa.setNome(dto.nome());
        pessoa.setEmail(dto.email());
        pessoa.setTelefone(dto.telefone());
        pessoa.setAreaPesquisa(dto.areaPesquisa());
        pessoa.setTitulacao(dto.titulacao());
        pessoa.setInstituicao(dto.instituicao());
        pessoa.setPapel(dto.papel());
        pessoa.setSite(dto.site());
        pessoa.setLattesURL(dto.lattesURL());
        pessoa.setLinkD(dto.linkD());
        pessoa.setCurso(dto.curso());
        pessoa.setDescricao(dto.descricao());
        pessoa.setAnoFormacao(dto.anoFormacao());
        pessoa.setUrlFoto(dto.urlFoto());
        pessoa.setMatricula(dto.matricula());

        if (usuario != null) {
            pessoa.setUserInclusaoId(usuario.getId());
        }

        if (usuario != null && usuario.getRole() == UserRole.ADMIN) {
            pessoa.setStatus(StatusValidacao.APROVADO);
        } else {
            pessoa.setStatus(StatusValidacao.PENDENTE);
        }

        // ... (código que seta nome, email, telefone na pessoa) ...

        // 🔥 1. VÍNCULO DE LABORATÓRIO (ManyToOne)
        if (dto.laboratorioId() != null) {
            Laboratorio lab = laboratorioRepository.findById(dto.laboratorioId())
                    .orElseThrow(() -> new IllegalArgumentException(MSG_LAB_NAO_ENCONTRADO));
            pessoa.setLaboratorio(lab);
        }

        // 🔥 2. VÍNCULO DE STARTUPS (ManyToMany - Pessoa é a Dona)
        if (dto.startupIds() != null && !dto.startupIds().isEmpty()) {
            List<Startup> startups = startupRepository.findAllById(dto.startupIds());
            pessoa.setStartups(new HashSet<>(startups));
        }

        // 🔥 3. VÍNCULO DE PROTEÇÕES (ManyToMany - Pessoa é a Dona)
        if (dto.protecaoIds() != null && !dto.protecaoIds().isEmpty()) {
            List<Protecao> protecoes = protecaoRepository.findAllById(dto.protecaoIds());
            pessoa.setProtecoes(new HashSet<>(protecoes));
        }

        // 🚀 Salva a pessoa E todas as relações de uma vez só!
        Pessoa salva = repository.save(pessoa);

        if (salva.getStatus() == StatusValidacao.PENDENTE) {
            solicitacaoService.enviarEmailNotificacaoCriacao(TipoEntidade.PESSOA, salva.getNome());
        }

        if (salva.getStatus() == StatusValidacao.APROVADO) {
            var doc = mapper.fromPessoa(salva);
            indexador.indexar(doc);
        }

        PessoaResponseDTO responseDTO = toResponseDTO(salva);

        Long auditUserId = (usuario != null) ? usuario.getId() : null;
        auditoriaService.registrarLog(ENTIDADE_PESSOA, salva.getId(), AcaoAuditoria.CRIACAO, auditUserId, responseDTO);

        return responseDTO;
    }

    @Transactional(readOnly = true)
    public List<PessoaResponseDTO> listarPorUsuario(Long usuarioId) {
        return repository.findByUserInclusaoId(usuarioId)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PessoaResponseDTO> listarPorUsuarioEStatus(Long usuarioId, StatusValidacao status) {

        Specification<Pessoa> spec = (root, query, cb) ->
                cb.equal(root.get("userInclusaoId"), usuarioId);

        if (status != null) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("status"), status));
        }

        return repository.findAll(spec)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PessoaResponseDTO> listarPorStatus(StatusValidacao status) {
        return repository.findByStatus(status)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public Page<PessoaResponseDTO> buscarComFiltrosPaginado(PessoaFiltroDTO filtro, Pageable pageable) {
        Specification<Pessoa> specAprovado = (root, query, cb) ->
                cb.equal(root.get("status"), StatusValidacao.APROVADO);

        Specification<Pessoa> specFinal = Specification.where(PessoaSpecification.comFiltros(filtro)).and(specAprovado);

        return repository.findAll(specFinal, pageable).map(this::toResponseDTO);
    }

    public PessoaResponseDTO buscarPorId(Long id, Usuario usuario) {
        Pessoa pessoa = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(msgPadraoNaoEncontrada()));

        boolean isAdmin = usuario != null && usuario.getRole() == UserRole.ADMIN;
        boolean isOwner = usuario != null && usuario.getId().equals(pessoa.getUserInclusaoId());

        if (!isAdmin && !isOwner && pessoa.getStatus() != StatusValidacao.APROVADO) {
            throw new BusinessException("Pessoa ainda não validada.");
        }

        return toResponseDTO(pessoa);
    }

    @Transactional
    public void validarPessoa(Long id, boolean aprovado, Usuario adminLogado) {
        Pessoa pessoa = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(msgPadraoNaoEncontrada()));

        if (aprovado) {
            pessoa.setStatus(StatusValidacao.APROVADO);
            var doc = mapper.fromPessoa(pessoa);
            indexador.indexar(doc);
            repository.save(pessoa);
        } else {
            pessoa.setStatus(StatusValidacao.REJEITADO);
            repository.save(pessoa);
        }

        String statusAlterado = aprovado ? "APROVADO" : "REJEITADO";
        auditoriaService.registrarLog(ENTIDADE_PESSOA, pessoa.getId(), AcaoAuditoria.VALIDACAO, adminLogado.getId(), "Status alterado para: " + statusAlterado);
    }

    @Transactional(readOnly = true)
    public List<PessoaResponseDTO> listarPendentes() {
        return repository.findByStatus(StatusValidacao.PENDENTE)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    // 🔹 UPDATE (COMPLEXIDADE COGNITIVA REDUZIDA)
    @Transactional
    public PessoaResponseDTO atualizar(Long id, PessoaUpdateDTO dto, Usuario usuario) {
        try {
            Pessoa pessoa = repository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException(msgPadraoNaoEncontrada()));

            boolean isAdmin = usuario != null && usuario.getRole() == UserRole.ADMIN;
            boolean isOwner = usuario != null && pessoa.getUserInclusaoId() != null
                    && pessoa.getUserInclusaoId().equals(usuario.getId());

            if (!isAdmin && !isOwner) {
                throw new SecurityException("Você não tem permissão para atualizar esta pessoa.");
            }

            if (!isAdmin) {
                solicitacaoService.registrarSolicitacao(
                        TipoEntidade.PESSOA,
                        id,
                        TipoAcao.EDICAO,
                        dto,
                        usuario.getId()
                );
                return null;
            }

            // 🔥 EXTRAÇÃO DA ATRIBUIÇÃO PARA MÉTODO AUXILIAR PRIVADO (Diminui complexidade)
            mapearCamposAtualizacao(pessoa, dto);
            pessoa.setStatus(StatusValidacao.APROVADO);


            // ... (código que seta nome, email, telefone na pessoa) ...

            // 🔥 1. VÍNCULO DE LABORATÓRIO (ManyToOne)
            if (dto.laboratorioId() != null) {
                Laboratorio lab = laboratorioRepository.findById(dto.laboratorioId())
                        .orElseThrow(() -> new IllegalArgumentException(MSG_LAB_NAO_ENCONTRADO));
                pessoa.setLaboratorio(lab);
            }

            // 🔥 2. VÍNCULO DE STARTUPS (ManyToMany - Pessoa é a Dona)
            if (dto.startupIds() != null && !dto.startupIds().isEmpty()) {
                List<Startup> startups = startupRepository.findAllById(dto.startupIds());
                pessoa.setStartups(new HashSet<>(startups));
            }

            // 🔥 3. VÍNCULO DE PROTEÇÕES (ManyToMany - Pessoa é a Dona)
            if (dto.protecaoIds() != null && !dto.protecaoIds().isEmpty()) {
                List<Protecao> protecoes = protecaoRepository.findAllById(dto.protecaoIds());
                pessoa.setProtecoes(new HashSet<>(protecoes));
            }

            // 🚀 Salva a pessoa E todas as relações de uma vez só!
            Pessoa updated = repository.save(pessoa);

            indexador.removerIndex("pessoas", id);
            var doc = mapper.fromPessoa(updated);
            indexador.indexar(doc);

            auditoriaService.registrarLog(ENTIDADE_PESSOA, updated.getId(), AcaoAuditoria.EDICAO, usuario.getId(), dto);

            return toResponseDTO(updated);

        } catch (ResourceNotFoundException | SecurityException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException("Erro interno ao atualizar pessoa: " + e.getMessage());
        }
    }

    // 🔹 MÉTODO PRIVADO AUXILIAR PARA CORRIGIR O AVISO DE COMPLEXIDADE
    private void mapearCamposAtualizacao(Pessoa pessoa, PessoaUpdateDTO dto) {
        if (dto.nome() != null) pessoa.setNome(dto.nome());
        if (dto.telefone() != null) pessoa.setTelefone(dto.telefone());
        if (dto.areaPesquisa() != null) pessoa.setAreaPesquisa(dto.areaPesquisa());
        if (dto.titulacao() != null) pessoa.setTitulacao(dto.titulacao());
        if (dto.instituicao() != null) pessoa.setInstituicao(dto.instituicao());
        if (dto.papel() != null) pessoa.setPapel(dto.papel());
        if (dto.site() != null) pessoa.setSite(dto.site());
        if (dto.lattesURL() != null) pessoa.setLattesURL(dto.lattesURL());
        if (dto.linkD() != null) pessoa.setLinkD(dto.linkD());
        if (dto.curso() != null) pessoa.setCurso(dto.curso());
        if (dto.descricao() != null) pessoa.setDescricao(dto.descricao());
        if (dto.anoFormacao() != null) pessoa.setAnoFormacao(dto.anoFormacao());
        if (dto.urlFoto() != null) pessoa.setUrlFoto(dto.urlFoto());
        if (dto.matricula() != null) pessoa.setMatricula(dto.matricula());
    }

    // 🔹 DELETE (HÍBRIDO)
    @Transactional
    public boolean deletar(Long id, Usuario usuario) {
        try {
            Pessoa pessoa = repository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException(msgPadraoNaoEncontrada()));

            if (usuario == null) throw new SecurityException("Usuário não autenticado.");

            boolean isAdmin = usuario.getRole() == UserRole.ADMIN;
            boolean isOwner = pessoa.getUserInclusaoId() != null && pessoa.getUserInclusaoId().equals(usuario.getId());

            if (!isAdmin && !isOwner) {
                throw new SecurityException("Você não tem permissão para excluir esta pessoa.");
            }

            if (!isAdmin) {
                solicitacaoService.registrarSolicitacao(
                        TipoEntidade.PESSOA,
                        id,
                        TipoAcao.EXCLUSAO,
                        null,
                        usuario.getId()
                );
                return false;
            }

            PessoaResponseDTO retrato = toResponseDTO(pessoa);
            repository.delete(pessoa);
            indexador.removerIndex("pessoas", id);
            auditoriaService.registrarLog(ENTIDADE_PESSOA, id, AcaoAuditoria.DELECAO, usuario.getId(), retrato);

            return true;

        } catch (ResourceNotFoundException | SecurityException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException("Erro interno ao deletar pessoa: " + e.getMessage());
        }
    }

    private PessoaResponseDTO toResponseDTO(Pessoa pessoa) {
        String nomeLaboratorio = (pessoa.getLaboratorio() != null) ? pessoa.getLaboratorio().getNome() : null;

        Set<String> nomesProtecoes = pessoa.getProtecoes() != null ?
                pessoa.getProtecoes().stream().map(Protecao::getNome).collect(Collectors.toSet()) :
                new HashSet<>();

        Set<String> nomesStartups = pessoa.getStartups() != null ?
                pessoa.getStartups().stream().map(Startup::getNome).collect(Collectors.toSet()) :
                new HashSet<>();

        Set<String> nomesServicos = pessoa.getServicos() != null ?
                pessoa.getServicos().stream().map(Servico::getAreaAtuacao).collect(Collectors.toSet()) :
                new HashSet<>();

        return new PessoaResponseDTO(
                pessoa.getId(), pessoa.getNome(), pessoa.getEmail(), pessoa.getTelefone(),
                pessoa.getAreaPesquisa(), pessoa.getTitulacao(), pessoa.getInstituicao(),
                pessoa.getPapel(), pessoa.getSite(), pessoa.getLattesURL(), pessoa.getLinkD(),
                pessoa.getCurso(), pessoa.getDescricao(), pessoa.getAnoFormacao(), pessoa.getUrlFoto(),
                nomeLaboratorio, nomesProtecoes, nomesStartups, pessoa.getMatricula(),
                nomesServicos, pessoa.getUserInclusaoId()
        );
    }

    @Transactional
    public void vincularLaboratorio(Long pessoaId, Long laboratorioId, Usuario usuario) {
        try {
            Pessoa pessoa = repository.findById(pessoaId)
                    .orElseThrow(() -> new ResourceNotFoundException(msgPadraoNaoEncontrada()));
            Laboratorio laboratorio = laboratorioRepository.findById(laboratorioId)
                    .orElseThrow(() -> new ResourceNotFoundException(MSG_LAB_NAO_ENCONTRADO));

            pessoa.setLaboratorio(laboratorio);
            repository.save(pessoa);
            Long auditUserId = (usuario != null) ? usuario.getId() : null;
            auditoriaService.registrarLog(ENTIDADE_PESSOA, pessoaId, AcaoAuditoria.VINCULO, auditUserId, "Laboratório ID " + laboratorioId + " vinculado à pessoa.");
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException("Erro ao vincular laboratório");

        }
    }

    @Transactional
    public void desvincularLaboratorio(Long pessoaId, Long laboratorioId, Usuario usuario) {
        try {
            Pessoa pessoa = repository.findById(pessoaId)
                    .orElseThrow(() -> new ResourceNotFoundException(msgPadraoNaoEncontrada()));

            if (pessoa.getLaboratorio() == null || !pessoa.getLaboratorio().getId().equals(laboratorioId)) {
                throw new ResourceNotFoundException("Esta pessoa não está vinculada a este laboratório (ID incompatível).");
            }

            pessoa.setLaboratorio(null);
            repository.save(pessoa);
            Long auditUserId = (usuario != null) ? usuario.getId() : null;
            auditoriaService.registrarLog(ENTIDADE_PESSOA, pessoaId, AcaoAuditoria.DESVINCULO, auditUserId, "Laboratório ID " + laboratorioId + " desvinculado da pessoa.");

        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException("Erro ao desvincular laboratório: " + e.getMessage());
        }
    }

    @Transactional
    public void vincularStartup(Long pessoaId, Long startupId, Usuario usuario) {
        try {
            Pessoa pessoa = repository.findById(pessoaId)
                    .orElseThrow(() -> new ResourceNotFoundException(msgPadraoNaoEncontrada()));
            Startup startup = startupRepository.findById(startupId)
                    .orElseThrow(() -> new ResourceNotFoundException("Startup não encontrada."));

            pessoa.getStartups().add(startup);
            repository.save(pessoa);
            Long auditUserId = (usuario != null) ? usuario.getId() : null;
            auditoriaService.registrarLog(ENTIDADE_PESSOA, pessoaId, AcaoAuditoria.VINCULO, auditUserId, "Startup ID " + startupId + " vinculada à pessoa.");

        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException("Erro ao vincular startup: " + e.getMessage());
        }
    }

    @Transactional
    public void desvincularStartup(Long pessoaId, Long startupId, Usuario usuario) {
        try {
            Pessoa pessoa = repository.findById(pessoaId)
                    .orElseThrow(() -> new ResourceNotFoundException(msgPadraoNaoEncontrada()));

            if (pessoa.getStartups() == null) {
                throw new ResourceNotFoundException("A pessoa não possui nenhuma startup vinculada.");
            }

            boolean removido = pessoa.getStartups().removeIf(s -> s.getId().equals(startupId));

            if (!removido) {
                throw new ResourceNotFoundException("Esta startup não estava vinculada a esta pessoa.");
            }

            repository.save(pessoa);

            Long auditUserId = (usuario != null) ? usuario.getId() : null;
            auditoriaService.registrarLog(ENTIDADE_PESSOA, pessoaId, AcaoAuditoria.DESVINCULO, auditUserId, "Startup ID " + startupId + " desvinculada da pessoa.");

        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            String causa = e.getMessage() != null ? e.getMessage() : "Erro interno de referência nula.";
            throw new BusinessException("Erro ao desvincular startup: " + causa);
        }
    }

    @Transactional
    public void vincularProtecao(Long pessoaId, Long protecaoId, Usuario usuario) {
        try {
            Pessoa pessoa = repository.findById(pessoaId)
                    .orElseThrow(() -> new ResourceNotFoundException(msgPadraoNaoEncontrada()));
            Protecao protecao = protecaoRepository.findById(protecaoId)
                    .orElseThrow(() -> new ResourceNotFoundException("Proteção não encontrada."));

            pessoa.getProtecoes().add(protecao);
            repository.save(pessoa);
            Long auditUserId = (usuario != null) ? usuario.getId() : null;
            auditoriaService.registrarLog(ENTIDADE_PESSOA, pessoaId, AcaoAuditoria.VINCULO, auditUserId, "Proteção ID " + protecaoId + " vinculada à pessoa.");
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException("Erro ao vincular proteção: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public List<PessoaResponseDTO> listarAprovadosComServicos() {
        return repository.findByStatusAndServicosIsNotEmpty(StatusValidacao.APROVADO)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional
    public void desvincularProtecao(Long pessoaId, Long protecaoId, Usuario usuario) {
        try {
            Pessoa pessoa = repository.findById(pessoaId)
                    .orElseThrow(() -> new ResourceNotFoundException(msgPadraoNaoEncontrada()));
            Protecao protecao = protecaoRepository.findById(protecaoId)
                    .orElseThrow(() -> new ResourceNotFoundException("Proteção não encontrada."));

            pessoa.getProtecoes().remove(protecao);
            repository.save(pessoa);
            Long auditUserId = (usuario != null) ? usuario.getId() : null;
            auditoriaService.registrarLog(ENTIDADE_PESSOA, pessoaId, AcaoAuditoria.DESVINCULO, auditUserId, "Proteção ID " + protecaoId + " desvinculada da pessoa.");
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException("Erro ao desvincular proteção: " + e.getMessage());
        }
    }

    // Método utilitário interno para simplificar as chamadas de exceção mantendo a constante
    private String msgPadraoNaoEncontrada() {
        return MSG_PESSOA_NAO_ENCONTRADA;
    }
}