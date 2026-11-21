package com.bezy.blogapi.repositories;

import com.bezy.blogapi.entities.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag, Long> {
    boolean existsByName(String name);
    Optional<Object> findByName(String name);
}