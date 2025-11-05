package com.cardlinked.benefits.security.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.concurrent.TimeUnit;

/**
 * PAN Tokenization Service for PCI DSS compliance
 * Replaces sensitive PAN data with non-sensitive tokens
 */
@Service
public class TokenizationService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final EncryptionService encryptionService;
    private final SecureRandom secureRandom;

    // Token configuration
    private static final String TOKEN_PREFIX = "TKN";
    private static final int TOKEN_LENGTH = 16;
    private static final long TOKEN_TTL_HOURS = 24 * 365; // 1 year
    private static final String TOKEN_VAULT_PREFIX = "token_vault:";
    private static final String REVERSE_VAULT_PREFIX = "reverse_vault:";

    @Autowired
    public TokenizationService(RedisTemplate<String, Object> redisTemplate, 
                              EncryptionService encryptionService) {
        this.redisTemplate = redisTemplate;
        this.encryptionService = encryptionService;
        this.secureRandom = new SecureRandom();
    }

    /**
     * Tokenize PAN (Primary Account Number)
     * Returns a non-sensitive token that can be safely stored and transmitted
     */
    public String tokenizePan(String pan) {
        if (pan == null || pan.isEmpty()) {
            throw new IllegalArgumentException("PAN cannot be null or empty");
        }

        // Validate PAN format (basic Luhn algorithm check)
        if (!isValidPan(pan)) {
            throw new IllegalArgumentException("Invalid PAN format");
        }

        // Check if PAN is already tokenized
        String existingToken = getExistingToken(pan);
        if (existingToken != null) {
            return existingToken;
        }

        // Generate new token
        String token = generateToken();
        
        // Store in token vault (encrypted)
        String encryptedPan = encryptionService.encrypt(pan);
        storeTokenMapping(token, encryptedPan, pan);
        
        return token;
    }

    /**
     * Detokenize - retrieve original PAN from token
     * Should only be used when absolutely necessary and with proper authorization
     */
    public String detokenizePan(String token) {
        if (token == null || token.isEmpty()) {
            throw new IllegalArgumentException("Token cannot be null or empty");
        }

        if (!isValidToken(token)) {
            throw new IllegalArgumentException("Invalid token format");
        }

        // Retrieve encrypted PAN from vault
        String encryptedPan = (String) redisTemplate.opsForValue().get(TOKEN_VAULT_PREFIX + token);
        if (encryptedPan == null) {
            throw new RuntimeException("Token not found or expired");
        }

        // Decrypt and return PAN
        return encryptionService.decrypt(encryptedPan);
    }

    /**
     * Validate if a string is a valid token
     */
    public boolean isValidToken(String token) {
        if (token == null || token.isEmpty()) {
            return false;
        }

        // Check format: TOKEN_PREFIX + alphanumeric characters
        return token.startsWith(TOKEN_PREFIX) && 
               token.length() == TOKEN_PREFIX.length() + TOKEN_LENGTH &&
               token.substring(TOKEN_PREFIX.length()).matches("[A-Z0-9]+");
    }

    /**
     * Check if token exists in vault
     */
    public boolean tokenExists(String token) {
        if (!isValidToken(token)) {
            return false;
        }
        
        return Boolean.TRUE.equals(redisTemplate.hasKey(TOKEN_VAULT_PREFIX + token));
    }

    /**
     * Revoke token (remove from vault)
     */
    public void revokeToken(String token) {
        if (!isValidToken(token)) {
            throw new IllegalArgumentException("Invalid token format");
        }

        // Get PAN hash for reverse lookup cleanup
        String encryptedPan = (String) redisTemplate.opsForValue().get(TOKEN_VAULT_PREFIX + token);
        if (encryptedPan != null) {
            String pan = encryptionService.decrypt(encryptedPan);
            String panHash = encryptionService.hash(pan);
            redisTemplate.delete(REVERSE_VAULT_PREFIX + panHash);
        }

        // Remove token from vault
        redisTemplate.delete(TOKEN_VAULT_PREFIX + token);
    }

    /**
     * Get masked PAN for display purposes (shows only last 4 digits)
     */
    public String getMaskedPan(String token) {
        if (!tokenExists(token)) {
            throw new RuntimeException("Token not found");
        }

        String pan = detokenizePan(token);
        return maskPan(pan);
    }

    /**
     * Rotate token (generate new token for existing PAN)
     */
    public String rotateToken(String oldToken) {
        if (!tokenExists(oldToken)) {
            throw new RuntimeException("Token not found");
        }

        // Get original PAN
        String pan = detokenizePan(oldToken);
        
        // Revoke old token
        revokeToken(oldToken);
        
        // Generate new token
        return tokenizePan(pan);
    }

    /**
     * Bulk tokenization for multiple PANs
     */
    public java.util.Map<String, String> tokenizeBulk(java.util.List<String> pans) {
        java.util.Map<String, String> tokenMap = new java.util.HashMap<>();
        
        for (String pan : pans) {
            try {
                String token = tokenizePan(pan);
                tokenMap.put(pan, token);
            } catch (Exception e) {
                // Log error but continue with other PANs
                System.err.println("Failed to tokenize PAN: " + maskPan(pan) + " - " + e.getMessage());
            }
        }
        
        return tokenMap;
    }

    // Private helper methods
    private String generateToken() {
        StringBuilder token = new StringBuilder(TOKEN_PREFIX);
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        
        for (int i = 0; i < TOKEN_LENGTH; i++) {
            token.append(chars.charAt(secureRandom.nextInt(chars.length())));
        }
        
        // Ensure token is unique
        String generatedToken = token.toString();
        if (tokenExists(generatedToken)) {
            return generateToken(); // Recursive call to generate new token
        }
        
        return generatedToken;
    }

    private void storeTokenMapping(String token, String encryptedPan, String pan) {
        // Store token -> encrypted PAN mapping
        redisTemplate.opsForValue().set(
            TOKEN_VAULT_PREFIX + token, 
            encryptedPan, 
            TOKEN_TTL_HOURS, 
            TimeUnit.HOURS
        );
        
        // Store PAN hash -> token mapping for duplicate detection
        String panHash = encryptionService.hash(pan);
        redisTemplate.opsForValue().set(
            REVERSE_VAULT_PREFIX + panHash, 
            token, 
            TOKEN_TTL_HOURS, 
            TimeUnit.HOURS
        );
    }

    private String getExistingToken(String pan) {
        String panHash = encryptionService.hash(pan);
        return (String) redisTemplate.opsForValue().get(REVERSE_VAULT_PREFIX + panHash);
    }

    private boolean isValidPan(String pan) {
        // Remove any spaces or dashes
        String cleanPan = pan.replaceAll("[\\s-]", "");
        
        // Check length (13-19 digits for most card types)
        if (cleanPan.length() < 13 || cleanPan.length() > 19) {
            return false;
        }
        
        // Check if all characters are digits
        if (!cleanPan.matches("\\d+")) {
            return false;
        }
        
        // Luhn algorithm validation
        return isValidLuhn(cleanPan);
    }

    private boolean isValidLuhn(String pan) {
        int sum = 0;
        boolean alternate = false;
        
        for (int i = pan.length() - 1; i >= 0; i--) {
            int digit = Character.getNumericValue(pan.charAt(i));
            
            if (alternate) {
                digit *= 2;
                if (digit > 9) {
                    digit = (digit % 10) + 1;
                }
            }
            
            sum += digit;
            alternate = !alternate;
        }
        
        return (sum % 10) == 0;
    }

    private String maskPan(String pan) {
        if (pan == null || pan.length() < 4) {
            return "****";
        }
        
        String lastFour = pan.substring(pan.length() - 4);
        return "**** **** **** " + lastFour;
    }
}