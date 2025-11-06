package com.bezy.blogapi.dtos;

import com.bezy.blogapi.entities.Status;
import com.bezy.blogapi.entities.User;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NonNull;

import java.time.Instant;

@Data
public class RegisterPostRequest {
    private Long id;

    @NotBlank(message = "Title is required!")
    private String title;

    @NotBlank(message = "Content is required!")
    private String content;

    @NotBlank(message = "Status is required!")
    private Status status;

    private Instant createdAt;
    private Instant updatedAt;
    private String author;
}
