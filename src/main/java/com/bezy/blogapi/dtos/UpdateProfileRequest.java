package com.bezy.blogapi.dtos;

import com.bezy.blogapi.entities.User;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateProfileRequest {
    @NotNull(message = "Bio must be provided!")
    @Min(value = 100, message="Bio must be greater than equal to 100!")
    @Max(value = 500, message = "Bio must be less than or equal to 500!")
    private String bio;

    private User user;
}
