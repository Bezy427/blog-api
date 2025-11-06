package com.bezy.blogapi.mappers;

import com.bezy.blogapi.dtos.CategoryDto;
import com.bezy.blogapi.dtos.RegisterCategoryRequest;
import com.bezy.blogapi.dtos.UpdateCategoryRequest;
import com.bezy.blogapi.entities.Category;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryDto toDto(Category category);
    void update(UpdateCategoryRequest request, @MappingTarget Category category);
}
