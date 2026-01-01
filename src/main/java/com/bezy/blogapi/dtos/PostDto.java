package com.bezy.blogapi.dtos;

import com.bezy.blogapi.entities.Status;
import lombok.Data;

import java.time.Instant;

@Data
public class PostDto {
    private String title;
    private Long id;
    private String content;
    private Status status;
    private String author;
    private Instant createdAt;
    private Instant updatedAt;
}
