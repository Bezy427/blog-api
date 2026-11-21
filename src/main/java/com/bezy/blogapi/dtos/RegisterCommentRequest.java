
package com.bezy.blogapi.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegisterCommentRequest {

    @NotBlank(message = "Comment text is required!")
    private String text;

    @NotNull(message = "Post ID is required!")
    private Long postId;
}
