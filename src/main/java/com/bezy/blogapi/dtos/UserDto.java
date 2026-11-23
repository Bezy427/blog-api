
package com.bezy.blogapi.dtos;

import com.bezy.blogapi.entities.Role;
import lombok.Data;

import java.time.Instant;

@Data
public class UserDto {

    private Long id;

    private String username;

    private String email;

    private Role role;

    private Instant createdAt;
}
