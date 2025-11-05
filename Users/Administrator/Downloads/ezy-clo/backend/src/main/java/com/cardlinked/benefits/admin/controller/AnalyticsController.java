package com.cardlinked.benefits.admin.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/admin/analytics")
@PreAuthorize("hasRole('ADMIN')")
public class AnalyticsController {

    @GetMapping("/executive-summary")
    public ExecutiveSummary getExecutiveSummary() {
        return ExecutiveSummary.builder()
            .totalCustomers(125847)
            .activeOffers(24)
            .totalRedemptions(15632)
            .revenueGenerated(2847593.50)
            .customerGrowthRate(12.5)
            .offerPerformanceRate(87.3)
            .build();
    }

    @GetMapping("/customer-metrics")
    public CustomerMetrics getCustomerMetrics() {
        return CustomerMetrics.builder()
            .totalCustomers(125847)
            .activeCustomers(98234)
            .newCustomersThisMonth(5847)
            .customerRetentionRate(94.2)
            .avgSpendPerCustomer(1250.75)
            .topSpendingSegment("Premium")
            .segmentDistribution(Map.of(
                "Premium", 15234,
                "Gold", 45678,
                "Silver", 64935
            ))
            .build();
    }

    @GetMapping("/offer-performance")
    public OfferPerformance getOfferPerformance() {
        return OfferPerformance.builder()
            .totalOffers(24)
            .activeOffers(18)
            .totalRedemptions(15632)
            .redemptionRate(67.8)
            .topPerformingOffer("Dining Cashback 15%")
            .categoryPerformance(Map.of(
                "Dining", 8547,
                "Shopping", 4235,
                "Travel", 2850
            ))
            .build();
    }

    @GetMapping("/revenue-analytics")
    public RevenueAnalytics getRevenueAnalytics() {
        return RevenueAnalytics.builder()
            .totalRevenue(2847593.50)
            .monthlyRevenue(234567.89)
            .revenueGrowth(15.7)
            .avgRevenuePerCustomer(22.63)
            .revenueByScheme(Map.of(
                "Mastercard", 1698456.10,
                "Visa", 1149137.40
            ))
            .build();
    }

    @GetMapping("/golden-records")
    public GoldenRecordsMetrics getGoldenRecords() {
        return GoldenRecordsMetrics.builder()
            .totalRecords(125847)
            .duplicatesResolved(2847)
            .dataQualityScore(96.8)
            .lastUpdateTime(LocalDateTime.now())
            .recordsBySource(Map.of(
                "Bank_A", 45678,
                "Bank_B", 38945,
                "Bank_C", 41224
            ))
            .build();
    }

    @Data @lombok.Builder
    public static class ExecutiveSummary {
        private int totalCustomers;
        private int activeOffers;
        private int totalRedemptions;
        private double revenueGenerated;
        private double customerGrowthRate;
        private double offerPerformanceRate;
    }

    @Data @lombok.Builder
    public static class CustomerMetrics {
        private int totalCustomers;
        private int activeCustomers;
        private int newCustomersThisMonth;
        private double customerRetentionRate;
        private double avgSpendPerCustomer;
        private String topSpendingSegment;
        private Map<String, Integer> segmentDistribution;
    }

    @Data @lombok.Builder
    public static class OfferPerformance {
        private int totalOffers;
        private int activeOffers;
        private int totalRedemptions;
        private double redemptionRate;
        private String topPerformingOffer;
        private Map<String, Integer> categoryPerformance;
    }

    @Data @lombok.Builder
    public static class RevenueAnalytics {
        private double totalRevenue;
        private double monthlyRevenue;
        private double revenueGrowth;
        private double avgRevenuePerCustomer;
        private Map<String, Double> revenueByScheme;
    }

    @Data @lombok.Builder
    public static class GoldenRecordsMetrics {
        private int totalRecords;
        private int duplicatesResolved;
        private double dataQualityScore;
        private LocalDateTime lastUpdateTime;
        private Map<String, Integer> recordsBySource;
    }
}