package com.inova27.app.exception;

/** Valor que precisa ser único já está em uso por outro registro (HTTP 409). */
public class ConflitoException extends RuntimeException {
    public ConflitoException(String mensagem) {
        super(mensagem);
    }
}
