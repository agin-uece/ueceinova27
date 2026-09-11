package com.inova27.app.exception;

public class EngineJaExisteException extends RuntimeException {
    public EngineJaExisteException(String nome) {
        super("Já existe uma engine cadastrada com o nome: " + nome);
    }
}