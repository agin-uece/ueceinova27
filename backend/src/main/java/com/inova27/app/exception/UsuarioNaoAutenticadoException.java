package com.inova27.app.exception;

public class UsuarioNaoAutenticadoException extends RuntimeException {
    public UsuarioNaoAutenticadoException() {
        super("Usuário não autenticado.");
    }
}