package com.cardlinked.benefits.features;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import lombok.Data;
import java.util.*;

@RestController
@RequestMapping("/api/card-services")
public class CardLinkedServicesController {

    @GetMapping("/features")
    public List<CardLinkedFeature> getAvailableFeatures() {
        return Arrays.asList(
            CardLinkedFeature.builder()
                .id("real-time-offers")
                .name("Real-Time Offer Engine")
                .description("Dynamic offer matching based on transaction data")
                .category("OFFERS")
                .enabled(true)
                .build(),
            CardLinkedFeature.builder()
                .id("spend-analytics")
                .name("Spend Analytics & Insights")
                .description("Advanced spending pattern analysis and predictions")
                .category("ANALYTICS")
                .enabled(true)
                .build(),
            CardLinkedFeature.builder()
                .id("merchant-funded-rewards")
                .name("Merchant-Funded Rewards")
                .description("Cashback and rewards funded by merchant partners")
                .category("REWARDS")
                .enabled(true)
                .build(),
            CardLinkedFeature.builder()
                .id("geo-targeted-offers")
                .name("Location-Based Offers")
                .description("Offers triggered by customer location and proximity")
                .category("OFFERS")
                .enabled(true)
                .build(),
            CardLinkedFeature.builder()
                .id("fraud-prevention")
                .name("Transaction Fraud Prevention")
                .description("AI-powered fraud detection and prevention")
                .category("SECURITY")
                .enabled(true)
                .build(),
            CardLinkedFeature.builder()
                .id("loyalty-integration")
                .name("Loyalty Program Integration")
                .description("Seamless integration with existing loyalty programs")
                .category("LOYALTY")
                .enabled(true)
                .build(),
            CardLinkedFeature.builder()
                .id("instant-redemption")
                .name("Instant Reward Redemption")
                .description("Real-time reward redemption at point of sale")
                .category("REWARDS")
                .enabled(true)
                .build(),
            CardLinkedFeature.builder()
                .id("cross-border-rewards")
                .name("Cross-Border Rewards")
                .description("International reward programs and currency conversion")
                .category("REWARDS")
                .enabled(false)
                .build(),
            CardLinkedFeature.builder()
                .id("ai-personalization")
                .name("AI-Powered Personalization")
                .description("Machine learning for personalized offer recommendations")
                .category("AI")
                .enabled(true)
                .build(),
            CardLinkedFeature.builder()
                .id("social-commerce")
                .name("Social Commerce Integration")
                .description("Social media shopping and reward sharing")
                .category("SOCIAL")
                .enabled(false)
                .build(),
            CardLinkedFeature.builder()
                .id("subscription-management")
                .name("Subscription & Recurring Payment Management")
                .description("Automated subscription tracking and optimization")
                .category("MANAGEMENT")
                .enabled(true)
                .build(),
            CardLinkedFeature.builder()
                .id("carbon-tracking")
                .name("Carbon Footprint Tracking")
                .description("Environmental impact tracking for purchases")
                .category("SUSTAINABILITY")
                .enabled(false)
                .build()
        );
    }

    @GetMapping("/merchant-categories")
    public List<MerchantCategory> getMerchantCategories() {
        return Arrays.asList(
            MerchantCategory.builder().code("5411").name("Grocery Stores").rewardRate(2.0).build(),
            MerchantCategory.builder().code("5812").name("Restaurants").rewardRate(3.0).build(),
            MerchantCategory.builder().code("5541").name("Gas Stations").rewardRate(1.5).build(),
            MerchantCategory.builder().code("5999").name("Online Shopping").rewardRate(2.5).build(),
            MerchantCategory.builder().code("4511").name("Airlines").rewardRate(4.0).build(),
            MerchantCategory.builder().code("3501").name("Hotels").rewardRate(3.5).build(),
            MerchantCategory.builder().code("5311").name("Department Stores").rewardRate(2.0).build(),
            MerchantCategory.builder().code("5732").name("Electronics").rewardRate(1.0).build()
        );
    }

    @GetMapping("/reward-types")
    public List<RewardType> getRewardTypes() {
        return Arrays.asList(
            RewardType.builder().id("cashback").name("Cashback").description("Direct cash rewards").build(),
            RewardType.builder().id("points").name("Points").description("Loyalty points system").build(),
            RewardType.builder().id("miles").name("Miles").description("Travel miles and rewards").build(),
            RewardType.builder().id("discounts").name("Discounts").description("Percentage or fixed discounts").build(),
            RewardType.builder().id("vouchers").name("Vouchers").description("Gift cards and vouchers").build(),
            RewardType.builder().id("experiences").name("Experiences").description("Exclusive experiences and events").build()
        );
    }

    @PostMapping("/features/{id}/toggle")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Object> toggleFeature(@PathVariable String id, @RequestBody Map<String, Boolean> request) {
        boolean enabled = request.getOrDefault("enabled", false);
        return Map.of(
            "featureId", id,
            "enabled", enabled,
            "message", "Feature " + (enabled ? "enabled" : "disabled") + " successfully"
        );
    }

    @Data @lombok.Builder
    public static class CardLinkedFeature {
        private String id;
        private String name;
        private String description;
        private String category;
        private boolean enabled;
    }

    @Data @lombok.Builder
    public static class MerchantCategory {
        private String code;
        private String name;
        private double rewardRate;
    }

    @Data @lombok.Builder
    public static class RewardType {
        private String id;
        private String name;
        private String description;
    }
}