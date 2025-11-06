package com.bezy.blogapi.dtos;

import com.bezy.blogapi.entities.User;
import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String bio;
    private User user;
}
