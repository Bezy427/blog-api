
package com.bezy.blogapi.controllers;

import com.bezy.blogapi.dtos.ChangePasswordRequest;
import com.bezy.blogapi.dtos.UpdateUserRequest;
import com.bezy.blogapi.dtos.UserDto;
import com.bezy.blogapi.services.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/users/me")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @GetMapping
    public ResponseEntity<UserDto> getMyAccount(
            Authentication authentication
    ) {

        Long userId = getAuthenticatedUserId(authentication);

        return ResponseEntity.ok(
                accountService.getAccount(userId)
        );
    }

    @PutMapping
    public ResponseEntity<UserDto> updateMyAccount(
            @Valid @RequestBody UpdateUserRequest request,
            Authentication authentication
    ) {

        Long userId = getAuthenticatedUserId(authentication);

        return ResponseEntity.ok(
                accountService.updateAccount(userId, request)
        );
    }

    @PutMapping("/password")
    public ResponseEntity<Void> changeMyPassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication
    ) {

        Long userId = getAuthenticatedUserId(authentication);

        accountService.changePassword(userId, request);

        return ResponseEntity.noContent().build();
    }

    private Long getAuthenticatedUserId(
            Authentication authentication
    ) {

        if (authentication == null ||
                !authentication.isAuthenticated() ||
                !(authentication.getPrincipal() instanceof Long userId)) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Authentication required!"
            );
        }

        return userId;
    }
}
