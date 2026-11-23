
package com.bezy.blogapi.mappers;

import com.bezy.blogapi.dtos.ProfileDto;
import com.bezy.blogapi.entities.Profile;
import org.mapstruct.Mapper;

@Mapper(
        componentModel = "spring",
        uses = UserMapper.class
)
public interface ProfileMapper {

    ProfileDto toDto(Profile profile);
}
