package com.inova27.app.exception;


public class EngineNaoEncontradaException extends RuntimeException {
    public EngineNaoEncontradaException(Long id) {
        super("Engine não encontrada com o ID: " + id);
    }

    public EngineNaoEncontradaException() {
        super("Engine não encontrada.");
    }
}