package com.bezy.blogapi.services;

import com.bezy.blogapi.dtos.RegisterProfileRequest;
import com.bezy.blogapi.dtos.UpdateProfileRequest;
import com.bezy.blogapi.entities.Profile;
import com.bezy.blogapi.mappers.ProfileMapper;
import com.bezy.blogapi.repositories.ProfileRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

@Service
public class ProfileService {
    private final ProfileRepository profileRepository;
    private ProfileMapper profileMapper;

    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    public ResponseEntity<?> createProfile(
            @RequestBody RegisterProfileRequest request
    ){
        if(profileRepository.findByBio(request.getBio()).isPresent()){
            return ResponseEntity.badRequest().build();
        }
        Profile profile = new Profile();
        profile.setBio(request.getBio());
        profile.setId(request.getId());
        profileRepository.save(profile);
        return ResponseEntity.ok("Profile has been created successfully!");
    }

    public ResponseEntity<?> updateProfileById(
            @PathVariable Long id,
            @RequestBody UpdateProfileRequest request
    ){
        var profile = profileRepository.findById(id).orElse(null);
        if(profile == null){
            return ResponseEntity.notFound().build();
        }
        profileMapper.update(request, profile);
        profileRepository.save(profile);
        return ResponseEntity.ok().build();
    }
}
