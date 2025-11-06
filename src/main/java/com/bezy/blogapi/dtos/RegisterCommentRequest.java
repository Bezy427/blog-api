package com.bezy.blogapi.dtos;

import com.bezy.blogapi.entities.User;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RegisterCommentRequest {
    private Long id;
    private String text;
    private LocalDateTime createdAt;
    private String posts;
    private User user;
}
