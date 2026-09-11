package com.inova27.app.service;

import com.inova27.app.dto.laboratorio.LaboratorioCreateDTO;
import com.inova27.app.dto.laboratorio.LaboratorioFiltroDTO;
import com.inova27.app.dto.laboratorio.LaboratorioResponseDTO;
import com.inova27.app.dto.laboratorio.LaboratorioUpdateDTO;
import com.inova27.app.exception.BusinessException;
import com.inova27.app.exception.ResourceNotFoundException;
import com.inova27.app.exception.UnauthorizedActionException;
import com.inova27.app.mapper.DocumentoSemanticoMapper;
import com.inova27.app.model.*;
import com.inova27.app.repository.LaboratorioRepository;
import com.inova27.app.repository.PessoaRepository;
import com.inova27.app.specification.laboratorio.LaboratorioSpecification;
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
public class LaboratorioService {

    // 🔥 CONSTANTES CRIADAS PARA RESOLVER OS AVISOS DO SONARQUBE
    private static final String ENTIDADE_LABORATORIO = "Laboratorio";
    private static final String MSG_LABORATORIO_NAO_ENCONTRADO = "Laboratório não encontrado";

    private final LaboratorioRepository repository;
    private final DocumentoSemanticoMapper mapper;
    private final IndexadorSemanticoService indexador;
    private final AuditoriaService auditoriaService;
    private final SolicitacaoAlteracaoService solicitacaoService;

    @Transactional
    public void validarLaboratorio(Long id, boolean aprovado, Usuario adminLogado) {
        Laboratorio lab = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(MSG_LABORATORIO_NAO_ENCONTRADO));

        if (aprovado) {
            lab.setStatus(StatusValidacao.APROVADO);
            var doc = mapper.fromLaboratorio(lab);
            indexador.indexar(doc);
            repository.save(lab);
        } else {
            lab.setStatus(StatusValidacao.REJEITADO);
            repository.save(lab);
        }

