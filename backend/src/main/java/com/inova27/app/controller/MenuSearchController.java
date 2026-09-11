package com.inova27.app.controller;

import com.inova27.app.dto.buscapages.MenuRouteDTO;
import com.inova27.app.service.MenuSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/menu")
@RequiredArgsConstructor
public class MenuSearchController {

    private final MenuSearchService menuSearchService;

    @GetMapping("/permitidas")
    public ResponseEntity<List<MenuRouteDTO>> getRotasPermitidas(Authentication authentication) {
        List<MenuRouteDTO> rotas = menuSearchService.buscarRotasPermitidas(authentication);
        return ResponseEntity.ok(rotas);
    }
}