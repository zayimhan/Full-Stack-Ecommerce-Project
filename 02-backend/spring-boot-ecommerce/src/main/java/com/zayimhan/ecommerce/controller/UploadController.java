package com.zayimhan.ecommerce.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:4200")
public class UploadController {

    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads";

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Dosya boş"));
        }

        // Upload klasörü oluşturulmamışsa oluştur
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        // Benzersiz dosya adı oluştur
        String fileName = UUID.randomUUID() + "-" + file.getOriginalFilename();
        File dest = new File(uploadDir, fileName);

        // Dosyayı yükle
        file.transferTo(dest);

        // Görsele tarayıcıdan erişilebilecek URL
        String imageUrl = "http://localhost:8080/uploads/" + fileName;

        Map<String, String> response = new HashMap<>();
        response.put("imageUrl", imageUrl);

        return ResponseEntity.ok(response);
    }
}
