package com.bezy.blogapi.dtos;

import lombok.Data;

@Data
public class UpdateCategoryRequest {
    private String name;
    private String description;
}
