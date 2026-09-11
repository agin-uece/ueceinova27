package com.inova27.app.service;

import com.inova27.app.dto.servico.*;
import com.inova27.app.mapper.DocumentoSemanticoMapper;
import com.inova27.app.model.AcaoAuditoria;
import com.inova27.app.model.Pessoa;
import com.inova27.app.model.Servico;
import com.inova27.app.repository.PessoaRepository;
import com.inova27.app.repository.ServicoRepository;
import com.inova27.app.specification.servico.ServicoSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServicoService {

    // 🔥 CONSTANTES CRIADAS PARA RESOLVER OS AVISOS DO SONARQUBE
    private static final String ENTIDADE_SERVICO = "Servico";
    private static final String MSG_SERVICO_NAO_ENCONTRADO = "Serviço não encontrado";

    private final ServicoRepository repository;
    private final PessoaRepository pessoaRepository;
    private final AuditoriaService auditoriaService;
    private final DocumentoSemanticoMapper mapper;
    private final IndexadorSemanticoService indexador;

    // 🔹 CREATE
    @Transactional
    public ServicoResponseDTO criar(ServicoCreateDTO dto, Long usuarioId) {

        Servico servico = new Servico();

        if (dto.prestadoresIds() != null && !dto.prestadoresIds().isEmpty()) {
            List<Pessoa> prestadoresEncontrados = pessoaRepository.findAllById(dto.prestadoresIds());
            servico.setPrestadores(new java.util.HashSet<>(prestadoresEncontrados));
        }

        servico.setAreaAtuacao(dto.areaAtuacao());
        servico.setDescricao(dto.descricao());
        servico.setContato(dto.contato());
        servico.setEmail(dto.email());
        servico.setTelefone(dto.telefone());

        Servico salvo = repository.save(servico);
        ServicoResponseDTO responseDTO = toResponseDTO(salvo);

        // 🛡️ AUDITORIA: Registro de Criação utilizando a constante
        auditoriaService.registrarLog(ENTIDADE_SERVICO, salvo.getId(), AcaoAuditoria.CRIACAO, usuarioId, responseDTO);

        // 🔥 Indexação Semântica
        var doc = mapper.fromServico(salvo);
        indexador.indexar(doc);

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
                .orElseThrow(() -> new IllegalArgumentException(MSG_SERVICO_NAO_ENCONTRADO));

        return toResponseDTO(servico);
    }

    // 🔹 UPDATE
    @Transactional
    public ServicoResponseDTO atualizar(Long id, ServicoUpdateDTO dto, Long usuarioId) {

        Servico servico = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(MSG_SERVICO_NAO_ENCONTRADO));

        if (dto.prestadoresIds() != null) {
            List<Pessoa> prestadoresEncontrados = pessoaRepository.findAllById(dto.prestadoresIds());
            servico.setPrestadores(new java.util.HashSet<>(prestadoresEncontrados));
        }

        if (dto.areaAtuacao() != null) servico.setAreaAtuacao(dto.areaAtuacao());
        if (dto.descricao() != null) servico.setDescricao(dto.descricao());
        if (dto.contato() != null) servico.setContato(dto.contato());
        if (dto.email() != null) servico.setEmail(dto.email());
        if (dto.telefone() != null) servico.setTelefone(dto.telefone());

        Servico atualizado = repository.save(servico);

        // 🔥 Re-indexação Semântica após atualização (Corrigido typo de "servicoes" para "servicos")
        indexador.removerIndex("servicos", id);
        var doc = mapper.fromServico(atualizado);
        indexador.indexar(doc);

        // 🛡️ AUDITORIA: Registro de Edição utilizando a constante
        auditoriaService.registrarLog(ENTIDADE_SERVICO, atualizado.getId(), AcaoAuditoria.EDICAO, usuarioId, dto);

        return toResponseDTO(atualizado);
    }

    // 🔹 DELETE
    @Transactional
    public void deletar(Long id, Long usuarioId) {
        Servico servico = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(MSG_SERVICO_NAO_ENCONTRADO));

        // 🛡️ AUDITORIA: "Tira a foto" do registro antes de apagá-lo
        ServicoResponseDTO retrato = toResponseDTO(servico);

        repository.delete(servico);

        // 🛡️ AUDITORIA: Salva o log de deleção utilizando a constante
        auditoriaService.registrarLog(ENTIDADE_SERVICO, id, AcaoAuditoria.DELECAO, usuarioId, retrato);

        indexador.removerIndex("servicos", id);

    }

    // 🔹 BUSCA COM FILTROS PAGINADA
    public Page<ServicoResponseDTO> buscarComFiltrosPaginado(ServicoFiltroDTO filtro, Pageable pageable) {

        Specification<Servico> specFinal = ServicoSpecification.comFiltros(filtro);

        return repository.findAll(specFinal, pageable).map(this::toResponseDTO);
    }

    // 🔹 MAPPER
    private ServicoResponseDTO toResponseDTO(Servico servico) {
        java.util.Set<String> nomesPrestadores = servico.getPrestadores().stream()
                .map(Pessoa::getNome)
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