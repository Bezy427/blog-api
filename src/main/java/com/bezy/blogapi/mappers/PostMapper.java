package com.bezy.blogapi.mappers;

import com.bezy.blogapi.dtos.PostDto;
import com.bezy.blogapi.dtos.RegisterPostRequest;
import com.bezy.blogapi.dtos.UpdatePostRequest;
import com.bezy.blogapi.entities.Post;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PostMapper {
    PostDto toDto(Post post);
    Post toEntity(RegisterPostRequest request);
    void update(UpdatePostRequest request, @MappingTarget Post post);
}
