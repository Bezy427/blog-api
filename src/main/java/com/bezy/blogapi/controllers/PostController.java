package com.bezy.blogapi.controllers;

import com.bezy.blogapi.dtos.RegisterPostRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
public class PostController {


    @PostMapping
    public ResponseEntity<?> registerPost(
    ) {
    }

    @GetMapping
    }
}
