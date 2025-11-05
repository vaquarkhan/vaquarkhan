package com.cardlinked.benefits.offers.service;

import com.cardlinked.benefits.offers.entity.Offer;
import com.cardlinked.benefits.customer.entity.Customer;
import com.cardlinked.benefits.customer.entity.Card;
import com.cardlinked.benefits.customer.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Configurable rules engine for offer eligibility and calculations
 */
@Service
public class OfferRulesEngine {

    private final CustomerService customerService;

    @Autowired
    public OfferRulesEngine(CustomerService customerService) {
        this.customerService = customerService;
    }

    /**
     * Validate offer rules configuration
     */
    public void validateOfferRules(Offer offer) {
        if (offer.getStartDate().isAfter(offer.getEndDate())) {
            throw new IllegalArgumentException("Start date must be before end date");
        }

        if (offer.getDiscountValue().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Discount value must be positive");
        }

        if (offer.getDiscountType() == Offer.DiscountType.PERCENTAGE && 
            offer.getDiscountValue().compareTo(BigDecimal.valueOf(100)) > 0) {
            throw new IllegalArgumentException("Percentage discount cannot exceed 100%");
        }

        // Validate rules configuration
        validateRulesConfig(offer.getRulesConfig());
        
        // Validate eligibility criteria
        validateEligibilityCriteria(offer.getEligibilityCriteria());
    }

    /**
     * Get eligible offers for a customer and card
     */
    public List<Offer> getEligibleOffers(String customerId, String cardId) {
        Customer customer = customerService.getCustomerById(customerId);
        List<Card> customerCards = customerService.getActiveCustomerCards(customerId);
        
        Card selectedCard = customerCards.stream()
                .filter(card -> card.getCardId().equals(cardId))
                .findFirst()
                .orElse(null);

        // Get all active offers and filter by eligibility
        // This would typically query the offer repository
        // For now, returning empty list as placeholder
        return List.of();
    }

    /**
     * Check if customer is eligible for specific offer
     */
    public boolean isCustomerEligible(Customer customer, Card card, Offer offer) {
        if (!offer.isActive()) {
            return false;
        }

        Map<String, Object> eligibilityCriteria = offer.getEligibilityCriteria();
        if (eligibilityCriteria == null || eligibilityCriteria.isEmpty()) {
            return true; // No restrictions
        }

        // Check segment eligibility
        if (!isSegmentEligible(customer, eligibilityCriteria)) {
            return false;
        }

        // Check card type eligibility
        if (!isCardTypeEligible(card, eligibilityCriteria)) {
            return false;
        }

        // Check spend threshold eligibility
        if (!isSpendThresholdMet(customer, card, eligibilityCriteria)) {
            return false;
        }

        // Check BIN eligibility
        if (!isBinEligible(card, eligibilityCriteria)) {
            return false;
        }

        return true;
    }

    /**
     * Calculate discount amount for offer
     */
    public BigDecimal calculateDiscountAmount(Offer offer, BigDecimal transactionAmount) {
        BigDecimal discountAmount = BigDecimal.ZERO;

        switch (offer.getDiscountType()) {
            case PERCENTAGE:
                discountAmount = transactionAmount.multiply(offer.getDiscountValue())
                        .divide(BigDecimal.valueOf(100), 2, BigDecimal.ROUND_HALF_UP);
                break;
            case FIXED_AMOUNT:
            case CASHBACK:
                discountAmount = offer.getDiscountValue();
                break;
        }

        // Apply maximum discount limit if configured
        Map<String, Object> rulesConfig = offer.getRulesConfig();
        if (rulesConfig != null && rulesConfig.containsKey("maxDiscount")) {
            BigDecimal maxDiscount = new BigDecimal(rulesConfig.get("maxDiscount").toString());
            discountAmount = discountAmount.min(maxDiscount);
        }

        return discountAmount;
    }

    /**
     * Check if minimum spend requirement is met
     */
    public boolean isMinimumSpendMet(Offer offer, BigDecimal transactionAmount) {
        Map<String, Object> rulesConfig = offer.getRulesConfig();
        if (rulesConfig == null || !rulesConfig.containsKey("minSpend")) {
            return true;
        }

        BigDecimal minSpend = new BigDecimal(rulesConfig.get("minSpend").toString());
        return transactionAmount.compareTo(minSpend) >= 0;
    }

    /**
     * Check if offer is valid for specific merchant category
     */
    public boolean isMerchantCategoryEligible(Offer offer, String merchantCategoryCode) {
        Map<String, Object> rulesConfig = offer.getRulesConfig();
        if (rulesConfig == null || !rulesConfig.containsKey("merchantCodes")) {
            return true;
        }

        @SuppressWarnings("unchecked")
        List<String> allowedMerchantCodes = (List<String>) rulesConfig.get("merchantCodes");
        return allowedMerchantCodes.contains(merchantCategoryCode);
    }

