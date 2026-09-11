package com.inova27.app.exception;

public class EmailEnvioException extends RuntimeException {

    public EmailEnvioException(String mensagem) {
        super(mensagem);
    }

    public EmailEnvioException(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
}