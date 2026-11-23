
package com.bezy.blogapi.dtos;

import lombok.Data;

@Data
public class ProfileDto {

    private Long id;

    private UserDto user;

    private String bio;

    private String avatarUrl;

    private String avatarFileId;
}
