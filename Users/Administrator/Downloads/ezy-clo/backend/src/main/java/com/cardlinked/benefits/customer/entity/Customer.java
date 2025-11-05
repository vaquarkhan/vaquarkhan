package com.cardlinked.benefits.customer.entity;

import com.cardlinked.benefits.common.entity.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "customers", indexes = {
    @Index(name = "idx_segment_type", columnList = "segment_type"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_created_date", columnList = "created_date"),
    @Index(name = "idx_customers_segment_status", columnList = "segment_type, status")
})
public class Customer extends BaseEntity {

    @Id
    @Column(name = "customer_id", length = 36)
    private String customerId;

    @NotBlank
    @Column(name = "encrypted_pan_token", nullable = false, unique = true)
    @Convert(converter = com.cardlinked.benefits.security.converter.EncryptedStringConverter.class)
    private String encryptedPanToken;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "segment_type", nullable = false)
    private SegmentType segmentType;

    @NotBlank
    @Size(max = 100)
    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @NotBlank
    @Size(max = 100)
    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Email
    @Size(max = 255)
    @Column(name = "email", length = 255)
    private String email;

    @Size(max = 20)
    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Size(max = 3)
    @Column(name = "nationality", length = 3)
    private String nationality;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private CustomerStatus status = CustomerStatus.ACTIVE;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Card> cards = new ArrayList<>();

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<SpendThreshold> spendThresholds = new ArrayList<>();

    // Constructors
    public Customer() {
        super();
    }

    public Customer(String customerId, String encryptedPanToken, SegmentType segmentType, 
                   String firstName, String lastName) {
        this();
        this.customerId = customerId;
        this.encryptedPanToken = encryptedPanToken;
        this.segmentType = segmentType;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    // Getters and Setters
    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }

    public String getEncryptedPanToken() { return encryptedPanToken; }
    public void setEncryptedPanToken(String encryptedPanToken) { this.encryptedPanToken = encryptedPanToken; }

    public SegmentType getSegmentType() { return segmentType; }
    public void setSegmentType(SegmentType segmentType) { this.segmentType = segmentType; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getNationality() { return nationality; }
    public void setNationality(String nationality) { this.nationality = nationality; }

    public CustomerStatus getStatus() { return status; }
    public void setStatus(CustomerStatus status) { this.status = status; }

    public List<Card> getCards() { return cards; }
    public void setCards(List<Card> cards) { this.cards = cards; }

    public List<SpendThreshold> getSpendThresholds() { return spendThresholds; }
    public void setSpendThresholds(List<SpendThreshold> spendThresholds) { this.spendThresholds = spendThresholds; }

    // Helper methods
    public String getFullName() {
        return firstName + " " + lastName;
    }

    public void addCard(Card card) {
        cards.add(card);
        card.setCustomer(this);
    }

    public void removeCard(Card card) {
        cards.remove(card);
        card.setCustomer(null);
    }

    // Enums
    public enum SegmentType {
        MASS, ADVANCE, PREMIER, TOP_TIER, PRIVATE
    }

    public enum CustomerStatus {
        ACTIVE, INACTIVE, SUSPENDED
    }
}