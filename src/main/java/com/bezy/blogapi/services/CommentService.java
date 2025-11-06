package com.bezy.blogapi.services;

import com.bezy.blogapi.dtos.RegisterCommentRequest;
import com.bezy.blogapi.dtos.UpdateCommentRequest;
import com.bezy.blogapi.entities.Comment;
import com.bezy.blogapi.mappers.CommentMapper;
import com.bezy.blogapi.mappers.ProfileMapper;
import com.bezy.blogapi.repositories.CommentRepository;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

@Service
public class CommentService {
    private final CommentRepository commentRepository;
    private CommentMapper commentMapper;

    public CommentService(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    public ResponseEntity<?> addComment(
            @RequestBody RegisterCommentRequest request
    ) {
        Comment comment = new Comment();
        comment.setId(request.getId());
        comment.setUser(request.getUser());
        comment.setText(request.getText());
        comment.setPosts(request.getPosts());
        comment.setCreatedAt(request.getCreatedAt());
        commentRepository.save(comment);
        return ResponseEntity.ok("Comment has been added!");
    }

    public ResponseEntity<?> updateCommentById(
            @PathVariable Long id,
            @RequestBody UpdateCommentRequest request
    ){
        var comment = commentRepository.findById(id).orElse(null);
        if(comment == null){
            return ResponseEntity.notFound().build();
        }
        commentMapper.update(request, comment);
        commentRepository.save(comment);
        return ResponseEntity.ok("Comment has been updated!");
    }

    public ResponseEntity<?> deleteCommentById(
            @PathVariable Long id
    ){
        var  comment = commentRepository.findById(id).orElse(null);
        if(comment == null){
            return ResponseEntity.notFound().build();
        }
        commentRepository.delete(comment);
        return ResponseEntity.ok("Comment has been deleted!");
    }

}
