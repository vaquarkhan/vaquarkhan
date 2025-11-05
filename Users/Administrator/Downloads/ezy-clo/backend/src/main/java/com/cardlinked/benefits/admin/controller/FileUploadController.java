package com.cardlinked.benefits.admin.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/upload")
@PreAuthorize("hasRole('ADMIN')")
@Slf4j
public class FileUploadController {

    private final String uploadDir = "uploads/";

    @PostMapping("/logo")
    public ResponseEntity<Map<String, String>> uploadLogo(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "File is empty"));
            }

            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path uploadPath = Paths.get(uploadDir);
            
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);
            
            String fileUrl = "/uploads/" + fileName;
            log.info("Logo uploaded successfully: {}", fileUrl);
            
            return ResponseEntity.ok(Map.of(
                "url", fileUrl,
                "fileName", fileName,
                "originalName", file.getOriginalFilename(),
                "size", String.valueOf(file.getSize())
            ));
            
        } catch (IOException e) {
            log.error("Error uploading logo", e);
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Failed to upload file: " + e.getMessage()));
        }
    }

    @PostMapping("/certificate")
    public ResponseEntity<Map<String, String>> uploadCertificate(@RequestParam("file") MultipartFile file) {
        try {
            if (!file.getOriginalFilename().endsWith(".p12") && !file.getOriginalFilename().endsWith(".pem")) {
                return ResponseEntity.badRequest().body(Map.of("error", "Only .p12 and .pem files are allowed"));
            }

            String fileName = "cert_" + UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path uploadPath = Paths.get(uploadDir + "certificates/");
            
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);
            
            String fileUrl = "/uploads/certificates/" + fileName;
            log.info("Certificate uploaded successfully: {}", fileUrl);
            
            return ResponseEntity.ok(Map.of(
                "url", fileUrl,
                "fileName", fileName,
                "type", "certificate"
            ));
            
        } catch (IOException e) {
            log.error("Error uploading certificate", e);
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Failed to upload certificate: " + e.getMessage()));
        }
    }

    @PostMapping("/config")
    public ResponseEntity<Map<String, String>> uploadConfig(@RequestParam("file") MultipartFile file) {
        try {
            if (!file.getOriginalFilename().endsWith(".json") && !file.getOriginalFilename().endsWith(".xml")) {
                return ResponseEntity.badRequest().body(Map.of("error", "Only .json and .xml files are allowed"));
            }

            String fileName = "config_" + UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path uploadPath = Paths.get(uploadDir + "configs/");
            
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);
            
            String fileUrl = "/uploads/configs/" + fileName;
            log.info("Config file uploaded successfully: {}", fileUrl);
            
            return ResponseEntity.ok(Map.of(
                "url", fileUrl,
                "fileName", fileName,
                "type", "config"
            ));
            
        } catch (IOException e) {
            log.error("Error uploading config file", e);
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Failed to upload config: " + e.getMessage()));
        }
    }
}