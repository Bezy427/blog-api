package com.bezy.blogapi.controllers;

import com.bezy.blogapi.dtos.RegisterPostRequest;
import com.bezy.blogapi.entities.Post;
import com.bezy.blogapi.mappers.PostMapper;
import com.bezy.blogapi.repositories.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/posts")
public class PostController {
    private final PostRepository postRepository;
    private final PostMapper postMapper;


    @PostMapping
    public ResponseEntity<?> registerPost(
            @RequestBody RegisterPostRequest request
    ){
        Post post = new Post();
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setId(request.getId());
        post.setStatus(request.getStatus());
        post.setCreatedAt(request.getCreatedAt());
        post.setUpdatedAt(request.getUpdatedAt());
        post.setAuthor(request.getAuthor());
        postRepository.save(post);
        return ResponseEntity.ok("Post has been created!");
    }

    @GetMapping
    public Iterable<?> getAllPost(){
        return postRepository.findAll()
                .stream()
                .map(postMapper::toDto)
                .toList();
    }
}
