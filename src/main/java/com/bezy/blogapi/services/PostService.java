
package com.bezy.blogapi.services;

import com.bezy.blogapi.dtos.PostDto;
import com.bezy.blogapi.dtos.RegisterPostRequest;
import com.bezy.blogapi.dtos.UpdatePostRequest;
import com.bezy.blogapi.entities.Post;
import com.bezy.blogapi.mappers.PostMapper;
import com.bezy.blogapi.repositories.PostRepository;
import com.bezy.blogapi.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final PostMapper postMapper;

    public ResponseEntity<?> createPost(
            RegisterPostRequest request,
            Authentication authentication
    ) {

        if (postRepository.findByTitle(request.getTitle()).isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("A post with this title already exists.");
        }

        Long userId = Long.parseLong(authentication.getName());

        var user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Authenticated user was not found.");
        }

        Post post = new Post();
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setStatus(request.getStatus());
        post.setAuthor(user);

        Post savedPost = postRepository.save(post);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(postMapper.toDto(savedPost));
    }

    public ResponseEntity<?> updatePostById(
            Long id,
            UpdatePostRequest request
    ) {

        var post = postRepository.findById(id).orElse(null);

        if (post == null) {
            return ResponseEntity.notFound().build();
        }

        postMapper.update(request, post);

        Post updatedPost = postRepository.save(post);

        return ResponseEntity.ok(postMapper.toDto(updatedPost));
    }

    public List<PostDto> getAllPosts() {

        return postRepository.findAll()
                .stream()
                .map(postMapper::toDto)
                .toList();
    }

    public ResponseEntity<?> getPostById(Long id) {

        var post = postRepository.findById(id).orElse(null);

        if (post == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(postMapper.toDto(post));
    }
}
