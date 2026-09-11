package com.inova27.app.model;

import lombok.Getter;

@Getter
public enum UserRole {
    ADMIN("ADMIN"),
    PROFESSOR("PROFESSOR");

    private String role;

    UserRole(String role) {
        this.role = role;
    }

}
