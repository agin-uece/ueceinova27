package com.inova27.app.service;

import com.inova27.app.exception.ResourceNotFoundException;
import com.inova27.app.dto.servico.*;
import com.inova27.app.mapper.DocumentoSemanticoMapper;
import com.inova27.app.model.AcaoAuditoria;
import com.inova27.app.model.Laboratorio;
import com.inova27.app.model.Servico;
import com.inova27.app.repository.LaboratorioRepository;
import com.inova27.app.repository.ServicoRepository;
import com.inova27.app.specification.servico.ServicoSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServicoService {

    private static final String ENTIDADE_SERVICO = "Servico";
    private static final String MSG_SERVICO_NAO_ENCONTRADO = "Serviço não encontrado";

    private final ServicoRepository repository;
    private final LaboratorioRepository laboratorioRepository;
    private final AuditoriaService auditoriaService;
    private final DocumentoSemanticoMapper mapper;
    private final IndexadorSemanticoService indexador;

    // 🔹 CREATE
    @Transactional
    public ServicoResponseDTO criar(ServicoCreateDTO dto, Long usuarioId) {
        Set<Long> prestadoresIds = dto.prestadoresIds() != null
                ? new HashSet<>(dto.prestadoresIds())
                : Collections.emptySet();

        validarDuplicidade(
                null,
                dto.areaAtuacao(),
                dto.descricao(),
                dto.contato(),
                dto.email(),
                dto.telefone(),
                prestadoresIds
        );

        Servico servico = new Servico();

        if (dto.prestadoresIds() != null && !dto.prestadoresIds().isEmpty()) {
            List<Laboratorio> prestadoresEncontrados = laboratorioRepository.findAllById(dto.prestadoresIds());
            servico.setPrestadores(new HashSet<>(prestadoresEncontrados));
        }

        servico.setAreaAtuacao(dto.areaAtuacao());
        servico.setDescricao(dto.descricao());
        servico.setContato(dto.contato());
        servico.setEmail(dto.email());
        servico.setTelefone(dto.telefone());

        Servico salvo = repository.save(servico);
        ServicoResponseDTO responseDTO = toResponseDTO(salvo);

        auditoriaService.registrarLog(ENTIDADE_SERVICO, salvo.getId(), AcaoAuditoria.CRIACAO, usuarioId, responseDTO);

        var doc = mapper.fromServico(salvo);
        indexador.agendarIndexacao(doc);

        return responseDTO;
    }

    // 🔹 READ ALL
    @Transactional(readOnly = true)
    public List<ServicoResponseDTO> listarTodos() {
        return repository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    // 🔹 READ BY ID
    @Transactional(readOnly = true)
    public ServicoResponseDTO buscarPorId(Long id) {
        Servico servico = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(MSG_SERVICO_NAO_ENCONTRADO));

        return toResponseDTO(servico);
    }

    // 🔹 UPDATE
    @Transactional
    public ServicoResponseDTO atualizar(Long id, ServicoUpdateDTO dto, Long usuarioId) {
        Servico servico = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(MSG_SERVICO_NAO_ENCONTRADO));

        String novaArea = dto.areaAtuacao() != null ? dto.areaAtuacao() : servico.getAreaAtuacao();
        String novaDescricao = dto.descricao() != null ? dto.descricao() : servico.getDescricao();
        String novoContato = dto.contato() != null ? dto.contato() : servico.getContato();
        String novoEmail = dto.email() != null ? dto.email() : servico.getEmail();
        String novoTelefone = dto.telefone() != null ? dto.telefone() : servico.getTelefone();

        Set<Long> novosPrestadoresIds = dto.prestadoresIds() != null
                ? new HashSet<>(dto.prestadoresIds())
                : servico.getPrestadores().stream().map(Laboratorio::getId).collect(Collectors.toSet());

        validarDuplicidade(id, novaArea, novaDescricao, novoContato, novoEmail, novoTelefone, novosPrestadoresIds);

        if (dto.prestadoresIds() != null) {
            List<Laboratorio> prestadoresEncontrados = laboratorioRepository.findAllById(dto.prestadoresIds());
            servico.setPrestadores(new HashSet<>(prestadoresEncontrados));
        }

        if (dto.areaAtuacao() != null) servico.setAreaAtuacao(dto.areaAtuacao());
        if (dto.descricao() != null) servico.setDescricao(dto.descricao());
        if (dto.contato() != null) servico.setContato(dto.contato());
        if (dto.email() != null) servico.setEmail(dto.email());
        if (dto.telefone() != null) servico.setTelefone(dto.telefone());

        Servico atualizado = repository.save(servico);

        var doc = mapper.fromServico(atualizado);
        indexador.agendarIndexacao(doc);

        auditoriaService.registrarLog(ENTIDADE_SERVICO, atualizado.getId(), AcaoAuditoria.EDICAO, usuarioId, dto);

        return toResponseDTO(atualizado);
    }

    // 🔹 DELETE
    @Transactional
    public void deletar(Long id, Long usuarioId) {
        Servico servico = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(MSG_SERVICO_NAO_ENCONTRADO));

        ServicoResponseDTO retrato = toResponseDTO(servico);

        repository.delete(servico);

        auditoriaService.registrarLog(ENTIDADE_SERVICO, id, AcaoAuditoria.DELECAO, usuarioId, retrato);
        indexador.removerIndex("servicos", id);
    }

    // 🔹 BUSCA COM FILTROS PAGINADA
    public Page<ServicoResponseDTO> buscarComFiltrosPaginado(ServicoFiltroDTO filtro, Pageable pageable) {
        Specification<Servico> specFinal = ServicoSpecification.comFiltros(filtro);
        return repository.findAll(specFinal, pageable).map(this::toResponseDTO);
    }

    private void validarDuplicidade(
            Long idIgnorado,
            String areaAtuacao,
            String descricao,
            String contato,
            String email,
            String telefone,
            Set<Long> prestadoresIdsNovo) {

        List<Servico> candidatos = repository.findCandidatosDuplicados(
                areaAtuacao, descricao, contato, email, telefone
        );

        Set<Long> idsNovo = prestadoresIdsNovo != null
                ? prestadoresIdsNovo
                : Collections.emptySet();

        boolean existeDuplicado = candidatos.stream()
                .filter(s -> idIgnorado == null || !s.getId().equals(idIgnorado))
                .anyMatch(s -> {
                    Set<Long> idsExistente = s.getPrestadores().stream()
                            .map(Laboratorio::getId)
                            .collect(Collectors.toSet());
                    return idsExistente.equals(idsNovo);
                });

        if (existeDuplicado) {
            throw new IllegalArgumentException("Já existe um serviço cadastrado com essas mesmas informações.");
        }
    }

    // 🔹 MAPPER
    private ServicoResponseDTO toResponseDTO(Servico servico) {
        Set<String> nomesPrestadores = servico.getPrestadores().stream()
                .map(Laboratorio::getNome)
                .collect(Collectors.toSet());

        return new ServicoResponseDTO(
                servico.getId(),
                nomesPrestadores,
                servico.getAreaAtuacao(),
                servico.getDescricao(),
                servico.getContato(),
                servico.getEmail(),
                servico.getTelefone()
        );
    }
}