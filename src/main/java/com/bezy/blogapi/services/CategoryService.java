package com.bezy.blogapi.services;

import com.bezy.blogapi.dtos.RegisterCategoryRequest;
import com.bezy.blogapi.dtos.UpdateCategoryRequest;
import com.bezy.blogapi.entities.Category;
import com.bezy.blogapi.mappers.CategoryMapper;
import com.bezy.blogapi.mappers.ProfileMapper;
import com.bezy.blogapi.repositories.CategoryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private CategoryMapper categoryMapper;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public ResponseEntity<?> addCategory(
            @RequestBody RegisterCategoryRequest request
    ){
        Category category = new Category();
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setId(request.getId());
        categoryRepository.save(category);
        return ResponseEntity.ok().build();
    }

    public ResponseEntity<?> updateCategoryById(
            @PathVariable Long id,
            @RequestBody UpdateCategoryRequest request
    ){
        var category = categoryRepository.findById(id).orElse(null);
        if(category == null){
            return ResponseEntity.notFound().build();
        }
        categoryMapper.update(request, category);
        categoryRepository.save(category);
        return ResponseEntity.ok().build();
    }
}
