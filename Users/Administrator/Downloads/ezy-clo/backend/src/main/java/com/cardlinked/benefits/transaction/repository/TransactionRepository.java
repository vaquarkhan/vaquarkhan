package com.cardlinked.benefits.transaction.repository;

import com.cardlinked.benefits.transaction.entity.Transaction;
import com.cardlinked.benefits.customer.entity.Customer;
import com.cardlinked.benefits.customer.entity.Card;
import com.cardlinked.benefits.offers.entity.Offer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, String> {

    // Customer-related queries
    List<Transaction> findByCustomerOrderByTransactionDateDesc(Customer customer);
    
    Page<Transaction> findByCustomer(Customer customer, Pageable pageable);
    
    List<Transaction> findByCustomerAndTransactionType(Customer customer, Transaction.TransactionType transactionType);

    // Card-related queries
    List<Transaction> findByCardOrderByTransactionDateDesc(Card card);
    
    List<Transaction> findByCardAndTransactionDateBetween(Card card, LocalDateTime startDate, LocalDateTime endDate);

    // Offer-related queries
    List<Transaction> findByOfferAndTransactionType(Offer offer, Transaction.TransactionType transactionType);
    
    long countByOfferAndTransactionType(Offer offer, Transaction.TransactionType transactionType);

    // Transaction type queries
    List<Transaction> findByTransactionTypeAndTransactionDateBetween(Transaction.TransactionType transactionType, 
                                                                   LocalDateTime startDate, LocalDateTime endDate);

    // Date-based queries
    List<Transaction> findByTransactionDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT t FROM Transaction t WHERE DATE(t.transactionDate) = CURRENT_DATE")
    List<Transaction> findTodaysTransactions();

    // Amount-based queries
    List<Transaction> findByAmountGreaterThanEqual(BigDecimal amount);
    
    @Query("SELECT t FROM Transaction t WHERE t.amount BETWEEN :minAmount AND :maxAmount")
    List<Transaction> findByAmountRange(@Param("minAmount") BigDecimal minAmount, 
                                       @Param("maxAmount") BigDecimal maxAmount);

    // Merchant-related queries
    List<Transaction> findByMerchantCategoryCodeAndTransactionDateBetween(String merchantCategoryCode, 
                                                                         LocalDateTime startDate, 
                                                                         LocalDateTime endDate);
    
    List<Transaction> findByMerchantNameContainingIgnoreCase(String merchantName);

    // Redemption status queries
    List<Transaction> findByRedemptionStatus(Transaction.RedemptionStatus redemptionStatus);
    
    @Query("SELECT t FROM Transaction t WHERE t.transactionType = 'REDEMPTION' AND t.redemptionStatus = 'PENDING'")
    List<Transaction> findPendingRedemptions();

    // Analytics queries
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.customer = :customer AND t.transactionType = 'PURCHASE' " +
           "AND t.transactionDate BETWEEN :startDate AND :endDate")
    BigDecimal calculateCustomerSpend(@Param("customer") Customer customer, 
                                     @Param("startDate") LocalDateTime startDate, 
                                     @Param("endDate") LocalDateTime endDate);

    @Query("SELECT SUM(t.pointsEarned) FROM Transaction t WHERE t.customer = :customer " +
           "AND t.transactionDate BETWEEN :startDate AND :endDate")
    BigDecimal calculateCustomerPointsEarned(@Param("customer") Customer customer, 
                                           @Param("startDate") LocalDateTime startDate, 
                                           @Param("endDate") LocalDateTime endDate);

    @Query("SELECT t.merchantCategoryCode, COUNT(t), SUM(t.amount) FROM Transaction t " +
           "WHERE t.transactionType = 'PURCHASE' AND t.transactionDate BETWEEN :startDate AND :endDate " +
           "GROUP BY t.merchantCategoryCode ORDER BY SUM(t.amount) DESC")
    List<Object[]> getSpendByMerchantCategory(@Param("startDate") LocalDateTime startDate, 
                                             @Param("endDate") LocalDateTime endDate);

    @Query("SELECT DATE(t.transactionDate), COUNT(t), SUM(t.amount) FROM Transaction t " +
           "WHERE t.transactionType = 'PURCHASE' AND t.transactionDate BETWEEN :startDate AND :endDate " +
           "GROUP BY DATE(t.transactionDate) ORDER BY DATE(t.transactionDate)")
    List<Object[]> getDailyTransactionSummary(@Param("startDate") LocalDateTime startDate, 
                                             @Param("endDate") LocalDateTime endDate);

    // Performance queries
    @Query("SELECT t.offer, COUNT(t) as redemptionCount FROM Transaction t " +
           "WHERE t.transactionType = 'REDEMPTION' AND t.redemptionStatus = 'COMPLETED' " +
           "GROUP BY t.offer ORDER BY redemptionCount DESC")
    List<Object[]> getMostRedeemedOffers(Pageable pageable);

    @Query("SELECT c.segmentType, COUNT(t), SUM(t.amount) FROM Transaction t " +
           "JOIN t.customer c WHERE t.transactionType = 'PURCHASE' " +
           "AND t.transactionDate BETWEEN :startDate AND :endDate " +
           "GROUP BY c.segmentType")
    List<Object[]> getSpendByCustomerSegment(@Param("startDate") LocalDateTime startDate, 
                                           @Param("endDate") LocalDateTime endDate);

    // Fraud detection queries
    @Query("SELECT t FROM Transaction t WHERE t.customer = :customer " +
           "AND t.amount > :threshold AND t.transactionDate >= :since")
    List<Transaction> findHighValueTransactions(@Param("customer") Customer customer, 
                                              @Param("threshold") BigDecimal threshold, 
                                              @Param("since") LocalDateTime since);

    @Query("SELECT t FROM Transaction t WHERE t.card = :card " +
           "AND t.transactionDate BETWEEN :startTime AND :endTime " +
           "GROUP BY t.merchantCategoryCode HAVING COUNT(t) > :maxTransactions")
    List<Transaction> findSuspiciousTransactionPatterns(@Param("card") Card card, 
                                                       @Param("startTime") LocalDateTime startTime, 
                                                       @Param("endTime") LocalDateTime endTime, 
                                                       @Param("maxTransactions") int maxTransactions);

    // Compliance and audit queries
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.transactionDate >= :startDate AND t.transactionDate < :endDate")
    long countTransactionsInPeriod(@Param("startDate") LocalDateTime startDate, 
                                  @Param("endDate") LocalDateTime endDate);

    @Query("SELECT t FROM Transaction t WHERE t.externalTransactionId = :externalId")
    List<Transaction> findByExternalTransactionId(@Param("externalId") String externalTransactionId);

    // Search functionality
    @Query("SELECT t FROM Transaction t WHERE " +
           "t.externalTransactionId LIKE CONCAT('%', :searchTerm, '%') OR " +
           "t.merchantName LIKE CONCAT('%', :searchTerm, '%') OR " +
           "t.description LIKE CONCAT('%', :searchTerm, '%')")
    Page<Transaction> searchTransactions(@Param("searchTerm") String searchTerm, Pageable pageable);
}