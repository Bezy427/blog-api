package com.bezy.blogapi.mappers;

import com.bezy.blogapi.dtos.TagDto;
import com.bezy.blogapi.dtos.UpdateTagRequest;
import com.bezy.blogapi.entities.Tag;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface TagMapper {
    TagDto toDto(Tag tag);
    void update(UpdateTagRequest request, @MappingTarget Tag tag);
}
