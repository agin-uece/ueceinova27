package com.inova27.app.service;

import com.inova27.app.dto.protecao.ProtecaoCreateDTO;
import com.inova27.app.dto.protecao.ProtecaoResponseDTO;
import com.inova27.app.dto.protecao.ProtecaoUpdateDTO;
import com.inova27.app.exception.BusinessException;
import com.inova27.app.exception.ResourceNotFoundException;
import com.inova27.app.mapper.DocumentoSemanticoMapper;
import com.inova27.app.model.AcaoAuditoria;
import com.inova27.app.model.Jogo;
import com.inova27.app.model.NaturezaProtecao;
import com.inova27.app.model.Protecao;
import com.inova27.app.repository.JogoRepository;
import com.inova27.app.repository.ProtecaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProtecaoService {

    private static final String ENTIDADE_PROTECAO = "Protecao";

    private final ProtecaoRepository repository;
    private final JogoRepository jogoRepository;
    private final AuditoriaService auditoriaService;
    private final DocumentoSemanticoMapper mapper;
    private final IndexadorSemanticoService indexador;

    @Transactional
    public ProtecaoResponseDTO criar(ProtecaoCreateDTO dto, Long usuarioId) {

        if (dto.nome() == null || dto.nome().isBlank()) {
            throw new BusinessException("O nome da proteção é obrigatório.");
        }

        if (dto.codId() != null && repository.existsByCodId(dto.codId())) {
            throw new BusinessException("Já existe uma proteção com este Código ID.");
        }

        try {
            Protecao protecao = new Protecao();
            protecao.setCodId(dto.codId());
            protecao.setNome(dto.nome());
            protecao.setResumo(dto.resumo());
            protecao.setInstituicao(dto.instituicao());
            protecao.setNatureza(dto.natureza());
            protecao.setDataDeposito(dto.dataDeposito());
            protecao.setInfoExtra(dto.infoExtra());

            protecao.setArea(dto.area());
            protecao.setNivelMaturidade(dto.nivelMaturidade());
            protecao.setAplicacao(dto.aplicacao());
            protecao.setStatus(dto.status());

            protecao.setInventores(dto.inventores());
            protecao.setTitular(dto.titular());
            protecao.setDiferencialTecnologico(dto.diferencialTecnologico());
            protecao.setNumeroProtocolo(dto.numeroProtocolo());

            protecao.setUserInclusaoId(usuarioId);

            if (dto.tipos() != null) {
                protecao.setTipos(dto.tipos());
            }

            if (dto.jogoId() != null) {
                if (dto.natureza() != NaturezaProtecao.SOFTWARE &&
                        dto.natureza() != NaturezaProtecao.DESENHO_INDUSTRIAL) {
                    throw new BusinessException("Jogo só pode ser vinculado em proteções do tipo SOFTWARE ou DESENHO_INDUSTRIAL.");
                }
                Jogo jogo = jogoRepository.findById(dto.jogoId())
                        .orElseThrow(() -> new ResourceNotFoundException("Jogo informado não encontrado."));
                protecao.setJogo(jogo);
            }

            Protecao salva = repository.save(protecao);
            var doc = mapper.fromProtecao(salva);
            indexador.indexar(doc);
            ProtecaoResponseDTO responseDTO = toResponseDTO(salva);

            auditoriaService.registrarLog(
                    ENTIDADE_PROTECAO,
                    salva.getId(),
                    AcaoAuditoria.CRIACAO,
                    usuarioId,
                    responseDTO
            );

            return responseDTO;

        } catch (Exception e) {
            throw new BusinessException("Erro interno ao criar proteção");
        }
    }

    public List<ProtecaoResponseDTO> listarTodas() {
        try {
            return repository.findAll()
                    .stream()
                    .map(this::toResponseDTO)
                    .toList();
        } catch (Exception e) {
            throw new BusinessException("Erro ao buscar a lista de proteções");
        }
    }

    public ProtecaoResponseDTO buscarPorId(Long id) {
        try {
            Protecao protecao = repository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Proteção não encontrada com o ID: " + id));
            return toResponseDTO(protecao);
        } catch (Exception e) {
            throw new BusinessException("Erro interno ao buscar proteção");
        }
    }

    @Transactional
    public ProtecaoResponseDTO atualizar(Long id, ProtecaoUpdateDTO dto, Long usuarioId) {
        try {
            Protecao protecao = repository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Proteção não encontrada para atualização."));

            mapearCamposAtualizacao(protecao, dto);

            Protecao atualizada = repository.save(protecao);

            indexador.removerIndex("protecoes", id);
            var doc = mapper.fromProtecao(atualizada);
            indexador.indexar(doc);

            auditoriaService.registrarLog(
                    ENTIDADE_PROTECAO,
                    atualizada.getId(),
                    AcaoAuditoria.EDICAO,
                    usuarioId,
                    dto
            );

            return toResponseDTO(atualizada);

        } catch (Exception e) {
            throw new BusinessException("Erro interno ao atualizar proteção");
        }
    }

    private void mapearCamposAtualizacao(Protecao protecao, ProtecaoUpdateDTO dto) {
        aplicarDadosBasicos(protecao, dto);
        aplicarDadosTecnicos(protecao, dto);
    }

    private void aplicarDadosBasicos(Protecao protecao, ProtecaoUpdateDTO dto) {
        if (dto.codId() != null) protecao.setCodId(dto.codId());
        if (dto.nome() != null && !dto.nome().isBlank()) protecao.setNome(dto.nome());
        if (dto.resumo() != null) protecao.setResumo(dto.resumo());
        if (dto.instituicao() != null) protecao.setInstituicao(dto.instituicao());
        if (dto.natureza() != null) protecao.setNatureza(dto.natureza());
        if (dto.dataDeposito() != null) protecao.setDataDeposito(dto.dataDeposito());
        if (dto.infoExtra() != null) protecao.setInfoExtra(dto.infoExtra());
        if (dto.tipos() != null) protecao.setTipos(dto.tipos());
    }

    private void aplicarDadosTecnicos(Protecao protecao, ProtecaoUpdateDTO dto) {
        if (dto.area() != null) protecao.setArea(dto.area());
        if (dto.nivelMaturidade() != null) protecao.setNivelMaturidade(dto.nivelMaturidade());
        if (dto.aplicacao() != null) protecao.setAplicacao(dto.aplicacao());
        if (dto.status() != null) protecao.setStatus(dto.status());
        if (dto.inventores() != null) protecao.setInventores(dto.inventores());
        if (dto.titular() != null) protecao.setTitular(dto.titular());
        if (dto.diferencialTecnologico() != null) protecao.setDiferencialTecnologico(dto.diferencialTecnologico());
        if (dto.numeroProtocolo() != null) protecao.setNumeroProtocolo(dto.numeroProtocolo());
        if (dto.jogoId() != null) {
            if (protecao.getNatureza() != NaturezaProtecao.SOFTWARE &&
                    protecao.getNatureza() != NaturezaProtecao.DESENHO_INDUSTRIAL) {
                throw new BusinessException("Jogo só pode ser vinculado em proteções do tipo SOFTWARE ou DESENHO_INDUSTRIAL.");
            }
            Jogo jogo = jogoRepository.findById(dto.jogoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Jogo informado não encontrado."));
            protecao.setJogo(jogo);
        }
    }

    @Transactional
    public void deletar(Long id, Long usuarioId) {
        try {
            Protecao protecao = repository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Proteção não encontrada para exclusão."));

            ProtecaoResponseDTO retrato = toResponseDTO(protecao);

            repository.delete(protecao);
            indexador.removerIndex("protecoes", id);
            auditoriaService.registrarLog(
                    ENTIDADE_PROTECAO,
                    id,
                    AcaoAuditoria.DELECAO,
                    usuarioId,
                    retrato
            );

        } catch (Exception e) {
            throw new BusinessException("Erro interno ao deletar proteção");
        }
    }

    private ProtecaoResponseDTO toResponseDTO(Protecao protecao) {
        return new ProtecaoResponseDTO(
                protecao.getId(),
                protecao.getCodId(),
                protecao.getNome(),
                protecao.getResumo(),
                protecao.getInstituicao(),
                protecao.getNatureza(),
                protecao.getDataDeposito(),
                protecao.getInfoExtra(),
                protecao.getTipos(),
                protecao.getArea(),
                protecao.getNivelMaturidade(),
                protecao.getAplicacao(),
                protecao.getStatus(),
                protecao.getJogo() != null ? protecao.getJogo().getId() : null,
                protecao.getInventores(),
                protecao.getTitular(),
                protecao.getDiferencialTecnologico(),
                protecao.getNumeroProtocolo()
        );
    }

    @Transactional
    public void vincularJogo(Long protecaoId, Long jogoId, Long usuarioId) {
        try {
            Protecao protecao = repository.findById(protecaoId)
                    .orElseThrow(() -> new ResourceNotFoundException("Proteção não encontrada."));
            Jogo jogo = jogoRepository.findById(jogoId)
                    .orElseThrow(() -> new ResourceNotFoundException("Jogo não encontrado."));

            protecao.setJogo(jogo);
            repository.save(protecao);

            auditoriaService.registrarLog(
                    ENTIDADE_PROTECAO,
                    protecaoId,
                    AcaoAuditoria.VINCULO,
                    usuarioId,
                    "Jogo ID " + jogoId + " vinculado à proteção."
            );

        } catch (Exception e) {
            throw new BusinessException("Erro ao vincular jogo");
        }
    }

    @Transactional
    public void desvincularJogo(Long protecaoId, Long jogoId, Long usuarioId) {
        try {
            Protecao protecao = repository.findById(protecaoId)
                    .orElseThrow(() -> new ResourceNotFoundException("Proteção não encontrada."));

            if (protecao.getJogo() == null || !protecao.getJogo().getId().equals(jogoId)) {
                throw new BusinessException("Esta proteção não está vinculada a este jogo.");
            }

            protecao.setJogo(null);
            repository.save(protecao);

            auditoriaService.registrarLog(
                    ENTIDADE_PROTECAO,
                    protecaoId,
                    AcaoAuditoria.DESVINCULO,
                    usuarioId,
                    "Jogo ID " + jogoId + " desvinculado da proteção."
            );

        } catch (Exception e) {
            throw new BusinessException("Erro ao desvincular jogo");
        }
    }
}