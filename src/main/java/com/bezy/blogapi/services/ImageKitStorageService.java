
package com.bezy.blogapi.services;

import io.imagekit.client.ImageKitClient;
import io.imagekit.models.files.FileDeleteParams;
import io.imagekit.models.files.FileUploadParams;
import io.imagekit.models.files.FileUploadResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ImageKitStorageService {

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;

    private final ImageKitClient imageKitClient;

    public record UploadedImage(String url, String fileId) {}


    public UploadedImage uploadAvatar(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            log.warn("Avatar upload rejected: no file received.");

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Please select an image."
            );
        }

        log.info(
                "Avatar upload received: filename={}, contentType={}, size={} bytes",
                file.getOriginalFilename(),
                file.getContentType(),
                file.getSize()
        );

        if (file.getSize() > MAX_FILE_SIZE) {
            log.warn("Avatar upload rejected: file exceeds 5 MB.");

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Image must not exceed 5 MB."
            );
        }

        try {
            byte[] bytes = file.getBytes();

            String extension = detectImageExtension(bytes);

            log.info("Avatar image validated successfully: {}", extension);

            String fileName = "avatar-" + UUID.randomUUID()
                    + "." + extension;

            FileUploadParams params = FileUploadParams.builder()
                    .file(bytes)
                    .fileName(fileName)
                    .folder("/techblog/avatars")
                    .build();

            FileUploadResponse response =
                    imageKitClient.files().upload(params);

            String imageUrl = response.url()
                    .orElseThrow(() -> new IllegalStateException(
                            "ImageKit did not return an image URL."
                    ));

            String fileId = response.fileId()
                    .orElseThrow(() -> new IllegalStateException(
                            "ImageKit did not return a file ID."
                    ));

            log.info("Avatar uploaded successfully to ImageKit.");

            return new UploadedImage(imageUrl, fileId);

        } catch (IOException exception) {
            log.error("Failed to read uploaded avatar.", exception);

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Could not read the uploaded image."
            );
        }
    }


    public void deleteImage(String fileId) {

        if (fileId == null || fileId.isBlank()) {
            return;
        }

        try {
            FileDeleteParams params = FileDeleteParams.builder()
                    .fileId(fileId)
                    .build();

            imageKitClient.files().delete(params);

        } catch (Exception exception) {
            log.error(
                    "Could not delete old ImageKit image with ID: {}",
                    fileId,
                    exception
            );
        }
    }

    private String detectImageExtension(byte[] bytes) {

        // JPEG
        if (bytes.length >= 3
                && (bytes[0] & 0xFF) == 0xFF
                && (bytes[1] & 0xFF) == 0xD8
                && (bytes[2] & 0xFF) == 0xFF) {
            return "jpg";
        }

        // PNG
        if (bytes.length >= 8
                && (bytes[0] & 0xFF) == 0x89
                && bytes[1] == 0x50
                && bytes[2] == 0x4E
                && bytes[3] == 0x47
                && bytes[4] == 0x0D
                && bytes[5] == 0x0A
                && bytes[6] == 0x1A
                && bytes[7] == 0x0A) {
            return "png";
        }

        // GIF
        if (bytes.length >= 6) {
            String signature = new String(
                    bytes,
                    0,
                    6,
                    StandardCharsets.US_ASCII
            );

            if (signature.equals("GIF87a")
                    || signature.equals("GIF89a")) {
                return "gif";
            }
        }

        // WEBP
        if (bytes.length >= 12
                && new String(
                bytes, 0, 4, StandardCharsets.US_ASCII
        ).equals("RIFF")
                && new String(
                bytes, 8, 4, StandardCharsets.US_ASCII
        ).equals("WEBP")) {
            return "webp";
        }

        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Only valid JPG, PNG, GIF and WEBP images are allowed."
        );
    }
}
