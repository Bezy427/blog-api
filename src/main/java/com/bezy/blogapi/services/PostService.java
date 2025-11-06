package com.bezy.blogapi.services;

import com.bezy.blogapi.dtos.PostDto;
import com.bezy.blogapi.dtos.RegisterPostRequest;
import com.bezy.blogapi.dtos.UpdatePostRequest;
import com.bezy.blogapi.entities.Post;
import com.bezy.blogapi.mappers.PostMapper;
import com.bezy.blogapi.mappers.ProfileMapper;
import com.bezy.blogapi.repositories.PostRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

@AllArgsConstructor
@Service
public class PostService {
    private PostRepository postRepository;
    private PostMapper postMapper;

    public ResponseEntity<?> createPost(
            @RequestBody RegisterPostRequest request
    ){
        if(postRepository.findByTitle(request.getTitle()).isPresent()){
            return ResponseEntity.badRequest().build();
        }
        Post post = new Post();
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setAuthor(request.getAuthor());
        post.setCreatedAt(request.getCreatedAt());
        post.setUpdatedAt(request.getUpdatedAt());
        post.setStatus(request.getStatus());
        post.setId(request.getId());
        postRepository.save(post);
        return ResponseEntity.ok("Post has been created!");
    }

    public ResponseEntity<?> updatePostById(
            @PathVariable Long id,
            @RequestBody UpdatePostRequest request
    ){
        var post = postRepository.findById(id).orElse(null);
        if(post == null){
            return ResponseEntity.notFound().build();
        }
        postMapper.update(request, post);
        postRepository.save(post);
        return ResponseEntity.ok("Post has been updated!");

    }

    public Iterable<?> getAllPosts(){
        return postRepository.findAll()
                .stream()
                .map(post -> postMapper.toDto(post))
                .toList();
    }

    public ResponseEntity<?> getPostById(
            @PathVariable Long id
    ){
        var post = postRepository.findById(id).orElse(null);
        if(post == null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(postMapper.toDto(post));
    }
}
