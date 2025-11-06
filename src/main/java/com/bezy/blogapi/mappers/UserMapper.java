package com.bezy.blogapi.mappers;

import com.bezy.blogapi.dtos.RegisterUserRequest;
import com.bezy.blogapi.dtos.UpdateUserRequest;
import com.bezy.blogapi.dtos.UserDto;
import com.bezy.blogapi.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDto toDto(User user);
    User toEntity(RegisterUserRequest request);
    void update(UpdateUserRequest request, @MappingTarget User user);
}
