package com.cardlinked.benefits.offers.repository;

import com.cardlinked.benefits.offers.entity.Offer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OfferRepository extends JpaRepository<Offer, String> {

    // Status-based queries
    List<Offer> findByStatus(Offer.OfferStatus status);
    
    Page<Offer> findByStatus(Offer.OfferStatus status, Pageable pageable);
    
    long countByStatus(Offer.OfferStatus status);

    // Category-based queries
    List<Offer> findByCategoryAndStatus(String category, Offer.OfferStatus status);
    
    Page<Offer> findByCategory(String category, Pageable pageable);

    // Merchant-based queries
    List<Offer> findByMerchantNameAndStatus(String merchantName, Offer.OfferStatus status);
    
    Page<Offer> findByMerchantNameContainingIgnoreCase(String merchantName, Pageable pageable);

    // Date-based queries
    @Query("SELECT o FROM Offer o WHERE o.startDate <= :now AND o.endDate >= :now AND o.status = :status")
    List<Offer> findActiveOffers(@Param("now") LocalDateTime now, @Param("status") Offer.OfferStatus status);

    @Query("SELECT o FROM Offer o WHERE o.endDate < :now AND o.status = 'ACTIVE'")
    List<Offer> findExpiredOffers(@Param("now") LocalDateTime now);

    @Query("SELECT o FROM Offer o WHERE o.endDate BETWEEN :startDate AND :endDate")
    List<Offer> findOffersExpiringInPeriod(@Param("startDate") LocalDateTime startDate, 
                                          @Param("endDate") LocalDateTime endDate);

    // Redemption-based queries
    @Query("SELECT o FROM Offer o WHERE o.maxRedemptions IS NOT NULL AND o.currentRedemptions >= o.maxRedemptions")
    List<Offer> findFullyRedeemedOffers();

    @Query("SELECT o FROM Offer o WHERE o.maxRedemptions IS NULL OR o.currentRedemptions < o.maxRedemptions")
    List<Offer> findOffersWithAvailableRedemptions();

    // Search functionality
    @Query("SELECT o FROM Offer o WHERE " +
           "LOWER(o.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(o.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(o.merchantName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(o.category) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Offer> searchOffers(@Param("searchTerm") String searchTerm, Pageable pageable);

    // Analytics queries
    @Query("SELECT o.category, COUNT(o) FROM Offer o WHERE o.status = :status GROUP BY o.category")
    List<Object[]> countOffersByCategory(@Param("status") Offer.OfferStatus status);

    @Query("SELECT o.merchantName, COUNT(o) FROM Offer o WHERE o.status = :status GROUP BY o.merchantName")
    List<Object[]> countOffersByMerchant(@Param("status") Offer.OfferStatus status);

    @Query("SELECT o.discountType, AVG(o.discountValue) FROM Offer o WHERE o.status = :status GROUP BY o.discountType")
    List<Object[]> getAverageDiscountByType(@Param("status") Offer.OfferStatus status);

    // Performance queries
    @Query("SELECT o FROM Offer o WHERE o.currentRedemptions > 0 ORDER BY o.currentRedemptions DESC")
    List<Offer> findMostPopularOffers(Pageable pageable);

    @Query("SELECT o.category, SUM(o.currentRedemptions) FROM Offer o GROUP BY o.category ORDER BY SUM(o.currentRedemptions) DESC")
    List<Object[]> getMostPopularCategories();

    // Eligibility and rules queries
    @Query("SELECT o FROM Offer o WHERE JSON_EXTRACT(o.eligibilityCriteria, '$.segments') LIKE %:segment%")
    List<Offer> findOffersBySegment(@Param("segment") String segment);

    @Query("SELECT o FROM Offer o WHERE JSON_EXTRACT(o.eligibilityCriteria, '$.cardTypes') LIKE %:cardType%")
    List<Offer> findOffersByCardType(@Param("cardType") String cardType);

    // Maintenance queries
    @Query("SELECT o FROM Offer o WHERE o.status = 'ACTIVE' AND o.endDate < :cutoffDate")
    List<Offer> findOffersToArchive(@Param("cutoffDate") LocalDateTime cutoffDate);

    @Query("SELECT COUNT(o) FROM Offer o WHERE o.createdDate >= :startDate AND o.createdDate < :endDate")
    long countNewOffersInPeriod(@Param("startDate") LocalDateTime startDate, 
                               @Param("endDate") LocalDateTime endDate);

    // Discount type queries
    List<Offer> findByDiscountTypeAndStatus(Offer.DiscountType discountType, Offer.OfferStatus status);
    
    // Redemption type queries
    List<Offer> findByRedemptionTypeAndStatus(Offer.RedemptionType redemptionType, Offer.OfferStatus status);
}