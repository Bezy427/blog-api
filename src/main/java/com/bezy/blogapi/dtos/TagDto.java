package com.bezy.blogapi.dtos;

import com.bezy.blogapi.entities.Post;
import lombok.Data;

@Data
public class TagDto {
    private Long id;
    private String name;
    private Post posts;
}
