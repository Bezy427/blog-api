package com.bezy.blogapi.services;

import com.bezy.blogapi.dtos.RegisterTagRequest;
import com.bezy.blogapi.dtos.UpdateTagRequest;
import com.bezy.blogapi.entities.Tag;
import com.bezy.blogapi.mappers.ProfileMapper;
import com.bezy.blogapi.mappers.TagMapper;
import com.bezy.blogapi.repositories.TagRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

@Service
public class TagService {
    private final TagRepository tagRepository;
    private TagMapper tagMapper;

    public TagService(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    public ResponseEntity<?> addTag(
            @RequestBody RegisterTagRequest request
    ){
        Tag tag = new Tag();
        tag.setName(request.getName());
        tag.setId(request.getId());
        tag.setPosts(request.getPosts());
        tagRepository.save(tag);
        return ResponseEntity.ok().build();
    }

    public ResponseEntity<?> updateTagById(
            @PathVariable Long id,
            @RequestBody UpdateTagRequest request
    ){
        var tag = tagRepository.findById(id).orElse(null);
        if(tag == null){
            return ResponseEntity.notFound().build();
        }

        tagMapper.update(request, tag);
        tagRepository.save(tag);
        return ResponseEntity.ok().build();
    }
}
