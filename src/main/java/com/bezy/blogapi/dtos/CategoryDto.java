package com.bezy.blogapi.dtos;

import lombok.Data;

@Data
public class CategoryDto {
    private Long id;
    private String name;
    private String description;
}
