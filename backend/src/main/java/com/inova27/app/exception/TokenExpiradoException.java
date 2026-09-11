package com.inova27.app.exception;

public class TokenExpiradoException extends RuntimeException {

    public TokenExpiradoException() {
        super("Token expirado");
    }

    public TokenExpiradoException(String message) {
        super(message);
    }
}
