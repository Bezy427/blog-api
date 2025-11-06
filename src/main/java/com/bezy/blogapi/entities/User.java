package com.bezy.blogapi.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "users", schema = "blog_db")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "username")
    private String username;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "confirm_password")
    private String confirmPassword;

    @Column(name = "email")
    private String email;

    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name = "created_at")
    private Instant createdAt;

    @OneToMany(mappedBy = "user")
    private Set<Comment> comments = new LinkedHashSet<>();

    @OneToMany(mappedBy = "users")
    private Set<Profile> profiles = new LinkedHashSet<>();

}