package com.cardlinked.benefits.offers.service;

import com.cardlinked.benefits.offers.entity.Offer;
import com.cardlinked.benefits.offers.repository.OfferRepository;
import com.cardlinked.benefits.common.exception.OfferNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class OfferService {

    private final OfferRepository offerRepository;
    private final OfferRulesEngine offerRulesEngine;

    @Autowired
    public OfferService(OfferRepository offerRepository, OfferRulesEngine offerRulesEngine) {
        this.offerRepository = offerRepository;
        this.offerRulesEngine = offerRulesEngine;
    }

    // Create offer
    public Offer createOffer(Offer offer) {
        if (offer.getOfferId() == null) {
            offer.setOfferId(UUID.randomUUID().toString());
        }
        
        // Validate offer rules
        offerRulesEngine.validateOfferRules(offer);
        
        // Set initial status
        offer.setStatus(Offer.OfferStatus.DRAFT);
        
        return offerRepository.save(offer);
    }

    // Update offer with ID parameter
    public Offer updateOffer(String offerId, Offer updatedOffer) {
        Offer existingOffer = getOfferById(offerId);
        
        // Update fields
        existingOffer.setTitle(updatedOffer.getTitle());
        existingOffer.setDescription(updatedOffer.getDescription());
        existingOffer.setMerchantName(updatedOffer.getMerchantName());
        existingOffer.setCategory(updatedOffer.getCategory());
        existingOffer.setDiscountType(updatedOffer.getDiscountType());
        existingOffer.setDiscountValue(updatedOffer.getDiscountValue());
        existingOffer.setCurrency(updatedOffer.getCurrency());
        existingOffer.setRedemptionType(updatedOffer.getRedemptionType());
        existingOffer.setRulesConfig(updatedOffer.getRulesConfig());
        existingOffer.setEligibilityCriteria(updatedOffer.getEligibilityCriteria());
        existingOffer.setStartDate(updatedOffer.getStartDate());
        existingOffer.setEndDate(updatedOffer.getEndDate());
        existingOffer.setMaxRedemptions(updatedOffer.getMaxRedemptions());
        existingOffer.setImageUrl(updatedOffer.getImageUrl());
        existingOffer.setTermsConditions(updatedOffer.getTermsConditions());
        
        // Validate updated rules
        offerRulesEngine.validateOfferRules(existingOffer);
        
        return offerRepository.save(existingOffer);
    }

    // Update offer (overloaded method)
    public Offer updateOffer(Offer offer) {
        return updateOffer(offer.getOfferId(), offer);
    }

    // Get offer by ID
    @Transactional(readOnly = true)
    public Offer getOfferById(String offerId) {
        return offerRepository.findById(offerId)
                .orElseThrow(() -> new OfferNotFoundException("Offer not found with ID: " + offerId));
    }

    // Get all offers with pagination
    @Transactional(readOnly = true)
    public Page<Offer> getAllOffers(Pageable pageable) {
        return offerRepository.findAll(pageable);
    }

    // Get all offers without pagination
    @Transactional(readOnly = true)
    public List<Offer> getAllOffers() {
        return offerRepository.findAll();
    }

    // Get offers by status
    @Transactional(readOnly = true)
    public List<Offer> getOffersByStatus(Offer.OfferStatus status) {
        return offerRepository.findByStatus(status);
    }

    // Get active offers
    @Transactional(readOnly = true)
    public List<Offer> getActiveOffers() {
        return offerRepository.findActiveOffers(LocalDateTime.now(), Offer.OfferStatus.ACTIVE);
    }

    // Get offers by category
    @Transactional(readOnly = true)
    public List<Offer> getOffersByCategory(String category) {
        return offerRepository.findByCategoryAndStatus(category, Offer.OfferStatus.ACTIVE);
    }

    // Get offers by merchant
    @Transactional(readOnly = true)
    public List<Offer> getOffersByMerchant(String merchantName) {
        return offerRepository.findByMerchantNameAndStatus(merchantName, Offer.OfferStatus.ACTIVE);
    }

    // Search offers
    @Transactional(readOnly = true)
    public Page<Offer> searchOffers(String searchTerm, Pageable pageable) {
        return offerRepository.searchOffers(searchTerm, pageable);
    }

    // Offer lifecycle management
    public Offer activateOffer(String offerId) {
        Offer offer = getOfferById(offerId);
        
        // Validate offer can be activated
        if (offer.getStartDate().isAfter(LocalDateTime.now())) {
            throw new IllegalStateException("Cannot activate offer before start date");
        }
        
        if (offer.getEndDate().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Cannot activate expired offer");
        }
        
        offer.setStatus(Offer.OfferStatus.ACTIVE);
        return offerRepository.save(offer);
    }

    public Offer expireOffer(String offerId) {
        Offer offer = getOfferById(offerId);
        offer.setStatus(Offer.OfferStatus.EXPIRED);
        return offerRepository.save(offer);
    }

    public Offer archiveOffer(String offerId) {
        Offer offer = getOfferById(offerId);
        offer.setStatus(Offer.OfferStatus.ARCHIVED);
        return offerRepository.save(offer);
    }

    public Offer deactivateOffer(String offerId) {
        Offer offer = getOfferById(offerId);
        offer.setStatus(Offer.OfferStatus.EXPIRED);
        return offerRepository.save(offer);
    }

    // Redemption management
    public Offer redeemOffer(String offerId) {
        Offer offer = getOfferById(offerId);
        
        // Validate offer can be redeemed
        if (!offer.isActive()) {
            throw new IllegalStateException("Offer is not active");
        }
        
        if (!offer.hasRedemptionsAvailable()) {
            throw new IllegalStateException("No redemptions available for this offer");
        }
        
        offer.incrementRedemptions();
        return offerRepository.save(offer);
    }

    // Analytics and reporting
    @Transactional(readOnly = true)
    public List<Object[]> getOfferAnalyticsByCategory() {
        return offerRepository.countOffersByCategory(Offer.OfferStatus.ACTIVE);
    }

    @Transactional(readOnly = true)
    public List<Object[]> getOfferAnalyticsByMerchant() {
        return offerRepository.countOffersByMerchant(Offer.OfferStatus.ACTIVE);
    }

    @Transactional(readOnly = true)
    public List<Offer> getMostPopularOffers(int limit) {
        return offerRepository.findMostPopularOffers(Pageable.ofSize(limit));
    }

    @Transactional(readOnly = true)
    public List<Object[]> getMostPopularCategories() {
        return offerRepository.getMostPopularCategories();
    }

    // Eligibility checking
    @Transactional(readOnly = true)
    public List<Offer> getEligibleOffers(String customerId, String cardId) {
        // This will be implemented with the rules engine
        return offerRulesEngine.getEligibleOffers(customerId, cardId);
    }

    // Maintenance operations
    public void processExpiredOffers() {
        List<Offer> expiredOffers = offerRepository.findExpiredOffers(LocalDateTime.now());
        for (Offer offer : expiredOffers) {
            offer.setStatus(Offer.OfferStatus.EXPIRED);
        }
        offerRepository.saveAll(expiredOffers);
    }

    public void archiveOldOffers(int daysOld) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(daysOld);
        List<Offer> offersToArchive = offerRepository.findOffersToArchive(cutoffDate);
        for (Offer offer : offersToArchive) {
            offer.setStatus(Offer.OfferStatus.ARCHIVED);
        }
        offerRepository.saveAll(offersToArchive);
    }

    // Statistics
    @Transactional(readOnly = true)
    public long getNewOffersCount(LocalDateTime startDate, LocalDateTime endDate) {
        return offerRepository.countNewOffersInPeriod(startDate, endDate);
    }

    @Transactional(readOnly = true)
    public long getOffersCountByStatus(Offer.OfferStatus status) {
        return offerRepository.countByStatus(status);
    }
}