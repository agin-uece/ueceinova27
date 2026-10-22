package com.inova27.app.config;

import com.inova27.app.model.Usuario;
import com.inova27.app.model.UserRole;
import com.inova27.app.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminInitializer {

    @Bean
    CommandLineRunner criarAdmin(UsuarioRepository repository,
                                 PasswordEncoder passwordEncoder,
                                 @Value("${app.admin.email:inova.27.uece@gmail.com}") String email,
                                 @Value("${app.admin.senha:145236}") String senha) {
        return args -> {
            if (repository.findByEmail(email).isEmpty()) {
                Usuario admin = new Usuario();
                admin.setNome("Administrador");
                admin.setEmail(email);
                admin.setSenha(passwordEncoder.encode(senha));
                admin.setRole(UserRole.ADMIN);
                admin.setValidado(true);
                admin.setAtivo(true);
                repository.save(admin);
            }
        };
    }
}