package com.inova27.app.controller;

import com.inova27.app.dto.buscasemantica.BuscaResultadoDTO;
import com.inova27.app.service.BuscaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/busca")
@RequiredArgsConstructor
public class BuscaController {

    private final BuscaService service;

    @GetMapping
    public List<BuscaResultadoDTO> buscar(@RequestParam String q) {
        return service.buscar(q);
    }
}