package com.inova27.app.repository;

import com.inova27.app.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    List<Usuario> findByValidadoFalse();
    Optional<Usuario> findByIdAndValidadoFalse(Long id);
    boolean existsByEmail(String email);
    Optional<Usuario> findByEmailSecundario(String emailSecundario);
    Optional<Usuario> findByTokenPrimeiroAcesso(String token);

}
