package com.cardlinked.benefits.admin.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/admin/golden-records")
@PreAuthorize("hasRole('ADMIN')")
public class GoldenRecordsController {

    @GetMapping("/customers")
    public List<GoldenRecord> getGoldenRecords(@RequestParam(defaultValue = "0") int page) {
        return Arrays.asList(
            GoldenRecord.builder()
                .id("GR001")
                .customerId("CUST_12345")
                .masterRecordId("MR_001")
                .confidence(98.5)
                .status("VERIFIED")
                .sources(Arrays.asList("Bank_A", "Bank_B"))
                .lastUpdated(LocalDateTime.now())
                .attributes(Map.of(
                    "name", "Ahmed Al-Rashid",
                    "email", "ahmed@example.com",
                    "phone", "+971501234567",
                    "segment", "Premium"
                ))
                .build(),
            GoldenRecord.builder()
                .id("GR002")
                .customerId("CUST_67890")
                .masterRecordId("MR_002")
                .confidence(95.2)
                .status("PENDING_REVIEW")
                .sources(Arrays.asList("Bank_A", "Bank_C"))
                .lastUpdated(LocalDateTime.now())
                .attributes(Map.of(
                    "name", "Sarah Johnson",
                    "email", "sarah@example.com",
                    "phone", "+971509876543",
                    "segment", "Gold"
                ))
                .build()
        );
    }

    @GetMapping("/duplicates")
    public List<DuplicateGroup> getDuplicates() {
        return Arrays.asList(
            DuplicateGroup.builder()
                .groupId("DUP_001")
                .confidence(92.3)
                .status("PENDING")
                .records(Arrays.asList(
                    Map.of("id", "CUST_111", "source", "Bank_A", "name", "Mohammed Ali"),
                    Map.of("id", "CUST_222", "source", "Bank_B", "name", "Mohammad Ali")
                ))
                .build()
        );
    }

    @PostMapping("/merge")
    public Map<String, String> mergeRecords(@RequestBody MergeRequest request) {
        return Map.of("status", "success", "masterRecordId", "MR_" + UUID.randomUUID().toString().substring(0, 8));
    }

    @GetMapping("/data-quality")
    public DataQualityReport getDataQuality() {
        return DataQualityReport.builder()
            .overallScore(96.8)
            .completeness(98.2)
            .accuracy(95.4)
            .consistency(97.1)
            .fieldScores(Map.of(
                "name", 99.1,
                "email", 94.5,
                "phone", 96.8,
                "address", 92.3
            ))
            .build();
    }

    @Data @lombok.Builder
    public static class GoldenRecord {
        private String id;
        private String customerId;
        private String masterRecordId;
        private double confidence;
        private String status;
        private List<String> sources;
        private LocalDateTime lastUpdated;
        private Map<String, Object> attributes;
    }

    @Data @lombok.Builder
    public static class DuplicateGroup {
        private String groupId;
        private double confidence;
        private String status;
        private List<Map<String, Object>> records;
    }

    @Data
    public static class MergeRequest {
        private List<String> recordIds;
        private String masterRecordId;
        private Map<String, Object> resolvedAttributes;
    }

    @Data @lombok.Builder
    public static class DataQualityReport {
        private double overallScore;
        private double completeness;
        private double accuracy;
        private double consistency;
        private Map<String, Double> fieldScores;
    }
}