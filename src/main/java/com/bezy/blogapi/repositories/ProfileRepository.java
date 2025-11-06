package com.bezy.blogapi.repositories;

import com.bezy.blogapi.entities.Profile;
import com.bezy.blogapi.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfileRepository extends JpaRepository<Profile, Long> {
    boolean existsByBio(String bio);
    Optional<Profile> findByBio(String bio);

    Long id(Long id);
}