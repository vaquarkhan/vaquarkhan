package com.cardlinked.benefits.transaction.entity;

import com.cardlinked.benefits.common.entity.BaseEntity;
import com.cardlinked.benefits.customer.entity.Customer;
import com.cardlinked.benefits.customer.entity.Card;
import com.cardlinked.benefits.offers.entity.Offer;
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
@Table(name = "transactions", indexes = {
    @Index(name = "idx_customer_id", columnList = "customer_id"),
    @Index(name = "idx_card_id", columnList = "card_id"),
    @Index(name = "idx_offer_id", columnList = "offer_id"),
    @Index(name = "idx_transaction_date", columnList = "transaction_date"),
    @Index(name = "idx_merchant_category_code", columnList = "merchant_category_code"),
    @Index(name = "idx_transactions_date_type", columnList = "transaction_date, transaction_type")
})
public class Transaction extends BaseEntity {

    @Id
    @Column(name = "transaction_id", length = 36)
    private String transactionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "card_id", nullable = false)
    private Card card;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "offer_id")
    private Offer offer;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false)
    private TransactionType transactionType;

    @NotNull
    @DecimalMin(value = "0.0")
    @Column(name = "amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Size(max = 3)
    @Column(name = "currency", length = 3)
    private String currency = "SAR";

    @Size(max = 4)
    @Column(name = "merchant_category_code", length = 4)
    private String merchantCategoryCode;

    @Size(max = 255)
    @Column(name = "merchant_name")
    private String merchantName;

    @NotNull
    @Column(name = "transaction_date", nullable = false)
    private LocalDateTime transactionDate;

    @Column(name = "points_earned", precision = 10, scale = 2)
    private BigDecimal pointsEarned = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "redemption_status")
    private RedemptionStatus redemptionStatus;

    @Size(max = 255)
    @Column(name = "external_transaction_id")
    private String externalTransactionId;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "audit_trail", columnDefinition = "JSON")
    private Map<String, Object> auditTrail;

    // Additional fields for enhanced tracking
    @Column(name = "discount_amount", precision = 15, scale = 2)
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(name = "cashback_amount", precision = 15, scale = 2)
    private BigDecimal cashbackAmount = BigDecimal.ZERO;

    @Size(max = 500)
    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "processed_date")
    private LocalDateTime processedDate;

    @Size(max = 100)
    @Column(name = "processor_reference", length = 100)
    private String processorReference;

    // Constructors
    public Transaction() {
        super();
    }

    public Transaction(String transactionId, Customer customer, Card card, 
                      TransactionType transactionType, BigDecimal amount, 
                      LocalDateTime transactionDate) {
        this();
        this.transactionId = transactionId;
        this.customer = customer;
        this.card = card;
        this.transactionType = transactionType;
        this.amount = amount;
        this.transactionDate = transactionDate;
    }

    // Getters and Setters
    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    public Card getCard() { return card; }
    public void setCard(Card card) { this.card = card; }

    public Offer getOffer() { return offer; }
    public void setOffer(Offer offer) { this.offer = offer; }

    public TransactionType getTransactionType() { return transactionType; }
    public void setTransactionType(TransactionType transactionType) { this.transactionType = transactionType; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getMerchantCategoryCode() { return merchantCategoryCode; }
    public void setMerchantCategoryCode(String merchantCategoryCode) { this.merchantCategoryCode = merchantCategoryCode; }

    public String getMerchantName() { return merchantName; }
    public void setMerchantName(String merchantName) { this.merchantName = merchantName; }

    public LocalDateTime getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDateTime transactionDate) { this.transactionDate = transactionDate; }

    public BigDecimal getPointsEarned() { return pointsEarned; }
    public void setPointsEarned(BigDecimal pointsEarned) { this.pointsEarned = pointsEarned; }

    public RedemptionStatus getRedemptionStatus() { return redemptionStatus; }
    public void setRedemptionStatus(RedemptionStatus redemptionStatus) { this.redemptionStatus = redemptionStatus; }

    public String getExternalTransactionId() { return externalTransactionId; }
    public void setExternalTransactionId(String externalTransactionId) { this.externalTransactionId = externalTransactionId; }

    public Map<String, Object> getAuditTrail() { return auditTrail; }
    public void setAuditTrail(Map<String, Object> auditTrail) { this.auditTrail = auditTrail; }

    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }

    public BigDecimal getCashbackAmount() { return cashbackAmount; }
    public void setCashbackAmount(BigDecimal cashbackAmount) { this.cashbackAmount = cashbackAmount; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getProcessedDate() { return processedDate; }
    public void setProcessedDate(LocalDateTime processedDate) { this.processedDate = processedDate; }

    public String getProcessorReference() { return processorReference; }
    public void setProcessorReference(String processorReference) { this.processorReference = processorReference; }

    // Helper methods
    public BigDecimal getNetAmount() {
        return amount.subtract(discountAmount);
    }

    public BigDecimal getTotalBenefit() {
        return discountAmount.add(cashbackAmount).add(pointsEarned);
    }

    public boolean isRedemption() {
        return transactionType == TransactionType.REDEMPTION;
    }

    public boolean isPurchase() {
        return transactionType == TransactionType.PURCHASE;
    }

    public boolean isProcessed() {
        return processedDate != null;
    }

    public boolean isSuccessfulRedemption() {
        return isRedemption() && redemptionStatus == RedemptionStatus.COMPLETED;
    }

    // Enums
    public enum TransactionType {
        PURCHASE, REDEMPTION, REFUND, ADJUSTMENT
    }

    public enum RedemptionStatus {
        PENDING, COMPLETED, FAILED, CANCELLED
    }
}