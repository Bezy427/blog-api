
package com.bezy.blogapi.services;

import com.bezy.blogapi.dtos.RegisterCommentRequest;
import com.bezy.blogapi.dtos.UpdateCommentRequest;
import com.bezy.blogapi.entities.Comment;
import com.bezy.blogapi.repositories.CommentRepository;
import com.bezy.blogapi.repositories.PostRepository;
import com.bezy.blogapi.repositories.UserRepository;
import com.bezy.blogapi.mappers.CommentMapper;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CommentMapper commentMapper;

    public CommentService(
            CommentRepository commentRepository,
            PostRepository postRepository,
            UserRepository userRepository,
            CommentMapper commentMapper
    ) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.commentMapper = commentMapper;
    }

    public ResponseEntity<?> addComment(
            RegisterCommentRequest request,
            Authentication authentication
    ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("You must be logged in to comment.");
        }

        Long userId = Long.parseLong(authentication.getName());

        var user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Authenticated user not found.");
        }

        var post = postRepository.findById(request.getPostId())
                .orElse(null);

        if (post == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Post not found.");
        }

        Comment comment = new Comment();
        comment.setText(request.getText());
        comment.setPost(post);
        comment.setUser(user);

        Comment savedComment = commentRepository.save(comment);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(commentMapper.toDto(savedComment));
    }

    public ResponseEntity<?> updateCommentById(
            Long id,
            UpdateCommentRequest request
    ) {
        var comment = commentRepository.findById(id).orElse(null);

        if (comment == null) {
            return ResponseEntity.notFound().build();
        }

        commentMapper.update(request, comment);
        commentRepository.save(comment);

        return ResponseEntity.ok(commentMapper.toDto(comment));
    }

    public ResponseEntity<?> deleteCommentById(Long id) {
        var comment = commentRepository.findById(id).orElse(null);

        if (comment == null) {
            return ResponseEntity.notFound().build();
        }

        commentRepository.delete(comment);

        return ResponseEntity.ok("Comment has been deleted!");
    }
}
