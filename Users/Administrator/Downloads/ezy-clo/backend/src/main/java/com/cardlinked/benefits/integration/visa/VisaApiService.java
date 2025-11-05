package com.cardlinked.benefits.integration.visa;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import lombok.extern.slf4j.Slf4j;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class VisaApiService {

    @Value("${visa.api.endpoint:https://api.visa.com/benefits}")
    private String visaApiEndpoint;

    @Value("${visa.api.key:}")
    private String apiKey;

    @Value("${visa.api.secret:}")
    private String apiSecret;

    private final RestTemplate restTemplate;

    public VisaApiService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public BenefitEligibilityResponse checkEligibility(BenefitEligibilityRequest request) {
        try {
            HttpHeaders headers = createHeaders();
            HttpEntity<BenefitEligibilityRequest> entity = new HttpEntity<>(request, headers);
            
            ResponseEntity<BenefitEligibilityResponse> response = restTemplate.exchange(
                visaApiEndpoint + "/eligibility",
                HttpMethod.POST,
                entity,
                BenefitEligibilityResponse.class
            );
            
            log.info("Visa eligibility check successful for PAN: {}", maskPan(request.getPan()));
            return response.getBody();
            
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            log.error("Visa API error: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new VisaApiException("Visa API error: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Unexpected error calling Visa API", e);
            throw new VisaApiException("Unexpected error: " + e.getMessage(), e);
        }
    }

    public VisaBenefitsResponse getAvailableBenefits(String bin) {
        try {
            HttpHeaders headers = createHeaders();
            HttpEntity<Void> entity = new HttpEntity<>(headers);
            
            ResponseEntity<VisaBenefitsResponse> response = restTemplate.exchange(
                visaApiEndpoint + "/benefits?bin=" + bin,
                HttpMethod.GET,
                entity,
                VisaBenefitsResponse.class
            );
            
            log.info("Retrieved {} benefits for BIN: {}", 
                response.getBody().getBenefits().size(), bin);
            return response.getBody();
            
        } catch (Exception e) {
            log.error("Error retrieving Visa benefits for BIN: {}", bin, e);
            throw new VisaApiException("Error retrieving benefits: " + e.getMessage(), e);
        }
    }

    public RedemptionResponse redeemBenefit(RedemptionRequest request) {
        try {
            HttpHeaders headers = createHeaders();
            HttpEntity<RedemptionRequest> entity = new HttpEntity<>(request, headers);
            
            ResponseEntity<RedemptionResponse> response = restTemplate.exchange(
                visaApiEndpoint + "/redeem",
                HttpMethod.POST,
                entity,
                RedemptionResponse.class
            );
            
            log.info("Visa benefit redemption successful: {}", response.getBody().getRedemptionId());
            return response.getBody();
            
        } catch (Exception e) {
            log.error("Error redeeming Visa benefit", e);
            throw new VisaApiException("Redemption error: " + e.getMessage(), e);
        }
    }

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey);
        headers.set("X-API-Secret", apiSecret);
        headers.set("User-Agent", "EzyCLO-CardBenefits/1.0");
        return headers;
    }

    private String maskPan(String pan) {
        if (pan == null || pan.length() < 8) return "****";
        return pan.substring(0, 4) + "****" + pan.substring(pan.length() - 4);
    }

    @Data
    public static class BenefitEligibilityRequest {
        private String pan;
        private String merchantId;
        private String transactionAmount;
        private String currencyCode;
        private LocalDateTime transactionDate;
    }

    @Data
    public static class BenefitEligibilityResponse {
        private boolean eligible;
        private List<VisaBenefit> availableBenefits;
        private String message;
        private String correlationId;
    }

    @Data
    public static class VisaBenefit {
        private String benefitId;
        private String benefitName;
        private String description;
        private String discountType;
        private Double discountValue;
        private String redemptionType;
        private LocalDateTime validFrom;
        private LocalDateTime validTo;
        private Map<String, Object> terms;
    }

    @Data
    public static class VisaBenefitsResponse {
        private List<VisaBenefit> benefits;
        private String bin;
        private LocalDateTime retrievedAt;
    }

    @Data
    public static class RedemptionRequest {
        private String benefitId;
        private String pan;
        private String transactionId;
        private String merchantId;
        private Double amount;
        private String currencyCode;
    }

    @Data
    public static class RedemptionResponse {
        private String redemptionId;
        private RedemptionStatus status;
        private String message;
        private Double discountAmount;
        private LocalDateTime redeemedAt;
    }

    public enum RedemptionStatus {
        SUCCESS, FAILED, PENDING, EXPIRED
    }

    public static class VisaApiException extends RuntimeException {
        public VisaApiException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}