    /**
     * Check if offer is valid for current day/time
     */
    public boolean isTimeEligible(Offer offer) {
        Map<String, Object> rulesConfig = offer.getRulesConfig();
        if (rulesConfig == null) {
            return true;
        }

        // Check valid days
        if (rulesConfig.containsKey("validDays")) {
            @SuppressWarnings("unchecked")
            List<String> validDays = (List<String>) rulesConfig.get("validDays");
            String currentDay = LocalDate.now().getDayOfWeek().name().substring(0, 3);
            if (!validDays.contains(currentDay)) {
                return false;
            }
        }

        // Check valid hours
        if (rulesConfig.containsKey("validHours")) {
            @SuppressWarnings("unchecked")
            Map<String, Integer> validHours = (Map<String, Integer>) rulesConfig.get("validHours");
            int currentHour = LocalDateTime.now().getHour();
            int startHour = validHours.getOrDefault("start", 0);
            int endHour = validHours.getOrDefault("end", 23);
            
            if (currentHour < startHour || currentHour > endHour) {
                return false;
            }
        }

        return true;
    }

    // Private helper methods
    private void validateRulesConfig(Map<String, Object> rulesConfig) {
        if (rulesConfig == null) return;

        // Validate minimum spend
        if (rulesConfig.containsKey("minSpend")) {
            try {
                BigDecimal minSpend = new BigDecimal(rulesConfig.get("minSpend").toString());
                if (minSpend.compareTo(BigDecimal.ZERO) < 0) {
                    throw new IllegalArgumentException("Minimum spend must be non-negative");
                }
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("Invalid minimum spend value");
            }
        }

        // Validate maximum discount
        if (rulesConfig.containsKey("maxDiscount")) {
            try {
                BigDecimal maxDiscount = new BigDecimal(rulesConfig.get("maxDiscount").toString());
                if (maxDiscount.compareTo(BigDecimal.ZERO) < 0) {
                    throw new IllegalArgumentException("Maximum discount must be non-negative");
                }
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("Invalid maximum discount value");
            }
        }
    }

    private void validateEligibilityCriteria(Map<String, Object> eligibilityCriteria) {
        if (eligibilityCriteria == null) return;

        // Validate segments
        if (eligibilityCriteria.containsKey("segments")) {
            @SuppressWarnings("unchecked")
            List<String> segments = (List<String>) eligibilityCriteria.get("segments");
            for (String segment : segments) {
                try {
                    Customer.SegmentType.valueOf(segment);
                } catch (IllegalArgumentException e) {
                    throw new IllegalArgumentException("Invalid customer segment: " + segment);
                }
            }
        }

        // Validate card types
        if (eligibilityCriteria.containsKey("cardTypes")) {
            @SuppressWarnings("unchecked")
            List<String> cardTypes = (List<String>) eligibilityCriteria.get("cardTypes");
            for (String cardType : cardTypes) {
                try {
                    Card.CardType.valueOf(cardType);
                } catch (IllegalArgumentException e) {
                    throw new IllegalArgumentException("Invalid card type: " + cardType);
                }
            }
        }
    }

    private boolean isSegmentEligible(Customer customer, Map<String, Object> eligibilityCriteria) {
        if (!eligibilityCriteria.containsKey("segments")) {
            return true;
        }

        @SuppressWarnings("unchecked")
        List<String> allowedSegments = (List<String>) eligibilityCriteria.get("segments");
        return allowedSegments.contains(customer.getSegmentType().name());
    }

    private boolean isCardTypeEligible(Card card, Map<String, Object> eligibilityCriteria) {
        if (!eligibilityCriteria.containsKey("cardTypes")) {
            return true;
        }

        @SuppressWarnings("unchecked")
        List<String> allowedCardTypes = (List<String>) eligibilityCriteria.get("cardTypes");
        return allowedCardTypes.contains(card.getCardType().name());
    }

    private boolean isSpendThresholdMet(Customer customer, Card card, Map<String, Object> eligibilityCriteria) {
        if (!eligibilityCriteria.containsKey("spendThreshold")) {
            return true;
        }

        // This would check against actual spend data
        // Implementation would query spend thresholds and current spend
        return true; // Placeholder
    }

    private boolean isBinEligible(Card card, Map<String, Object> eligibilityCriteria) {
        if (!eligibilityCriteria.containsKey("binRanges")) {
            return true;
        }

        @SuppressWarnings("unchecked")
        List<String> allowedBinRanges = (List<String>) eligibilityCriteria.get("binRanges");
        return allowedBinRanges.stream()
                .anyMatch(binRange -> card.getBinRange().startsWith(binRange));
    }
}