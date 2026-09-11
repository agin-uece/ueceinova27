package com.inova27.app.exception;


public class JogoJaExisteException extends RuntimeException {
    public JogoJaExisteException(String nome) {
        super("Já existe um jogo com o nome: " + nome);
    }
}