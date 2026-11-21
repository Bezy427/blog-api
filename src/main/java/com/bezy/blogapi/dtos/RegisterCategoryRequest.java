package com.bezy.blogapi.dtos;

import lombok.Data;

@Data
public class RegisterCategoryRequest {
    private Long id;
    private String name;
    private String description;
}
