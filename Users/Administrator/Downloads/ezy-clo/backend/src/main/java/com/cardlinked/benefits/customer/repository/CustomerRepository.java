package com.cardlinked.benefits.customer.repository;

import com.cardlinked.benefits.customer.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, String> {

    // Golden Records - ExyCLO methodology queries
    Optional<Customer> findByEncryptedPanToken(String encryptedPanToken);
    
    List<Customer> findByEmailIgnoreCase(String email);
    
    List<Customer> findByPhoneAndStatus(String phone, Customer.CustomerStatus status);
    
    @Query("SELECT c FROM Customer c WHERE " +
           "LOWER(c.firstName) = LOWER(:firstName) AND " +
           "LOWER(c.lastName) = LOWER(:lastName) AND " +
           "c.dateOfBirth = :dateOfBirth")
    List<Customer> findPotentialDuplicates(@Param("firstName") String firstName,
                                          @Param("lastName") String lastName,
                                          @Param("dateOfBirth") java.time.LocalDate dateOfBirth);

    // Segment-based queries
    List<Customer> findBySegmentTypeAndStatus(Customer.SegmentType segmentType, 
                                            Customer.CustomerStatus status);
    
    Page<Customer> findBySegmentType(Customer.SegmentType segmentType, Pageable pageable);

    // Status-based queries
    List<Customer> findByStatus(Customer.CustomerStatus status);
    
    long countByStatus(Customer.CustomerStatus status);

    // Date range queries
    List<Customer> findByCreatedDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT c FROM Customer c WHERE c.createdDate >= :date")
    List<Customer> findRecentCustomers(@Param("date") LocalDateTime date);

    // Complex queries for analytics
    @Query("SELECT c.segmentType, COUNT(c) FROM Customer c WHERE c.status = :status GROUP BY c.segmentType")
    List<Object[]> countCustomersBySegmentAndStatus(@Param("status") Customer.CustomerStatus status);

    @Query("SELECT c FROM Customer c JOIN c.cards card WHERE card.cardType = :cardType AND c.status = :status")
    List<Customer> findByCardTypeAndStatus(@Param("cardType") com.cardlinked.benefits.customer.entity.Card.CardType cardType,
                                         @Param("status") Customer.CustomerStatus status);

    // Golden Records - Data quality queries
    @Query("SELECT c FROM Customer c WHERE c.email IS NULL OR c.phone IS NULL")
    List<Customer> findCustomersWithMissingContactInfo();

    @Query("SELECT c FROM Customer c WHERE " +
           "EXISTS (SELECT c2 FROM Customer c2 WHERE c2.id != c.id AND " +
           "LOWER(c2.firstName) = LOWER(c.firstName) AND " +
           "LOWER(c2.lastName) = LOWER(c.lastName) AND " +
           "c2.dateOfBirth = c.dateOfBirth)")
    List<Customer> findPotentialDuplicateCustomers();

    // Search functionality
    @Query("SELECT c FROM Customer c WHERE " +
           "LOWER(CONCAT(c.firstName, ' ', c.lastName)) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "c.email LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "c.phone LIKE CONCAT('%', :searchTerm, '%')")
    Page<Customer> searchCustomers(@Param("searchTerm") String searchTerm, Pageable pageable);

    // Compliance and audit queries
    @Query("SELECT c FROM Customer c WHERE c.lastUpdated < :cutoffDate")
    List<Customer> findStaleCustomerRecords(@Param("cutoffDate") LocalDateTime cutoffDate);

    @Query("SELECT COUNT(c) FROM Customer c WHERE c.createdDate >= :startDate AND c.createdDate < :endDate")
    long countNewCustomersInPeriod(@Param("startDate") LocalDateTime startDate, 
                                  @Param("endDate") LocalDateTime endDate);
}