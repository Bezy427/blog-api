
package com.bezy.blogapi.services;

import com.bezy.blogapi.dtos.ChangePasswordRequest;
import com.bezy.blogapi.dtos.UpdateUserRequest;
import com.bezy.blogapi.dtos.UserDto;
import com.bezy.blogapi.entities.User;
import com.bezy.blogapi.mappers.UserMapper;
import com.bezy.blogapi.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserDto getAccount(Long userId) {

        User user = findUser(userId);

        return userMapper.toDto(user);
    }

    @Transactional
    public UserDto updateAccount(
            Long userId,
            UpdateUserRequest request
    ) {

        User user = findUser(userId);

        if (userRepository.existsByUsernameAndIdNot(
                request.getUsername(), userId)) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Username is already in use!"
            );
        }

        if (userRepository.existsByEmailAndIdNot(
                request.getEmail(), userId)) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email is already in use!"
            );
        }

        user.setUsername(request.getUsername().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());

        User savedUser = userRepository.save(user);

        return userMapper.toDto(savedUser);
    }

    @Transactional
    public void changePassword(
            Long userId,
            ChangePasswordRequest request
    ) {

        User user = findUser(userId);

        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Current password is incorrect!"
            );
        }

        if (!request.getNewPassword().equals(
                request.getConfirmNewPassword())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "New passwords do not match!"
            );
        }

        if (passwordEncoder.matches(
                request.getNewPassword(),
                user.getPassword())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "New password must be different from current password!"
            );
        }

        user.setPassword(
                passwordEncoder.encode(request.getNewPassword())
        );

        userRepository.save(user);
    }

    private User findUser(Long userId) {

        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User account not found!"
                ));
    }
}
