package com.cardlinked.benefits.offers.service;

import com.cardlinked.benefits.offers.entity.Offer;
import com.cardlinked.benefits.offers.repository.OfferRepository;
import com.cardlinked.benefits.customer.entity.Customer;
import com.cardlinked.benefits.customer.entity.Card;
import com.cardlinked.benefits.customer.entity.SpendThreshold;
import com.cardlinked.benefits.customer.service.CustomerService;
import com.cardlinked.benefits.customer.repository.SpendThresholdRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class OfferEligibilityService {

    private final OfferRepository offerRepository;
    private final CustomerService customerService;
    private final SpendThresholdRepository spendThresholdRepository;
    private final OfferRulesEngine offerRulesEngine;

    @Autowired
    public OfferEligibilityService(OfferRepository offerRepository,
                                  CustomerService customerService,
                                  SpendThresholdRepository spendThresholdRepository,
                                  OfferRulesEngine offerRulesEngine) {
        this.offerRepository = offerRepository;
        this.customerService = customerService;
        this.spendThresholdRepository = spendThresholdRepository;
        this.offerRulesEngine = offerRulesEngine;
    }

    /**
     * Get all eligible offers for a customer and specific card
     */
    public List<EligibleOffer> getEligibleOffers(String customerId, String cardId) {
        Customer customer = customerService.getCustomerById(customerId);
        List<Card> customerCards = customerService.getActiveCustomerCards(customerId);
        
        Card selectedCard = customerCards.stream()
                .filter(card -> card.getCardId().equals(cardId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Card not found or not active"));

        // Get all active offers
        List<Offer> activeOffers = offerRepository.findActiveOffers(LocalDateTime.now(), Offer.OfferStatus.ACTIVE);
        
        return activeOffers.stream()
                .map(offer -> evaluateOfferEligibility(customer, selectedCard, offer))
                .filter(eligibleOffer -> eligibleOffer.isEligible() || eligibleOffer.isPartiallyEligible())
                .collect(Collectors.toList());
    }

    /**
     * Get eligible offers for customer across all cards
     */
    public List<EligibleOffer> getEligibleOffersAllCards(String customerId) {
        Customer customer = customerService.getCustomerById(customerId);
        List<Card> customerCards = customerService.getActiveCustomerCards(customerId);
        
        List<Offer> activeOffers = offerRepository.findActiveOffers(LocalDateTime.now(), Offer.OfferStatus.ACTIVE);
        
        return activeOffers.stream()
                .map(offer -> {
                    // Find the best eligible card for this offer
                    EligibleOffer bestEligibility = null;
                    for (Card card : customerCards) {
                        EligibleOffer eligibility = evaluateOfferEligibility(customer, card, offer);
                        if (bestEligibility == null || 
                            (eligibility.isEligible() && !bestEligibility.isEligible()) ||
                            (eligibility.getEligibilityScore() > bestEligibility.getEligibilityScore())) {
                            bestEligibility = eligibility;
                        }
                    }
                    return bestEligibility;
                })
                .filter(eligibleOffer -> eligibleOffer != null && 
                       (eligibleOffer.isEligible() || eligibleOffer.isPartiallyEligible()))
                .collect(Collectors.toList());
    }

    /**
     * Get offers by customer segment
     */
    public List<EligibleOffer> getOffersBySegment(Customer.SegmentType segmentType) {
        List<Offer> segmentOffers = offerRepository.findOffersBySegment(segmentType.name());
        
        return segmentOffers.stream()
                .map(offer -> {
                    EligibleOffer eligibleOffer = new EligibleOffer(offer);
                    eligibleOffer.setEligible(true);
                    eligibleOffer.setEligibilityReason("Available for " + segmentType + " segment");
                    return eligibleOffer;
                })
                .collect(Collectors.toList());
    }

    /**
     * Get offers by card type
     */
    public List<EligibleOffer> getOffersByCardType(Card.CardType cardType) {
        List<Offer> cardTypeOffers = offerRepository.findOffersByCardType(cardType.name());
        
        return cardTypeOffers.stream()
                .map(offer -> {
                    EligibleOffer eligibleOffer = new EligibleOffer(offer);
                    eligibleOffer.setEligible(true);
                    eligibleOffer.setEligibilityReason("Available for " + cardType + " cards");
                    return eligibleOffer;
                })
                .collect(Collectors.toList());
    }

    /**
     * Check specific offer eligibility for customer and card
     */
    public EligibleOffer checkOfferEligibility(String customerId, String cardId, String offerId) {
        Customer customer = customerService.getCustomerById(customerId);
        List<Card> customerCards = customerService.getActiveCustomerCards(customerId);
        
        Card selectedCard = customerCards.stream()
                .filter(card -> card.getCardId().equals(cardId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Card not found or not active"));

        Offer offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new RuntimeException("Offer not found"));

        return evaluateOfferEligibility(customer, selectedCard, offer);
    }

    /**
     * Get spend-based offers that customer is close to unlocking
     */
    public List<EligibleOffer> getNearlyEligibleOffers(String customerId, String cardId) {
        Customer customer = customerService.getCustomerById(customerId);
        List<Card> customerCards = customerService.getActiveCustomerCards(customerId);
        
        Card selectedCard = customerCards.stream()
                .filter(card -> card.getCardId().equals(cardId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Card not found or not active"));

        List<Offer> activeOffers = offerRepository.findActiveOffers(LocalDateTime.now(), Offer.OfferStatus.ACTIVE);
        
        return activeOffers.stream()
                .map(offer -> evaluateOfferEligibility(customer, selectedCard, offer))
                .filter(eligibleOffer -> eligibleOffer.isPartiallyEligible() && 
                       eligibleOffer.getRemainingSpendRequired().compareTo(BigDecimal.valueOf(1000)) <= 0)
                .collect(Collectors.toList());
    }

    // Private helper methods
    private EligibleOffer evaluateOfferEligibility(Customer customer, Card card, Offer offer) {
        EligibleOffer eligibleOffer = new EligibleOffer(offer);
        eligibleOffer.setCard(card);
        
        // Check basic eligibility
        if (!offer.isActive()) {
            eligibleOffer.setEligible(false);
            eligibleOffer.setEligibilityReason("Offer is not active");
            return eligibleOffer;
        }

        if (!offer.hasRedemptionsAvailable()) {
            eligibleOffer.setEligible(false);
            eligibleOffer.setEligibilityReason("No redemptions available");
            return eligibleOffer;
        }

        // Check rules engine eligibility
        if (!offerRulesEngine.isCustomerEligible(customer, card, offer)) {
            eligibleOffer.setEligible(false);
            eligibleOffer.setEligibilityReason("Does not meet offer criteria");
            return eligibleOffer;
        }

        // Check spend threshold requirements
        SpendThresholdEligibility spendEligibility = checkSpendThresholdEligibility(customer, card, offer);
        
        if (spendEligibility.isEligible()) {
            eligibleOffer.setEligible(true);
            eligibleOffer.setEligibilityReason("Fully eligible");
            eligibleOffer.setEligibilityScore(100);
        } else if (spendEligibility.isPartiallyEligible()) {
            eligibleOffer.setEligible(false);
            eligibleOffer.setPartiallyEligible(true);
            eligibleOffer.setEligibilityReason("Spend threshold not met");
            eligibleOffer.setRemainingSpendRequired(spendEligibility.getRemainingSpend());
            eligibleOffer.setCurrentSpend(spendEligibility.getCurrentSpend());
            eligibleOffer.setRequiredSpend(spendEligibility.getRequiredSpend());
            eligibleOffer.setEligibilityScore(spendEligibility.getProgressPercentage());
        } else {
            eligibleOffer.setEligible(false);
            eligibleOffer.setEligibilityReason("Spend requirements not met");
        }

        return eligibleOffer;
    }

    private SpendThresholdEligibility checkSpendThresholdEligibility(Customer customer, Card card, Offer offer) {
        Map<String, Object> eligibilityCriteria = offer.getEligibilityCriteria();
        
        if (eligibilityCriteria == null || !eligibilityCriteria.containsKey("spendThreshold")) {
            return new SpendThresholdEligibility(true, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO);
        }

        @SuppressWarnings("unchecked")
        Map<String, Object> spendThresholdConfig = (Map<String, Object>) eligibilityCriteria.get("spendThreshold");
        
        String thresholdType = (String) spendThresholdConfig.get("type"); // monthly, yearly, etc.
        BigDecimal requiredAmount = new BigDecimal(spendThresholdConfig.get("amount").toString());
        
        // Get current spend threshold for the card
        SpendThreshold.ThresholdType thresholdTypeEnum = SpendThreshold.ThresholdType.valueOf(thresholdType.toUpperCase());
        
        List<SpendThreshold> thresholds = spendThresholdRepository.findByCardAndThresholdTypeAndStatus(
            card, thresholdTypeEnum, SpendThreshold.ThresholdStatus.ACTIVE);
        
        if (thresholds.isEmpty()) {
            return new SpendThresholdEligibility(false, BigDecimal.ZERO, requiredAmount, requiredAmount);
        }

        SpendThreshold threshold = thresholds.get(0);
        BigDecimal currentSpend = threshold.getCurrentSpend();
        
        if (currentSpend.compareTo(requiredAmount) >= 0) {
            return new SpendThresholdEligibility(true, currentSpend, requiredAmount, BigDecimal.ZERO);
        } else {
            BigDecimal remainingSpend = requiredAmount.subtract(currentSpend);
            return new SpendThresholdEligibility(false, currentSpend, requiredAmount, remainingSpend);
        }
    }

    // Inner classes
    public static class EligibleOffer {
        private Offer offer;
        private Card card;
        private boolean eligible;
        private boolean partiallyEligible;
        private String eligibilityReason;
        private BigDecimal remainingSpendRequired;
        private BigDecimal currentSpend;
        private BigDecimal requiredSpend;
        private int eligibilityScore; // 0-100

        public EligibleOffer(Offer offer) {
            this.offer = offer;
            this.eligible = false;
            this.partiallyEligible = false;
            this.eligibilityScore = 0;
        }

        // Getters and setters
        public Offer getOffer() { return offer; }
        public void setOffer(Offer offer) { this.offer = offer; }

        public Card getCard() { return card; }
        public void setCard(Card card) { this.card = card; }

        public boolean isEligible() { return eligible; }
        public void setEligible(boolean eligible) { this.eligible = eligible; }

        public boolean isPartiallyEligible() { return partiallyEligible; }
        public void setPartiallyEligible(boolean partiallyEligible) { this.partiallyEligible = partiallyEligible; }

        public String getEligibilityReason() { return eligibilityReason; }
        public void setEligibilityReason(String eligibilityReason) { this.eligibilityReason = eligibilityReason; }

        public BigDecimal getRemainingSpendRequired() { return remainingSpendRequired; }
        public void setRemainingSpendRequired(BigDecimal remainingSpendRequired) { this.remainingSpendRequired = remainingSpendRequired; }

        public BigDecimal getCurrentSpend() { return currentSpend; }
        public void setCurrentSpend(BigDecimal currentSpend) { this.currentSpend = currentSpend; }

        public BigDecimal getRequiredSpend() { return requiredSpend; }
        public void setRequiredSpend(BigDecimal requiredSpend) { this.requiredSpend = requiredSpend; }

        public int getEligibilityScore() { return eligibilityScore; }
        public void setEligibilityScore(int eligibilityScore) { this.eligibilityScore = eligibilityScore; }
    }

    private static class SpendThresholdEligibility {
        private boolean eligible;
        private BigDecimal currentSpend;
        private BigDecimal requiredSpend;
        private BigDecimal remainingSpend;

        public SpendThresholdEligibility(boolean eligible, BigDecimal currentSpend, 
                                       BigDecimal requiredSpend, BigDecimal remainingSpend) {
            this.eligible = eligible;
            this.currentSpend = currentSpend;
            this.requiredSpend = requiredSpend;
            this.remainingSpend = remainingSpend;
        }

        public boolean isEligible() { return eligible; }
        public boolean isPartiallyEligible() { return !eligible && currentSpend.compareTo(BigDecimal.ZERO) > 0; }
        public BigDecimal getCurrentSpend() { return currentSpend; }
        public BigDecimal getRequiredSpend() { return requiredSpend; }
        public BigDecimal getRemainingSpend() { return remainingSpend; }
        
        public int getProgressPercentage() {
            if (requiredSpend.compareTo(BigDecimal.ZERO) == 0) return 100;
            return currentSpend.multiply(BigDecimal.valueOf(100))
                    .divide(requiredSpend, 0, BigDecimal.ROUND_HALF_UP).intValue();
        }
    }
}