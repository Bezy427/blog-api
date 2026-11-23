
package com.bezy.blogapi.config;

import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import javax.crypto.SecretKey;

@Configuration
@ConfigurationProperties(prefix = "spring.jwt")
@Data
public class JwtConfig {

    private String secret;

    private long accessTokenExpiration;

    private long refreshTokenExpiration;

    public SecretKey getSecretKey() {

        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException(
                    "JWT secret is missing. Check the SECRET_KEY environment variable."
            );
        }

        try {
            byte[] keyBytes = Decoders.BASE64.decode(secret);

            return Keys.hmacShaKeyFor(keyBytes);

        } catch (IllegalArgumentException e) {
            throw new IllegalStateException(
                    "JWT secret must be a valid Base64-encoded key of at least 256 bits.",
                    e
            );
        }
    }
}
