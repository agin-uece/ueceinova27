package com.inova27.app.service;

import com.inova27.app.dto.startup.StartupCreateDTO;
import com.inova27.app.dto.startup.StartupFiltroDTO;
import com.inova27.app.dto.startup.StartupResponseDTO;
import com.inova27.app.dto.startup.StartupUpdateDTO;
import com.inova27.app.exception.BusinessException;
import com.inova27.app.mapper.DocumentoSemanticoMapper;
import com.inova27.app.model.AcaoAuditoria;
import com.inova27.app.model.Pessoa;
import com.inova27.app.model.Startup;
import com.inova27.app.repository.PessoaRepository;
import com.inova27.app.repository.StartupRepository;
import com.inova27.app.specification.startup.StartupSpecification;
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
public class StartupService {

    // 🔥 CONSTANTES CRIADAS PARA RESOLVER OS AVISOS DO SONARQUBE
    private static final String ENTIDADE_STARTUP = "Startup";
    private static final String MSG_STARTUP_NAO_ENCONTRADA = "Startup não encontrada";

    private final StartupRepository repository;
    private final PessoaRepository pessoaRepository;
    private final DocumentoSemanticoMapper mapper;
    private final IndexadorSemanticoService indexador;
    private final AuditoriaService auditoriaService;

    // 🔹 BUSCA COM FILTROS PAGINADA
    public Page<StartupResponseDTO> buscarComFiltrosPaginado(StartupFiltroDTO filtro, Pageable pageable) {
        Specification<Startup> specFinal = StartupSpecification.comFiltros(filtro);
        return repository.findAll(specFinal, pageable).map(this::toResponseDTO);
    }

    // 🔹 CREATE
    @Transactional
    public StartupResponseDTO criar(StartupCreateDTO dto, Long usuarioId) {
        try {
            if (dto.nome() == null || dto.nome().isBlank()) {
                throw new IllegalArgumentException("O nome da startup é obrigatório.");
            }
            if (repository.existsByNome(dto.nome())) {
                throw new IllegalArgumentException("Já existe uma startup cadastrada com este nome.");
            }

            Startup startup = new Startup();
            startup.setNome(dto.nome());
            startup.setDescricao(dto.descricao());
            startup.setArea(dto.area());
            startup.setDataFundacao(dto.dataFundacao());
            startup.setSite(dto.site());
            startup.setEmail(dto.email());
            startup.setTelefone(dto.telefone());
            startup.setLogo(dto.logo());
            startup.setStatus(dto.status());
            startup.setUserInclusaoId(usuarioId);
            startup.setInstagram(dto.instagram());
            startup.setCnpj(dto.cnpj());

            if (dto.fotos() != null) {
                startup.setFotos(new HashSet<>(dto.fotos()));
            }

            Startup salvo = repository.save(startup);

            // Indexação semântica
            var doc = mapper.fromStartup(salvo);
            indexador.indexar(doc);

            StartupResponseDTO responseDTO = toResponseDTO(salvo);

            // 🛡️ AUDITORIA: Registro de Criação utilizando a constante
            auditoriaService.registrarLog(ENTIDADE_STARTUP, salvo.getId(), AcaoAuditoria.CRIACAO, usuarioId, responseDTO);

            return responseDTO;

        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException("Erro interno ao criar startup: ");
        }
    }

    // 🔹 READ ALL
    public List<StartupResponseDTO> listarTodas() {
        try {
            return repository.findAll()
                    .stream()
                    .map(this::toResponseDTO)
                    .toList();
        } catch (Exception e) {
            throw new BusinessException("Erro ao buscar a lista de startups: ");
        }
    }

    // 🔹 READ BY ID
    public StartupResponseDTO buscarPorId(Long id) {
        try {
            Startup startup = repository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException(MSG_STARTUP_NAO_ENCONTRADA + " com o ID: " + id));
            return toResponseDTO(startup);
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException("Erro interno ao buscar startup: ");
        }
    }

    // 🔹 UPDATE
    @Transactional
    public StartupResponseDTO atualizar(Long id, StartupUpdateDTO dto, Long usuarioId) {
        try {
            Startup startup = repository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException(MSG_STARTUP_NAO_ENCONTRADA + " para atualização."));

            if (dto.nome() != null && !dto.nome().isBlank()) startup.setNome(dto.nome());
            if (dto.descricao() != null) startup.setDescricao(dto.descricao());
            if (dto.area() != null) startup.setArea(dto.area());
            if (dto.dataFundacao() != null) startup.setDataFundacao(dto.dataFundacao());
            if (dto.site() != null) startup.setSite(dto.site());
            if (dto.email() != null) startup.setEmail(dto.email());
            if (dto.telefone() != null) startup.setTelefone(dto.telefone());
            if (dto.logo() != null) startup.setLogo(dto.logo());
            if (dto.status() != null) startup.setStatus(dto.status());
            if (dto.cnpj() != null) startup.setCnpj(dto.cnpj());
            if (dto.instagram() != null) startup.setInstagram(dto.instagram());

            if (dto.fotos() != null) {
                startup.getFotos().clear();
                startup.getFotos().addAll(dto.fotos());
            }

            Startup atualizada = repository.save(startup);
            // 🔥 ATUALIZAÇÃO SEMÂNTICA (Remove o antigo e cria o novo com os dados atualizados)
            indexador.removerIndex("startups", id);
            var doc = mapper.fromStartup(atualizada);
            indexador.indexar(doc);
            // 🛡️ AUDITORIA: Registro de Edição utilizando a constante
            auditoriaService.registrarLog(ENTIDADE_STARTUP, atualizada.getId(), AcaoAuditoria.EDICAO, usuarioId, dto);
            return toResponseDTO(atualizada);

        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException("Erro interno ao atualizar startup: ");
        }
    }

    // 🔹 DELETE
    @Transactional
    public void deletar(Long id, Long usuarioId) {
        try {
            Startup startup = repository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException(MSG_STARTUP_NAO_ENCONTRADA + " para exclusão."));

            // 🛡️ AUDITORIA: "Tira a foto" do registro antes de apagá-lo
            StartupResponseDTO retrato = toResponseDTO(startup);

            // Como Pessoa é o lado dono, precisamos limpar as referências antes de deletar a Startup
            startup.getPessoas().forEach(p -> p.getStartups().remove(startup));

            repository.delete(startup);

            // 🛡️ AUDITORIA: Salva o log de deleção utilizando a constante
            auditoriaService.registrarLog(ENTIDADE_STARTUP, id, AcaoAuditoria.DELECAO, usuarioId, retrato);
            indexador.removerIndex("startups", id);

        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException("Erro interno ao deletar startup: ");
        }
    }

    // 🔹 MAPPER
    private StartupResponseDTO toResponseDTO(Startup startup) {
        // 🔥 Agora utilizando o getNome() da entidade Pessoa que já conhecemos
        Set<String> pessoasStrings = startup.getPessoas() == null ? new HashSet<>() :
                startup.getPessoas().stream().map(Pessoa::getNome).collect(Collectors.toSet());

        return new StartupResponseDTO(
                startup.getId(),
                startup.getNome(),
                startup.getDescricao(),
                startup.getArea(),
                startup.getDataFundacao(),
                startup.getSite(),
                startup.getEmail(),
                startup.getTelefone(),
                startup.getLogo(),
                startup.getStatus(),
                startup.getFotos(),
                pessoasStrings,startup.getCnpj(),startup.getInstagram()
        );
    }
}