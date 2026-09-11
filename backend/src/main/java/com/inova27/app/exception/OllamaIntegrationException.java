package com.inova27.app.exception;


public class OllamaIntegrationException extends RuntimeException {

    public OllamaIntegrationException(String message) {
        super(message);
    }

    public OllamaIntegrationException(String message, Throwable cause) {
        super(message, cause);
    }
}