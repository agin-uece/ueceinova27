package com.inova27.app.service;

import com.inova27.app.dto.incubacao.IncubacaoRequestDTO;
import com.inova27.app.dto.incubacao.IncubacaoResponseDTO;
import com.inova27.app.exception.ConflitoException;
import com.inova27.app.exception.ResourceNotFoundException;
import com.inova27.app.model.AcaoAuditoria;
import com.inova27.app.model.Incubacao;
import com.inova27.app.repository.IncubacaoRepository;
import com.inova27.app.repository.StartupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IncubacaoService {

    private static final String ENTIDADE = "Incubacao";
    private static final String MSG_NAO_ENCONTRADA = "Incubação não encontrada.";
    private static final String MSG_NOME_EM_USO = "Já existe uma incubação com este nome.";
    private static final String MSG_EM_USO = "Esta incubação está em uso por startups. Altere essas startups antes de excluí-la.";

    private final IncubacaoRepository repository;
    private final StartupRepository startupRepository;
    private final AuditoriaService auditoriaService;

    public List<IncubacaoResponseDTO> listar() {
        return repository.findAllByOrderByNomeAsc().stream().map(IncubacaoResponseDTO::de).toList();
    }

    public IncubacaoResponseDTO buscarPorId(Long id) {
        return IncubacaoResponseDTO.de(buscar(id));
    }

    @Transactional
    public IncubacaoResponseDTO criar(IncubacaoRequestDTO dto, Long usuarioId) {
        if (repository.existsByNomeIgnoreCase(dto.nome())) {
            throw new ConflitoException(MSG_NOME_EM_USO);
        }
        Incubacao salva = repository.save(new Incubacao(dto.nome()));
        auditoriaService.registrarLog(ENTIDADE, salva.getId(), AcaoAuditoria.CRIACAO, usuarioId, dto);
        return IncubacaoResponseDTO.de(salva);
    }

    @Transactional
    public IncubacaoResponseDTO atualizar(Long id, IncubacaoRequestDTO dto, Long usuarioId) {
        Incubacao incubacao = buscar(id);
        if (repository.existsByNomeIgnoreCaseAndIdNot(dto.nome(), id)) {
            throw new ConflitoException(MSG_NOME_EM_USO);
        }
        incubacao.setNome(dto.nome());
        Incubacao salva = repository.save(incubacao);
        auditoriaService.registrarLog(ENTIDADE, id, AcaoAuditoria.EDICAO, usuarioId, dto);
        return IncubacaoResponseDTO.de(salva);
    }

    @Transactional
    public void excluir(Long id, Long usuarioId) {
        Incubacao incubacao = buscar(id);
        // Inclui startups desativadas (soft delete): elas ainda referenciam a incubação no banco
        if (startupRepository.existeComIncubacao(id)) {
            throw new ConflitoException(MSG_EM_USO);
        }
        repository.delete(incubacao);
        auditoriaService.registrarLog(ENTIDADE, id, AcaoAuditoria.DELECAO, usuarioId, IncubacaoResponseDTO.de(incubacao));
    }

    private Incubacao buscar(Long id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException(MSG_NAO_ENCONTRADA));
    }
}
