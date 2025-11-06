package com.bezy.blogapi.repositories;

import com.bezy.blogapi.entities.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {
  Long id(Long id);
}