        String statusAlterado = aprovado ? "APROVADO" : "REJEITADO";
        auditoriaService.registrarLog(ENTIDADE_LABORATORIO, lab.getId(), AcaoAuditoria.VALIDACAO, adminLogado.getId(), "Status alterado para: " + statusAlterado);
    }

    public Page<LaboratorioResponseDTO> buscarComFiltrosPaginado(LaboratorioFiltroDTO filtro, Pageable pageable) {
        Specification<Laboratorio> specAprovado = (root, query, cb) ->
                cb.equal(root.get("status"), StatusValidacao.APROVADO);

        Specification<Laboratorio> specFinal = Specification.where(LaboratorioSpecification.comFiltros(filtro)).and(specAprovado);

        return repository.findAll(specFinal, pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public List<LaboratorioResponseDTO> listarPorUsuario(Long usuarioId) {
        return repository.findByUserInclusaoId(usuarioId).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<LaboratorioResponseDTO> listarPorUsuarioEStatus(Long usuarioId, StatusValidacao status) {
        Specification<Laboratorio> spec = (root, query, cb) -> cb.equal(root.get("userInclusaoId"), usuarioId);
        if (status != null) spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), status));
        return repository.findAll(spec).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<LaboratorioResponseDTO> listarPorStatus(StatusValidacao status) {
        return repository.findByStatus(status).stream().map(this::toResponse).toList();
    }

    @Transactional
    public LaboratorioResponseDTO criar(LaboratorioCreateDTO dto, Usuario usuario) {
        try {
            if (dto.nome() == null || dto.nome().isBlank()) throw new IllegalArgumentException("Nome é obrigatório");
            if (repository.existsByNome(dto.nome())) throw new IllegalArgumentException("Já existe um laboratório com esse nome");

            Laboratorio lab = new Laboratorio();
            lab.setNome(dto.nome());
            lab.setDescricao(dto.descricao());
            lab.setCoordenacao(dto.coordenacao());
            lab.setArea(dto.area());
            lab.setEmail(dto.email());
            lab.setSite(dto.site());
            lab.setTelefone(dto.telefone());
            if (dto.naturezas() != null) lab.setNaturezas(new HashSet<>(dto.naturezas()));
            lab.setVinculado(dto.vinculado());
            lab.setHorarioAbertura(dto.horarioAbertura());
            lab.setHorarioFechamento(dto.horarioFechamento());
            lab.setUrlFoto(dto.urlFoto());
            lab.setLocalizacao(dto.localizacao());
            lab.setParcerias(dto.parcerias());
            lab.setInfraestrutura(dto.infraestrutura());
            lab.setUserInclusaoId(usuario != null ? usuario.getId() : null);
            lab.setResolucao(dto.resolucao());
            lab.setQtdPessoas(dto.qtdPessoas());
            lab.setQtdMestrando(dto.qtdMestrando());
            lab.setQtdDoutorandos(dto.qtdDoutorandos());
            lab.setQtdPosDoc(dto.qtdPosDoc());

            if (dto.tags() != null) lab.setTags(new HashSet<>(dto.tags()));

            lab.setInstagram(dto.instagram());

            if (usuario != null && usuario.getRole() == UserRole.ADMIN) {
                lab.setStatus(StatusValidacao.APROVADO);
            } else {
                lab.setStatus(StatusValidacao.PENDENTE);
            }

            Laboratorio salvo = repository.save(lab);

            if (salvo.getStatus() == StatusValidacao.PENDENTE) {
                solicitacaoService.enviarEmailNotificacaoCriacao(TipoEntidade.LABORATORIO, salvo.getNome());
            }

            if (salvo.getStatus() == StatusValidacao.APROVADO) {
                var doc = mapper.fromLaboratorio(salvo);
                indexador.indexar(doc);
            }

            LaboratorioResponseDTO responseDTO = toResponse(salvo);
            Long auditUserId = usuario != null ? usuario.getId() : null;
            auditoriaService.registrarLog(ENTIDADE_LABORATORIO, salvo.getId(), AcaoAuditoria.CRIACAO, auditUserId, responseDTO);
            return responseDTO;

        } catch (IllegalArgumentException | SecurityException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException("Erro ao criar laboratório.");
        }
    }

    @Transactional(readOnly = true)
    public List<LaboratorioResponseDTO> listarTodos() {
        try {
            return repository.findByStatus(StatusValidacao.APROVADO).stream().map(this::toResponse).toList();
        } catch (Exception e) {
            throw new BusinessException("Erro ao listar laboratórios");
        }
    }

    @Transactional(readOnly = true)
    public LaboratorioResponseDTO buscarPorId(Long id) {
        try {
            Laboratorio lab = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException(MSG_LABORATORIO_NAO_ENCONTRADO));
            return toResponse(lab);
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException("Erro ao buscar laboratório.");
        }
    }

    @Transactional
    public LaboratorioResponseDTO atualizar(Long id, LaboratorioUpdateDTO dto, Usuario usuario) {
        try {
            Laboratorio lab = repository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException(MSG_LABORATORIO_NAO_ENCONTRADO));

            boolean isAdmin = usuario != null && usuario.getRole() == UserRole.ADMIN;
            boolean isOwner = usuario != null && lab.getUserInclusaoId() != null
                    && lab.getUserInclusaoId().equals(usuario.getId());

            if (!isAdmin && !isOwner) {
                throw new UnauthorizedActionException("Você não tem permissão para atualizar este laboratório.");
            }

            if (!isAdmin) {
                solicitacaoService.registrarSolicitacao(
                        TipoEntidade.LABORATORIO,
                        id,
                        TipoAcao.EDICAO,
                        dto,
                        usuario.getId()
                );
                return null;
            }

            // 🔥 COMPONENTIZAÇÃO PARA REDUZIR COMPLEXIDADE COGNITIVA
            mapearCamposAtualizacao(lab, dto);

            Laboratorio atualizado = repository.save(lab);

            if (atualizado.getStatus() == StatusValidacao.APROVADO) {
                indexador.removerIndex("laboratorios", id);
                var doc = mapper.fromLaboratorio(atualizado);
                indexador.indexar(doc);
            }

            auditoriaService.registrarLog(ENTIDADE_LABORATORIO, atualizado.getId(), AcaoAuditoria.EDICAO, usuario.getId(), dto);

            return toResponse(atualizado);

        } catch (IllegalArgumentException | SecurityException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException("Erro ao atualizar laboratório.");
        }
    }

    // 🔹 MÉTODOS PRIVADOS CRIADOS PARA DIMINUIR A COMPLEXIDADE COGNITIVA
    private void mapearCamposAtualizacao(Laboratorio lab, LaboratorioUpdateDTO dto) {
        aplicarTextosBasicos(lab, dto);
        aplicarContatosEColecoes(lab, dto);
    }

    // 🔥 DIVISÃO 1: Apenas os atributos de texto básicos
    private void aplicarTextosBasicos(Laboratorio lab, LaboratorioUpdateDTO dto) {
        if (dto.nome() != null && !dto.nome().isBlank()) lab.setNome(dto.nome());
        if (dto.descricao() != null) lab.setDescricao(dto.descricao());
        if (dto.coordenacao() != null) lab.setCoordenacao(dto.coordenacao());
        if (dto.area() != null) lab.setArea(dto.area());
        if (dto.vinculado() != null) lab.setVinculado(dto.vinculado());
        if (dto.horarioAbertura() != null) lab.setHorarioAbertura(dto.horarioAbertura());
        if (dto.horarioFechamento() != null) lab.setHorarioFechamento(dto.horarioFechamento());
        if (dto.urlFoto() != null) lab.setUrlFoto(dto.urlFoto());
        if (dto.localizacao() != null) lab.setLocalizacao(dto.localizacao());
        if (dto.parcerias() != null) lab.setParcerias(dto.parcerias());
        if (dto.infraestrutura() != null) lab.setInfraestrutura(dto.infraestrutura());
        if (dto.resolucao() != null) lab.setResolucao(dto.resolucao());
    }

    // 🔥 DIVISÃO 2: Apenas contatos e coleções (Tags e Naturezas)
    private void aplicarContatosEColecoes(Laboratorio lab, LaboratorioUpdateDTO dto) {
        if (dto.email() != null) lab.setEmail(dto.email());
        if (dto.site() != null) lab.setSite(dto.site());
        if (dto.telefone() != null) lab.setTelefone(dto.telefone());
        if (dto.instagram() != null) lab.setInstagram(dto.instagram());

        if (dto.naturezas() != null) {
            lab.getNaturezas().clear();
            lab.getNaturezas().addAll(dto.naturezas());
        }

        if (dto.tags() != null) {
            lab.getTags().clear();
            lab.getTags().addAll(dto.tags());
        }
        if (dto.qtdPessoas() != null) {
            lab.setQtdPessoas(dto.qtdPessoas());
        }
        if (dto.qtdMestrando() != null) {
            lab.setQtdMestrando(dto.qtdMestrando());
        }
        if (dto.qtdDoutorandos() != null) {
            lab.setQtdDoutorandos(dto.qtdDoutorandos());
        }
        if (dto.qtdPosDoc()!= null) {
            lab.setQtdPosDoc(dto.qtdPosDoc());
        }
    }

    @Transactional
    public boolean deletar(Long id, Usuario usuario) {
        try {
            Laboratorio lab = repository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException(MSG_LABORATORIO_NAO_ENCONTRADO));

            boolean isAdmin = usuario != null && usuario.getRole() == UserRole.ADMIN;
            boolean isOwner = usuario != null && lab.getUserInclusaoId() != null
                    && lab.getUserInclusaoId().equals(usuario.getId());

            if (!isAdmin && !isOwner) {
                throw new UnauthorizedActionException("Você não tem permissão para excluir este laboratório.");
            }

            if (!isAdmin) {
                solicitacaoService.registrarSolicitacao(
                        TipoEntidade.LABORATORIO,
                        id,
                        TipoAcao.EXCLUSAO,
                        null,
                        usuario.getId()
                );
                return false;
            }

            LaboratorioResponseDTO retratoAntesDeApagar = toResponse(lab);

            auditoriaService.registrarLog(ENTIDADE_LABORATORIO, id, AcaoAuditoria.DELECAO, usuario.getId(), retratoAntesDeApagar);

            repository.delete(lab);
            indexador.removerIndex("laboratorios", id);

            return true;

        }catch (IllegalArgumentException | UnauthorizedActionException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException("Erro ao deletar laboratório.");
        }
    }

    private LaboratorioResponseDTO toResponse(Laboratorio lab) {
        Set<String> nomesPessoas = lab.getPessoas() == null ? new HashSet<>() :
                lab.getPessoas().stream().map(Pessoa::getNome).collect(Collectors.toSet());

        return new LaboratorioResponseDTO(
                lab.getId(), lab.getNome(), lab.getDescricao(), lab.getCoordenacao(), lab.getArea(),
                lab.getEmail(), lab.getSite(), lab.getTelefone(), lab.getNaturezas(), lab.getVinculado(),
                lab.getHorarioAbertura(), lab.getHorarioFechamento(), lab.getUrlFoto(), lab.getLocalizacao(),
                lab.getParcerias(), lab.getInfraestrutura(), lab.getTags(), nomesPessoas, lab.getUserInclusaoId(),
                lab.getInstagram(),lab.getResolucao(),lab.getQtdPessoas(),lab.getQtdMestrando(),lab.getQtdDoutorandos(),lab.getQtdPosDoc()
        );
    }
}