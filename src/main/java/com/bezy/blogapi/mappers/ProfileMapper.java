package com.bezy.blogapi.mappers;

import com.bezy.blogapi.dtos.ProfileDto;
import com.bezy.blogapi.dtos.RegisterProfileRequest;
import com.bezy.blogapi.dtos.UpdateProfileRequest;
import com.bezy.blogapi.entities.Profile;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ProfileMapper {
    ProfileDto toDto(Profile profile);
    Profile toEntity(RegisterProfileRequest request);
    void update(UpdateProfileRequest request, @MappingTarget Profile profile);
}
