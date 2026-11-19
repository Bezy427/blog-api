
package com.bezy.blogapi.controllers;

import com.bezy.blogapi.dtos.RegisterPostRequest;
import com.bezy.blogapi.dtos.UpdatePostRequest;
import com.bezy.blogapi.services.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    @PostMapping
    public ResponseEntity<?> registerPost(
            @Valid @RequestBody RegisterPostRequest request,
            Authentication authentication
    ) {
        return postService.createPost(request, authentication);
    }

    @GetMapping
    public ResponseEntity<?> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPostById(
            @PathVariable Long id
    ) {
        return postService.getPostById(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePostRequest request
    ) {
        return postService.updatePostById(id, request);
    }
}
