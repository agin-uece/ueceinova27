package com.inova27.app.exception;


public class MfaInvalidoException extends RuntimeException {
    public MfaInvalidoException() {
        super("Código de segurança inválido.");
    }
}