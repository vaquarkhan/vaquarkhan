package com.cardlinked.benefits.integration;

import com.cardlinked.benefits.integration.mastercard.MastercardApiService;
import com.cardlinked.benefits.integration.visa.VisaApiService;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import lombok.Data;

import java.util.List;
import java.util.ArrayList;
import java.time.LocalDateTime;

@Service
@Slf4j
public class PaymentSchemeIntegrationService {

    private final MastercardApiService mastercardApiService;
    private final VisaApiService visaApiService;

    public PaymentSchemeIntegrationService(MastercardApiService mastercardApiService, 
                                         VisaApiService visaApiService) {
        this.mastercardApiService = mastercardApiService;
        this.visaApiService = visaApiService;
    }

    public UnifiedBenefitResponse checkEligibility(String pan, String merchantId, 
                                                 Double transactionAmount, String currencyCode) {
        String bin = pan.substring(0, 6);
        PaymentScheme scheme = determinePaymentScheme(bin);
        
        try {
            switch (scheme) {
                case MASTERCARD:
                    return checkMastercardEligibility(pan, merchantId, transactionAmount, currencyCode);
                case VISA:
                    return checkVisaEligibility(pan, merchantId, transactionAmount, currencyCode);
                default:
                    log.warn("Unsupported payment scheme for BIN: {}", bin);
                    return createEmptyResponse("Unsupported payment scheme");
            }
        } catch (Exception e) {
            log.error("Error checking eligibility for scheme: {}", scheme, e);
            return createEmptyResponse("Integration error: " + e.getMessage());
        }
    }

    public List<UnifiedBenefit> getAvailableBenefits(String bin) {
        PaymentScheme scheme = determinePaymentScheme(bin);
        List<UnifiedBenefit> benefits = new ArrayList<>();
        
        try {
            switch (scheme) {
                case MASTERCARD:
                    var mcBenefits = mastercardApiService.getAvailableBenefits(bin, "US");
                    benefits.addAll(convertMastercardBenefits(mcBenefits));
                    break;
                case VISA:
                    var visaBenefits = visaApiService.getAvailableBenefits(bin);
                    benefits.addAll(convertVisaBenefits(visaBenefits.getBenefits()));
                    break;
                default:
                    log.warn("No benefits available for unsupported scheme: {}", scheme);
            }
        } catch (Exception e) {
            log.error("Error retrieving benefits for BIN: {}", bin, e);
        }
        
        return benefits;
    }

    private UnifiedBenefitResponse checkMastercardEligibility(String pan, String merchantId, 
                                                            Double transactionAmount, String currencyCode) {
        var request = new MastercardApiService.BenefitEligibilityRequest();
        request.setCardNumber(pan);
        request.setCustomerId(merchantId);
        
        var response = mastercardApiService.checkBenefitEligibility(request);
        
        return UnifiedBenefitResponse.builder()
            .eligible(response.isEligible())
            .benefits(new ArrayList<>())
            .message(response.getReason())
            .scheme(PaymentScheme.MASTERCARD)
            .correlationId(response.getBenefitId())
            .build();
    }

    private UnifiedBenefitResponse checkVisaEligibility(String pan, String merchantId, 
                                                      Double transactionAmount, String currencyCode) {
        var request = new VisaApiService.BenefitEligibilityRequest();
        request.setPan(pan);
        request.setMerchantId(merchantId);
        request.setTransactionAmount(transactionAmount.toString());
        request.setCurrencyCode(currencyCode);
        request.setTransactionDate(LocalDateTime.now());
        
        var response = visaApiService.checkEligibility(request);
        
        return UnifiedBenefitResponse.builder()
            .eligible(response.isEligible())
            .benefits(convertVisaBenefits(response.getAvailableBenefits()))
            .message(response.getMessage())
            .scheme(PaymentScheme.VISA)
            .correlationId(response.getCorrelationId())
            .build();
    }

    private List<UnifiedBenefit> convertMastercardBenefits(List<MastercardApiService.MastercardBenefit> mcBenefits) {
        return mcBenefits.stream()
            .map(benefit -> UnifiedBenefit.builder()
                .benefitId(benefit.getBenefitId())
                .benefitName(benefit.getName())
                .description(benefit.getDescription())
                .discountType(benefit.getCategory())
                .discountValue(0.0)
                .redemptionType("BOTH")
                .validFrom(LocalDateTime.now())
                .validTo(LocalDateTime.now().plusYears(1))
                .scheme(PaymentScheme.MASTERCARD)
                .build())
            .toList();
    }

    private List<UnifiedBenefit> convertVisaBenefits(List<VisaApiService.VisaBenefit> visaBenefits) {
        return visaBenefits.stream()
            .map(benefit -> UnifiedBenefit.builder()
                .benefitId(benefit.getBenefitId())
                .benefitName(benefit.getBenefitName())
                .description(benefit.getDescription())
                .discountType(benefit.getDiscountType())
                .discountValue(benefit.getDiscountValue())
                .redemptionType(benefit.getRedemptionType())
                .validFrom(benefit.getValidFrom())
                .validTo(benefit.getValidTo())
                .scheme(PaymentScheme.VISA)
                .build())
            .toList();
    }

    private PaymentScheme determinePaymentScheme(String bin) {
        if (bin.startsWith("4")) return PaymentScheme.VISA;
        if (bin.startsWith("5") || bin.startsWith("2")) return PaymentScheme.MASTERCARD;
        return PaymentScheme.UNKNOWN;
    }

    private UnifiedBenefitResponse createEmptyResponse(String message) {
        return UnifiedBenefitResponse.builder()
            .eligible(false)
            .benefits(new ArrayList<>())
            .message(message)
            .scheme(PaymentScheme.UNKNOWN)
            .build();
    }

    @Data
    @lombok.Builder
    public static class UnifiedBenefitResponse {
        private boolean eligible;
        private List<UnifiedBenefit> benefits;
        private String message;
        private PaymentScheme scheme;
        private String correlationId;
    }

    @Data
    @lombok.Builder
    public static class UnifiedBenefit {
        private String benefitId;
        private String benefitName;
        private String description;
        private String discountType;
        private Double discountValue;
        private String redemptionType;
        private LocalDateTime validFrom;
        private LocalDateTime validTo;
        private PaymentScheme scheme;
    }

    public enum PaymentScheme {
        MASTERCARD, VISA, UNKNOWN
    }
}