package com.bezy.blogapi.dtos;

import lombok.Data;

@Data
public class UpdateCommentRequest {
    private String text;
    private String posts;
}
