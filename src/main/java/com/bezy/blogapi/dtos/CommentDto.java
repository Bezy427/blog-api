
package com.bezy.blogapi.dtos;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CommentDto {
    private Long id;
    private String text;
    private LocalDateTime createdAt;
    private String username;
}
