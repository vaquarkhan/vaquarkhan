package com.cardlinked.benefits.integration.mastercard;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MastercardApiService {

    @Value("${app.external-apis.mastercard.base-url}")
    private String mastercardBaseUrl;

    @Value("${app.external-apis.mastercard.client-id}")
    private String clientId;

    @Value("${app.external-apis.mastercard.client-secret}")
    private String clientSecret;

    private final RestTemplate restTemplate;
    private final SecureRandom secureRandom;

    public MastercardApiService() {
        this.restTemplate = new RestTemplate();
        this.secureRandom = new SecureRandom();
    }

    /**
     * Check benefit eligibility for a customer
     */
    public BenefitEligibilityResponse checkBenefitEligibility(BenefitEligibilityRequest request) {
        try {
            String endpoint = mastercardBaseUrl + "/benefits/eligibility";
            
            // Encrypt sensitive payload
            String encryptedPayload = encryptPayload(request.toJson());
            
            HttpHeaders headers = createHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("encryptedData", encryptedPayload);
            requestBody.put("clientId", clientId);
            requestBody.put("timestamp", System.currentTimeMillis());
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<Map> response = restTemplate.exchange(
                endpoint, HttpMethod.POST, entity, Map.class);
            
            return parseBenefitEligibilityResponse(response.getBody());
            
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            throw new MastercardApiException("Mastercard API error: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new MastercardApiException("Unexpected error calling Mastercard API", e);
        }
    }

    /**
     * Get available benefits for a card type
     */
    public List<MastercardBenefit> getAvailableBenefits(String cardType, String region) {
        try {
            String endpoint = mastercardBaseUrl + "/benefits/available";
            
            HttpHeaders headers = createHeaders();
            
            Map<String, String> params = new HashMap<>();
            params.put("cardType", cardType);
            params.put("region", region);
            
            String url = buildUrlWithParams(endpoint, params);
            HttpEntity<Void> entity = new HttpEntity<>(headers);
            
            ResponseEntity<MastercardBenefitsResponse> response = restTemplate.exchange(
                url, HttpMethod.GET, entity, MastercardBenefitsResponse.class);
            
            return response.getBody().getBenefits();
            
        } catch (Exception e) {
            throw new MastercardApiException("Error fetching available benefits", e);
        }
    }

    /**
     * Submit benefit redemption
     */
    public RedemptionResponse submitRedemption(RedemptionRequest request) {
        try {
            String endpoint = mastercardBaseUrl + "/benefits/redeem";
            
            String encryptedPayload = encryptPayload(request.toJson());
            
            HttpHeaders headers = createHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("encryptedData", encryptedPayload);
            requestBody.put("clientId", clientId);
            requestBody.put("requestId", generateRequestId());
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<Map> response = restTemplate.exchange(
                endpoint, HttpMethod.POST, entity, Map.class);
            
            return parseRedemptionResponse(response.getBody());
            
        } catch (Exception e) {
            throw new MastercardApiException("Error submitting redemption", e);
        }
    }

    /**
     * Get redemption status
     */
    public RedemptionStatus getRedemptionStatus(String redemptionId) {
        try {
            String endpoint = mastercardBaseUrl + "/benefits/redemption/" + redemptionId + "/status";
            
            HttpHeaders headers = createHeaders();
            HttpEntity<Void> entity = new HttpEntity<>(headers);
            
            ResponseEntity<RedemptionStatusResponse> response = restTemplate.exchange(
                endpoint, HttpMethod.GET, entity, RedemptionStatusResponse.class);
            
            return response.getBody().getStatus();
            
        } catch (Exception e) {
            throw new MastercardApiException("Error getting redemption status", e);
        }
    }

    /**
     * Health check for Mastercard API
     */
    public boolean isApiHealthy() {
        try {
            String endpoint = mastercardBaseUrl + "/health";
            
            HttpHeaders headers = createHeaders();
            HttpEntity<Void> entity = new HttpEntity<>(headers);
            
            ResponseEntity<Map> response = restTemplate.exchange(
                endpoint, HttpMethod.GET, entity, Map.class);
            
            return response.getStatusCode() == HttpStatus.OK;
            
        } catch (Exception e) {
            return false;
        }
    }

    // Private helper methods
    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + generateAccessToken());
        headers.set("X-Client-ID", clientId);
        headers.set("X-Request-ID", generateRequestId());
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);
        return headers;
    }

    private String generateAccessToken() {
        // In a real implementation, this would use OAuth2 or similar
        // For now, using a simple token based on client credentials
        String tokenData = clientId + ":" + clientSecret + ":" + System.currentTimeMillis();
        return Base64.getEncoder().encodeToString(tokenData.getBytes(StandardCharsets.UTF_8));
    }

    private String generateRequestId() {
        byte[] randomBytes = new byte[16];
        secureRandom.nextBytes(randomBytes);
        return Base64.getEncoder().encodeToString(randomBytes);
    }

    private String encryptPayload(String payload) {
        try {
            // JWE encryption for sensitive payloads
            SecretKeySpec keySpec = new SecretKeySpec(
                clientSecret.getBytes(StandardCharsets.UTF_8), "AES");
            
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            cipher.init(Cipher.ENCRYPT_MODE, keySpec);
            
            byte[] encryptedData = cipher.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(encryptedData);
            
        } catch (Exception e) {
            throw new RuntimeException("Encryption failed", e);
        }
    }

    private String buildUrlWithParams(String baseUrl, Map<String, String> params) {
        StringBuilder url = new StringBuilder(baseUrl);
        if (!params.isEmpty()) {
            url.append("?");
            params.forEach((key, value) -> 
                url.append(key).append("=").append(value).append("&"));
            url.setLength(url.length() - 1); // Remove last &
        }
        return url.toString();
    }

    private BenefitEligibilityResponse parseBenefitEligibilityResponse(Map<String, Object> responseBody) {
        BenefitEligibilityResponse response = new BenefitEligibilityResponse();
        response.setEligible((Boolean) responseBody.get("eligible"));
        response.setReason((String) responseBody.get("reason"));
        response.setBenefitId((String) responseBody.get("benefitId"));
        response.setResponseTime(LocalDateTime.now());
        return response;
    }

    private RedemptionResponse parseRedemptionResponse(Map<String, Object> responseBody) {
        RedemptionResponse response = new RedemptionResponse();
        response.setRedemptionId((String) responseBody.get("redemptionId"));
        response.setStatus((String) responseBody.get("status"));
        response.setMessage((String) responseBody.get("message"));
        response.setResponseTime(LocalDateTime.now());
        return response;
    }

    // Inner classes for API requests and responses
    public static class BenefitEligibilityRequest {
        private String cardNumber;
        private String benefitId;
        private String customerId;
        private Map<String, Object> additionalData;

        public String toJson() {
            // Convert to JSON string - in real implementation use Jackson
            return String.format(
                "{\"cardNumber\":\"%s\",\"benefitId\":\"%s\",\"customerId\":\"%s\"}",
                cardNumber, benefitId, customerId);
        }

        // Getters and setters
        public String getCardNumber() { return cardNumber; }
        public void setCardNumber(String cardNumber) { this.cardNumber = cardNumber; }

        public String getBenefitId() { return benefitId; }
        public void setBenefitId(String benefitId) { this.benefitId = benefitId; }

        public String getCustomerId() { return customerId; }
        public void setCustomerId(String customerId) { this.customerId = customerId; }

        public Map<String, Object> getAdditionalData() { return additionalData; }
        public void setAdditionalData(Map<String, Object> additionalData) { this.additionalData = additionalData; }
    }

    public static class BenefitEligibilityResponse {
        private boolean eligible;
        private String reason;
        private String benefitId;
        private LocalDateTime responseTime;

        // Getters and setters
        public boolean isEligible() { return eligible; }
        public void setEligible(boolean eligible) { this.eligible = eligible; }

        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }

        public String getBenefitId() { return benefitId; }
        public void setBenefitId(String benefitId) { this.benefitId = benefitId; }

        public LocalDateTime getResponseTime() { return responseTime; }
        public void setResponseTime(LocalDateTime responseTime) { this.responseTime = responseTime; }
    }

    public static class RedemptionRequest {
        private String cardNumber;
        private String benefitId;
        private String customerId;
        private String amount;
        private Map<String, Object> metadata;

        public String toJson() {
            return String.format(
                "{\"cardNumber\":\"%s\",\"benefitId\":\"%s\",\"customerId\":\"%s\",\"amount\":\"%s\"}",
                cardNumber, benefitId, customerId, amount);
        }

        // Getters and setters
        public String getCardNumber() { return cardNumber; }
        public void setCardNumber(String cardNumber) { this.cardNumber = cardNumber; }

        public String getBenefitId() { return benefitId; }
        public void setBenefitId(String benefitId) { this.benefitId = benefitId; }

        public String getCustomerId() { return customerId; }
        public void setCustomerId(String customerId) { this.customerId = customerId; }

        public String getAmount() { return amount; }
        public void setAmount(String amount) { this.amount = amount; }

        public Map<String, Object> getMetadata() { return metadata; }
        public void setMetadata(Map<String, Object> metadata) { this.metadata = metadata; }
    }

    public static class RedemptionResponse {
        private String redemptionId;
        private String status;
        private String message;
        private LocalDateTime responseTime;

        // Getters and setters
        public String getRedemptionId() { return redemptionId; }
        public void setRedemptionId(String redemptionId) { this.redemptionId = redemptionId; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }

        public LocalDateTime getResponseTime() { return responseTime; }
        public void setResponseTime(LocalDateTime responseTime) { this.responseTime = responseTime; }
    }

    public static class MastercardBenefit {
        private String benefitId;
        private String name;
        private String description;
        private String category;
        private Map<String, Object> eligibilityCriteria;

        // Getters and setters
        public String getBenefitId() { return benefitId; }
        public void setBenefitId(String benefitId) { this.benefitId = benefitId; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public Map<String, Object> getEligibilityCriteria() { return eligibilityCriteria; }
        public void setEligibilityCriteria(Map<String, Object> eligibilityCriteria) { this.eligibilityCriteria = eligibilityCriteria; }
    }

    public static class MastercardBenefitsResponse {
        private List<MastercardBenefit> benefits;
        private String status;

        // Getters and setters
        public List<MastercardBenefit> getBenefits() { return benefits; }
        public void setBenefits(List<MastercardBenefit> benefits) { this.benefits = benefits; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    public static class RedemptionStatusResponse {
        private RedemptionStatus status;

        // Getters and setters
        public RedemptionStatus getStatus() { return status; }
        public void setStatus(RedemptionStatus status) { this.status = status; }
    }

    public enum RedemptionStatus {
        PENDING, APPROVED, REJECTED, COMPLETED, FAILED
    }

    public static class MastercardApiException extends RuntimeException {
        public MastercardApiException(String message) {
            super(message);
        }

        public MastercardApiException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}