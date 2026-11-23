
package com.bezy.blogapi.services;

import com.bezy.blogapi.dtos.ProfileDto;
import com.bezy.blogapi.dtos.UpdateProfileRequest;
import com.bezy.blogapi.entities.Profile;
import com.bezy.blogapi.repositories.ProfileRepository;
import com.bezy.blogapi.repositories.UserRepository;
import com.bezy.blogapi.mappers.ProfileMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final ProfileMapper profileMapper;
    private final ImageKitStorageService imageKitStorageService;

    @Transactional
    public ProfileDto getMyProfile(Long userId) {
        Profile profile = getOrCreateProfile(userId);
        return profileMapper.toDto(profile);
    }

    @Transactional
    public ProfileDto updateMyProfile(
            Long userId,
            UpdateProfileRequest request
    ) {
        Profile profile = getOrCreateProfile(userId);

        profile.setBio(
                request.getBio() == null
                        ? null
                        : request.getBio().trim()
        );

        Profile savedProfile = profileRepository.save(profile);

        return profileMapper.toDto(savedProfile);
    }

    @Transactional
    public ProfileDto uploadAvatar(
            Long userId,
            MultipartFile file
    ) {
        Profile profile = getOrCreateProfile(userId);

        String oldFileId = profile.getAvatarFileId();

        ImageKitStorageService.UploadedImage uploaded =
                imageKitStorageService.uploadAvatar(file);

        // Save the new ImageKit image details.
        profile.setAvatarUrl(uploaded.url());
        profile.setAvatarFileId(uploaded.fileId());

        Profile savedProfile = profileRepository.save(profile);

        // Delete the old image only after the database commits.
        if (oldFileId != null && !oldFileId.isBlank()) {

            TransactionSynchronizationManager.registerSynchronization(
                    new TransactionSynchronization() {
                        @Override
                        public void afterCommit() {
                            imageKitStorageService.deleteImage(oldFileId);
                        }
                    }
            );
        }

        return profileMapper.toDto(savedProfile);
    }

    private Profile getOrCreateProfile(Long userId) {

        return profileRepository.findByUserId(userId)
                .orElseGet(() -> {

                    var user = userRepository.findById(userId)
                            .orElseThrow(() ->
                                    new ResponseStatusException(
                                            HttpStatus.NOT_FOUND,
                                            "User account not found!"
                                    )
                            );

                    Profile profile = new Profile();

                    profile.setUser(user);
                    profile.setBio(null);
                    profile.setAvatarUrl(null);
                    profile.setAvatarFileId(null);

                    return profileRepository.save(profile);
                });
    }
}
