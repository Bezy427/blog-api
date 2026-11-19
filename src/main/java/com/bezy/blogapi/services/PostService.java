package com.bezy.blogapi.services;

import com.bezy.blogapi.dtos.RegisterPostRequest;
import com.bezy.blogapi.dtos.UpdatePostRequest;
import com.bezy.blogapi.entities.Post;
import com.bezy.blogapi.mappers.PostMapper;
import com.bezy.blogapi.repositories.PostRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class PostService {

    public ResponseEntity<?> createPost(
    ) {
        if (postRepository.findByTitle(request.getTitle()).isPresent()) {
        }
        Post post = new Post();
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setStatus(request.getStatus());
    }

    public ResponseEntity<?> updatePostById(
    ) {
        var post = postRepository.findById(id).orElse(null);
        if (post == null) {
            return ResponseEntity.notFound().build();
        }
        postMapper.update(request, post);

    }

    public Iterable<?> getAllPosts() {
        return postRepository.findAll()
                .stream()
                .toList();
    }

        var post = postRepository.findById(id).orElse(null);
        if (post == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(postMapper.toDto(post));
    }
}
