package com.bezy.blogapi.repositories;

import com.bezy.blogapi.entities.Tag;
import com.bezy.blogapi.entities.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);

    Optional<User> findByUsername(@NotBlank(message = "Username is required!") String username);

    Optional<User> findByEmail(@NotBlank(message = "Email is required!") String email);

    @NotBlank(message = "Email is required!") String email(String email);
}