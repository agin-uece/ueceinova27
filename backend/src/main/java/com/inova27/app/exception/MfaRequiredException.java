package com.inova27.app.exception;

public class MfaRequiredException extends RuntimeException {

    private final Long usuarioId;
    private final String email;

    public MfaRequiredException(Long usuarioId, String email) {
        this.usuarioId = usuarioId;
        this.email = email;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public String getEmail() {
        return email;
    }
}