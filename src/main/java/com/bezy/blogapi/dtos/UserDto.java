package com.bezy.blogapi.dtos;

import com.bezy.blogapi.entities.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.Instant;
import java.time.LocalDateTime;

@Data
public class UserDto {
    private Long id;

    @NotBlank(message = "Username is reqiured!")
    private String username;

    @NotBlank(message = "Password is required!")
    private String password;

    @NotBlank(message = "Confirm password is required!")
    private String confirmPassword;

    @Email
    @NotBlank(message = "Email is required!")
    private String email;

    private Role role;

    private Instant createdAt;
}
