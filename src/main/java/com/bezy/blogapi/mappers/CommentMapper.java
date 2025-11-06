package com.bezy.blogapi.mappers;

import com.bezy.blogapi.dtos.CommentDto;
import com.bezy.blogapi.dtos.UpdateCommentRequest;
import com.bezy.blogapi.entities.Comment;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CommentMapper {
    CommentDto toDto(Comment comment);
    void update(UpdateCommentRequest request, @MappingTarget Comment comment);
}
