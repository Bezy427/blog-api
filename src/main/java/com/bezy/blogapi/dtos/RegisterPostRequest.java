package com.bezy.blogapi.dtos;

import com.bezy.blogapi.entities.Status;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterPostRequest {

    @NotBlank(message = "Title is required!")
    private String title;

    @NotBlank(message = "Content is required!")
    private String content;

    private Status status;
}
