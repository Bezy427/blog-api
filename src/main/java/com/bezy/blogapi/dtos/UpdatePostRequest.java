package com.bezy.blogapi.dtos;

import com.bezy.blogapi.entities.Status;
import lombok.Data;

@Data
public class UpdatePostRequest {
    private String title;
    private String content;
    private String author;
    private Status status;
}
