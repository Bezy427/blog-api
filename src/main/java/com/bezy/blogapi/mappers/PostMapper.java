
package com.bezy.blogapi.mappers;

import com.bezy.blogapi.dtos.PostDto;
import com.bezy.blogapi.dtos.UpdatePostRequest;
import com.bezy.blogapi.entities.Post;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(
        componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface PostMapper {

    @Mapping(target = "author", source = "author.username")
    PostDto toDto(Post post);

    @Mapping(target = "author", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void update(
            UpdatePostRequest request,
            @MappingTarget Post post
    );
}
