package com.cardlinked.benefits.customer.entity;

import com.cardlinked.benefits.common.entity.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "spend_thresholds", indexes = {
    @Index(name = "idx_customer_id", columnList = "customer_id"),
    @Index(name = "idx_card_id", columnList = "card_id"),
    @Index(name = "idx_threshold_type", columnList = "threshold_type"),
    @Index(name = "idx_reset_date", columnList = "reset_date")
})
public class SpendThreshold extends BaseEntity {

    @Id
    @Column(name = "threshold_id", length = 36)
    private String thresholdId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "card_id")
    private Card card;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "threshold_type", nullable = false)
    private ThresholdType thresholdType;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(name = "threshold_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal thresholdAmount;

    @Column(name = "current_spend", precision = 15, scale = 2)
    private BigDecimal currentSpend = BigDecimal.ZERO;

    @Column(name = "currency", length = 3)
    private String currency = "SAR";

    @NotNull
    @Column(name = "reset_date", nullable = false)
    private LocalDate resetDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ThresholdStatus status = ThresholdStatus.ACTIVE;

    // Constructors
    public SpendThreshold() {
        super();
    }

    public SpendThreshold(String thresholdId, Customer customer, ThresholdType thresholdType, 
                         BigDecimal thresholdAmount, LocalDate resetDate) {
        this();
        this.thresholdId = thresholdId;
        this.customer = customer;
        this.thresholdType = thresholdType;
        this.thresholdAmount = thresholdAmount;
        this.resetDate = resetDate;
    }

    // Getters and Setters
    public String getThresholdId() { return thresholdId; }
    public void setThresholdId(String thresholdId) { this.thresholdId = thresholdId; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    public Card getCard() { return card; }
    public void setCard(Card card) { this.card = card; }

    public ThresholdType getThresholdType() { return thresholdType; }
    public void setThresholdType(ThresholdType thresholdType) { this.thresholdType = thresholdType; }

    public BigDecimal getThresholdAmount() { return thresholdAmount; }
    public void setThresholdAmount(BigDecimal thresholdAmount) { this.thresholdAmount = thresholdAmount; }

    public BigDecimal getCurrentSpend() { return currentSpend; }
    public void setCurrentSpend(BigDecimal currentSpend) { this.currentSpend = currentSpend; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public LocalDate getResetDate() { return resetDate; }
    public void setResetDate(LocalDate resetDate) { this.resetDate = resetDate; }

    public ThresholdStatus getStatus() { return status; }
    public void setStatus(ThresholdStatus status) { this.status = status; }

    // Helper methods
    public BigDecimal getRemainingAmount() {
        return thresholdAmount.subtract(currentSpend).max(BigDecimal.ZERO);
    }

    public BigDecimal getProgressPercentage() {
        if (thresholdAmount.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return currentSpend.divide(thresholdAmount, 4, BigDecimal.ROUND_HALF_UP)
                          .multiply(BigDecimal.valueOf(100));
    }

    public boolean isThresholdMet() {
        return currentSpend.compareTo(thresholdAmount) >= 0;
    }

    public boolean isExpired() {
        return resetDate.isBefore(LocalDate.now());
    }

    // Enums
    public enum ThresholdType {
        DAILY, WEEKLY, MONTHLY, YEARLY
    }

    public enum ThresholdStatus {
        ACTIVE, COMPLETED, EXPIRED
    }
}