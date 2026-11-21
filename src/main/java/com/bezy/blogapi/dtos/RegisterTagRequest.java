package com.bezy.blogapi.dtos;

import com.bezy.blogapi.entities.Post;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegisterTagRequest {
    private Long id;

    @NotNull(message = "Name must be provided!")
    private String name;


    private Post posts;
}
