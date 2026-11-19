package com.bezy.blogapi.dtos;

import lombok.Data;

@Data
public class RegisterUserRequest {

    @NotBlank(message = "Username is required!")
    private String username;

    @NotBlank(message = "Password is required!")
    private String password;

    private String confirmPassword;

    @Email(message = "Email must be valid!")
    private String email;
}
