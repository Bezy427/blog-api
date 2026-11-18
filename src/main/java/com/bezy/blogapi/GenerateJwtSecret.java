package com.bezy.blogapi;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Encoders;

public class GenerateJwtSecret {
    public static void main(String[] args) {
        var key = Jwts.SIG.HS256.key().build();

        String secret = Encoders.BASE64URL.encode(
                key.getEncoded()
        );

        System.out.println(secret);
    }
}
