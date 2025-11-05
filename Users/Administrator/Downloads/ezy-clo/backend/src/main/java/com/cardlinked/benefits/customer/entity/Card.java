package com.cardlinked.benefits.customer.entity;

import com.cardlinked.benefits.common.entity.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

@Entity
@Table(name = "cards", indexes = {
    @Index(name = "idx_customer_id", columnList = "customer_id"),
    @Index(name = "idx_card_type", columnList = "card_type"),
    @Index(name = "idx_bin_range", columnList = "bin_range"),
    @Index(name = "idx_status", columnList = "status")
})
public class Card extends BaseEntity {

    @Id
    @Column(name = "card_id", length = 36)
    private String cardId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "card_type", nullable = false)
    private CardType cardType;

    @NotBlank
    @Size(max = 8)
    @Column(name = "bin_range", nullable = false, length = 8)
    private String binRange;

    @NotBlank
    @Size(max = 4)
    @Column(name = "last_four_digits", nullable = false, length = 4)
    private String lastFourDigits;

    @NotNull
    @Column(name = "expiry_date", nullable = false)
    private LocalDate expiryDate;

    @Column(name = "is_primary")
    private Boolean isPrimary = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private CardStatus status = CardStatus.ACTIVE;

    // Constructors
    public Card() {
        super();
    }

    public Card(String cardId, Customer customer, CardType cardType, String binRange, 
               String lastFourDigits, LocalDate expiryDate) {
        this();
        this.cardId = cardId;
        this.customer = customer;
        this.cardType = cardType;
        this.binRange = binRange;
        this.lastFourDigits = lastFourDigits;
        this.expiryDate = expiryDate;
    }

    // Getters and Setters
    public String getCardId() { return cardId; }
    public void setCardId(String cardId) { this.cardId = cardId; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    public CardType getCardType() { return cardType; }
    public void setCardType(CardType cardType) { this.cardType = cardType; }

    public String getBinRange() { return binRange; }
    public void setBinRange(String binRange) { this.binRange = binRange; }

    public String getLastFourDigits() { return lastFourDigits; }
    public void setLastFourDigits(String lastFourDigits) { this.lastFourDigits = lastFourDigits; }

    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }

    public Boolean getIsPrimary() { return isPrimary; }
    public void setIsPrimary(Boolean isPrimary) { this.isPrimary = isPrimary; }

    public CardStatus getStatus() { return status; }
    public void setStatus(CardStatus status) { this.status = status; }

    // Helper methods
    public String getMaskedCardNumber() {
        return "**** **** **** " + lastFourDigits;
    }

    public boolean isExpired() {
        return expiryDate.isBefore(LocalDate.now());
    }

    // Enums
    public enum CardType {
        MASTERCARD_WORLD_ELITE, MASTERCARD_WORLD, MASTERCARD_PLATINUM, 
        VISA_SIGNATURE, VISA_INFINITE
    }

    public enum CardStatus {
        ACTIVE, BLOCKED, EXPIRED
    }
}