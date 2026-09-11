package com.inova27.app.exception;

public class EngineServiceException extends RuntimeException {
    public EngineServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}