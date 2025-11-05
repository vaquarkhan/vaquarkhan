package com.cardlinked.benefits.customer.repository;

import com.cardlinked.benefits.customer.entity.Card;
import com.cardlinked.benefits.customer.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface CardRepository extends JpaRepository<Card, String> {

    // Customer-related queries
    List<Card> findByCustomerAndStatus(Customer customer, Card.CardStatus status);
    
    List<Card> findByCustomerCustomerId(String customerId);
    
    Optional<Card> findByCustomerAndIsPrimaryTrue(Customer customer);

    // Card type queries
    List<Card> findByCardTypeAndStatus(Card.CardType cardType, Card.CardStatus status);
    
    long countByCardType(Card.CardType cardType);

    // BIN range queries
    List<Card> findByBinRangeAndStatus(String binRange, Card.CardStatus status);
    
    @Query("SELECT c FROM Card c WHERE c.binRange LIKE :binPrefix% AND c.status = :status")
    List<Card> findByBinPrefixAndStatus(@Param("binPrefix") String binPrefix, 
                                       @Param("status") Card.CardStatus status);

    // Expiry date queries
    List<Card> findByExpiryDateBefore(LocalDate date);
    
    @Query("SELECT c FROM Card c WHERE c.expiryDate BETWEEN :startDate AND :endDate AND c.status = 'ACTIVE'")
    List<Card> findCardsExpiringInPeriod(@Param("startDate") LocalDate startDate, 
                                        @Param("endDate") LocalDate endDate);

    // Status queries
    List<Card> findByStatus(Card.CardStatus status);
    
    long countByStatus(Card.CardStatus status);

    // Analytics queries
    @Query("SELECT c.cardType, COUNT(c) FROM Card c WHERE c.status = :status GROUP BY c.cardType")
    List<Object[]> countCardsByTypeAndStatus(@Param("status") Card.CardStatus status);

    @Query("SELECT c.customer.segmentType, c.cardType, COUNT(c) FROM Card c " +
           "WHERE c.status = :status GROUP BY c.customer.segmentType, c.cardType")
    List<Object[]> countCardsBySegmentAndType(@Param("status") Card.CardStatus status);

    // Security and compliance queries
    @Query("SELECT c FROM Card c WHERE c.lastFourDigits = :lastFour AND c.customer.id != :customerId")
    List<Card> findPotentialDuplicateCards(@Param("lastFour") String lastFour, 
                                          @Param("customerId") String customerId);
}