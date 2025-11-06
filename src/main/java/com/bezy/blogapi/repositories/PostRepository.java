package com.bezy.blogapi.repositories;

import com.bezy.blogapi.entities.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {
    boolean existsByTitle(String title);
    Optional<Post> findByTitle(String title);
}