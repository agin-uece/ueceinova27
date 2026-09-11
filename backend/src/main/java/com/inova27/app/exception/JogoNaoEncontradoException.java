package com.inova27.app.exception;


public class JogoNaoEncontradoException extends RuntimeException {
    public JogoNaoEncontradoException() {
        super("Jogo não encontrado.");
    }

    public JogoNaoEncontradoException(Long id) {
        super("Jogo não encontrado com o ID: " + id);
    }
}