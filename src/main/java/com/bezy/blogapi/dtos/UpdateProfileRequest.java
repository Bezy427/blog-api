
package com.bezy.blogapi.dtos;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileRequest {

    @Size(max = 500, message = "Bio cannot exceed 500 characters!")
    private String bio;
}
