
package com.bezy.blogapi.services;

import com.bezy.blogapi.config.JwtConfig;
import com.bezy.blogapi.entities.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;

@AllArgsConstructor
@Service
public class JwtService {

    private final JwtConfig jwtConfig;

    public Jwt generateAccessToken(User user) {
        return generateToken(
                user,
                jwtConfig.getAccessTokenExpiration(),
                "ACCESS"
        );
    }

    public Jwt generateRefreshToken(User user) {
        return generateToken(
                user,
                jwtConfig.getRefreshTokenExpiration(),
                "REFRESH"
        );
    }

    private Jwt generateToken(
            User user,
            long tokenExpiration,
            String tokenType
    ) {

        long now = System.currentTimeMillis();

        var claims = Jwts.claims()
                .subject(user.getId().toString())
                .add("username", user.getUsername())
                .add("email", user.getEmail())
                .add("role", user.getRole().name())
                .add("tokenType", tokenType)
                .issuedAt(new Date(now))
                .expiration(new Date(now + 1000L * tokenExpiration))
                .build();

        return new Jwt(claims, jwtConfig.getSecretKey());
    }

    public Jwt parseToken(String token) {

        if (token == null || token.isBlank()) {
            return null;
        }

        try {
            var claims = getClaims(token);

            if (claims.getSubject() == null
                    || claims.get("role", String.class) == null
                    || claims.get("tokenType", String.class) == null) {
                return null;
            }

            return new Jwt(claims, jwtConfig.getSecretKey());

        } catch (JwtException | IllegalArgumentException e) {
            return null;
        }
    }

    private Claims getClaims(String token) {

        return Jwts.parser()
                .verifyWith(jwtConfig.getSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
