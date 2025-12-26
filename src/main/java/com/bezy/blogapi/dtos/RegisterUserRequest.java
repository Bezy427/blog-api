package com.bezy.blogapi.dtos;

import com.bezy.blogapi.entities.Role;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NonNull;

import java.time.Instant;
import java.time.LocalDateTime;

@Data
public class RegisterUserRequest {
    private Long id;

    @NotBlank(message = "Username is required!")
    @Pattern(regexp="^[\\w\\s-]+$]")
    private String username;

    @NotBlank(message = "Password is required!")
    @Min(value=4, message = "Password must be greater than or equal to 5!")
    @Max(value=10, message = "Password must be less than or equal to 10!")
    private String password;

    @NotBlank(message = "Confirm password is required")
    private String confirmPassword;

    @AssertTrue(message = "Passwords do not match")
    public boolean isPasswordsMatching() {
        return password != null && password.equals(confirmPassword);
    }

    @Email(message = "Email must be valid!")
    @NotBlank(message = "Email is required!")
    private String email;

    private Role role;
    private Instant createdAt;
}
