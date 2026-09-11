package com.inova27.app.exception;

public class TokenInvalidoException extends RuntimeException {

    public TokenInvalidoException() {
        super("Token inválido");
    }
}
