package com.cardlinked.benefits.offers.entity;

import com.cardlinked.benefits.common.entity.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "offers", indexes = {
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_category", columnList = "category"),
    @Index(name = "idx_start_end_date", columnList = "start_date, end_date"),
    @Index(name = "idx_merchant_name", columnList = "merchant_name"),
    @Index(name = "idx_offers_category_status", columnList = "category, status")
})
public class Offer extends BaseEntity {

    @Id
    @Column(name = "offer_id", length = 36)
    private String offerId;

    @NotBlank
    @Size(max = 255)
    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @NotBlank
    @Size(max = 255)
    @Column(name = "merchant_name", nullable = false)
    private String merchantName;

    @NotBlank
    @Size(max = 100)
    @Column(name = "category", nullable = false, length = 100)
    private String category;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type", nullable = false)
    private DiscountType discountType;

    @NotNull
    @DecimalMin(value = "0.0")
    @Column(name = "discount_value", nullable = false, precision = 10, scale = 2)
    private BigDecimal discountValue;

    @Size(max = 3)
    @Column(name = "currency", length = 3)
    private String currency = "SAR";

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "redemption_type", nullable = false)
    private RedemptionType redemptionType;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "rules_config", columnDefinition = "JSON")
    private Map<String, Object> rulesConfig;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "eligibility_criteria", columnDefinition = "JSON")
    private Map<String, Object> eligibilityCriteria;

    @NotNull
    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @NotNull
    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    @Column(name = "max_redemptions")
    private Integer maxRedemptions;

    @Column(name = "current_redemptions")
    private Integer currentRedemptions = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private OfferStatus status = OfferStatus.DRAFT;

    @Size(max = 500)
    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "terms_conditions", columnDefinition = "TEXT")
    private String termsConditions;

    // Constructors
    public Offer() {
        super();
    }

    public Offer(String offerId, String title, String merchantName, String category,
                DiscountType discountType, BigDecimal discountValue, RedemptionType redemptionType,
                LocalDateTime startDate, LocalDateTime endDate) {
        this();
        this.offerId = offerId;
        this.title = title;
        this.merchantName = merchantName;
        this.category = category;
        this.discountType = discountType;
        this.discountValue = discountValue;
        this.redemptionType = redemptionType;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    // Getters and Setters
    public String getOfferId() { return offerId; }
    public void setOfferId(String offerId) { this.offerId = offerId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getMerchantName() { return merchantName; }
    public void setMerchantName(String merchantName) { this.merchantName = merchantName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public DiscountType getDiscountType() { return discountType; }
    public void setDiscountType(DiscountType discountType) { this.discountType = discountType; }

    public BigDecimal getDiscountValue() { return discountValue; }
    public void setDiscountValue(BigDecimal discountValue) { this.discountValue = discountValue; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public RedemptionType getRedemptionType() { return redemptionType; }
    public void setRedemptionType(RedemptionType redemptionType) { this.redemptionType = redemptionType; }

    public Map<String, Object> getRulesConfig() { return rulesConfig; }
    public void setRulesConfig(Map<String, Object> rulesConfig) { this.rulesConfig = rulesConfig; }

    public Map<String, Object> getEligibilityCriteria() { return eligibilityCriteria; }
    public void setEligibilityCriteria(Map<String, Object> eligibilityCriteria) { this.eligibilityCriteria = eligibilityCriteria; }

    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }

    public Integer getMaxRedemptions() { return maxRedemptions; }
    public void setMaxRedemptions(Integer maxRedemptions) { this.maxRedemptions = maxRedemptions; }

    public Integer getCurrentRedemptions() { return currentRedemptions; }
    public void setCurrentRedemptions(Integer currentRedemptions) { this.currentRedemptions = currentRedemptions; }

    public OfferStatus getStatus() { return status; }
    public void setStatus(OfferStatus status) { this.status = status; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getTermsConditions() { return termsConditions; }
    public void setTermsConditions(String termsConditions) { this.termsConditions = termsConditions; }

    // Helper methods
    public boolean isActive() {
        LocalDateTime now = LocalDateTime.now();
        return status == OfferStatus.ACTIVE && 
               now.isAfter(startDate) && 
               now.isBefore(endDate);
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(endDate);
    }

    public boolean hasRedemptionsAvailable() {
        return maxRedemptions == null || currentRedemptions < maxRedemptions;
    }

    public int getRemainingRedemptions() {
        if (maxRedemptions == null) return Integer.MAX_VALUE;
        return Math.max(0, maxRedemptions - currentRedemptions);
    }

    public void incrementRedemptions() {
        this.currentRedemptions = (this.currentRedemptions == null ? 0 : this.currentRedemptions) + 1;
    }

    // Enums
    public enum DiscountType {
        PERCENTAGE, FIXED_AMOUNT, CASHBACK
    }

    public enum RedemptionType {
        ONLINE, OFFLINE, BOTH
    }

    public enum OfferStatus {
        DRAFT, PENDING_APPROVAL, ACTIVE, EXPIRED, ARCHIVED
    }
}