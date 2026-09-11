package com.inova27.app.security;

import com.inova27.app.exception.MfaInvalidoException;
import com.inova27.app.exception.MfaRequiredException;
import com.inova27.app.exception.UsuarioNaoAutenticadoException;
import com.inova27.app.model.UserRole;
import com.inova27.app.model.Usuario;
import com.inova27.app.service.MfaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MfaGuard {

    private final MfaService mfaService;

    public void check(Usuario user, String pin) {

        if (user == null) {
            throw new UsuarioNaoAutenticadoException();
        }

        // 🔓 Só exige MFA para ADMIN
        if (user.getRole() != UserRole.ADMIN) {
            return;
        }

        if (pin == null || pin.isBlank()) {
            throw new MfaRequiredException(user.getId(), user.getEmail());
        }

        if (!mfaService.validarCodigoMfa(user.getId(), pin)) {
            throw new MfaInvalidoException();
        }
    }
}