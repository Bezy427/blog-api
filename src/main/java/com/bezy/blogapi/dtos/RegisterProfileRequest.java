package com.bezy.blogapi.dtos;

import com.bezy.blogapi.entities.User;
import lombok.Data;

@Data
public class RegisterProfileRequest {
    private Long id;
    private User user;
    private String bio;
}
