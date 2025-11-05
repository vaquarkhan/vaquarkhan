package com.cardlinked.benefits.customer.service;

import com.cardlinked.benefits.customer.entity.Customer;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

/**
 * Golden Records Service implementing ExyCLO methodology
 * ExyCLO: Extract, Yield, Cleanse, Link, Optimize
 */
@Service
public class GoldenRecordsService {

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[A-Za-z0-9+_.-]+@([A-Za-z0-9.-]+\\.[A-Za-z]{2,})$");
    
    private static final Pattern PHONE_PATTERN = Pattern.compile(
        "^\\+?[1-9]\\d{1,14}$");

    /**
     * Process customer record using ExyCLO methodology
     */
    public Customer processCustomerRecord(Customer customer) {
        // Extract: Get raw data (already done in input)
        
        // Yield: Standardize and normalize data
        Customer normalizedCustomer = yieldStandardizedData(customer);
        
        // Cleanse: Clean and validate data
        Customer cleansedCustomer = cleanseData(normalizedCustomer);
        
        // Link: Identify relationships and duplicates (handled in service layer)
        
        // Optimize: Enhance data quality
        Customer optimizedCustomer = optimizeData(cleansedCustomer);
        
        return optimizedCustomer;
    }

    /**
     * Yield: Standardize and normalize data
     */
    private Customer yieldStandardizedData(Customer customer) {
        Customer normalized = new Customer();
        normalized.setCustomerId(customer.getCustomerId());
        normalized.setEncryptedPanToken(customer.getEncryptedPanToken());
        normalized.setSegmentType(customer.getSegmentType());
        normalized.setStatus(customer.getStatus());
        normalized.setDateOfBirth(customer.getDateOfBirth());
        normalized.setNationality(customer.getNationality());
        normalized.setCreatedBy(customer.getCreatedBy());
        normalized.setUpdatedBy(customer.getUpdatedBy());

        // Standardize names
        normalized.setFirstName(standardizeName(customer.getFirstName()));
        normalized.setLastName(standardizeName(customer.getLastName()));
        
        // Standardize email
        normalized.setEmail(standardizeEmail(customer.getEmail()));
        
        // Standardize phone
        normalized.setPhone(standardizePhone(customer.getPhone()));
        
        return normalized;
    }

    /**
     * Cleanse: Clean and validate data
     */
    private Customer cleanseData(Customer customer) {
        Customer cleansed = customer;
        
        // Validate and cleanse email
        if (customer.getEmail() != null && !isValidEmail(customer.getEmail())) {
            cleansed.setEmail(null); // Remove invalid email
        }
        
        // Validate and cleanse phone
        if (customer.getPhone() != null && !isValidPhone(customer.getPhone())) {
            cleansed.setPhone(null); // Remove invalid phone
        }
        
        // Validate names
        if (customer.getFirstName() == null || customer.getFirstName().trim().isEmpty()) {
            throw new IllegalArgumentException("First name is required");
        }
        
        if (customer.getLastName() == null || customer.getLastName().trim().isEmpty()) {
            throw new IllegalArgumentException("Last name is required");
        }
        
        return cleansed;
    }

    /**
     * Optimize: Enhance data quality
     */
    private Customer optimizeData(Customer customer) {
        Customer optimized = customer;
        
        // Add data quality score (could be stored in a separate field)
        int qualityScore = calculateDataQualityScore(customer);
        
        // Enhance nationality if missing (could use additional logic)
        if (customer.getNationality() == null && customer.getPhone() != null) {
            optimized.setNationality(inferNationalityFromPhone(customer.getPhone()));
        }
        
        return optimized;
    }

    /**
     * Standardize name format
     */
    private String standardizeName(String name) {
        if (name == null) return null;
        
        // Trim whitespace
        name = name.trim();
        
        // Convert to title case
        if (!name.isEmpty()) {
            name = name.substring(0, 1).toUpperCase() + 
                   (name.length() > 1 ? name.substring(1).toLowerCase() : "");
        }
        
        // Remove extra spaces
        name = name.replaceAll("\\s+", " ");
        
        return name;
    }

    /**
     * Standardize email format
     */
    private String standardizeEmail(String email) {
        if (email == null) return null;
        
        // Convert to lowercase and trim
        email = email.toLowerCase().trim();
        
        return email;
    }

    /**
     * Standardize phone format
     */
    private String standardizePhone(String phone) {
        if (phone == null) return null;
        
        // Remove all non-digit characters except +
        phone = phone.replaceAll("[^+\\d]", "");
        
        // Add country code for Saudi numbers if missing
        if (phone.startsWith("05") && phone.length() == 10) {
            phone = "+966" + phone.substring(1);
        } else if (phone.startsWith("5") && phone.length() == 9) {
            phone = "+966" + phone;
        }
        
        return phone;
    }

    /**
     * Validate email format
     */
    private boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email).matches();
    }

    /**
     * Validate phone format
     */
    private boolean isValidPhone(String phone) {
        return phone != null && PHONE_PATTERN.matcher(phone).matches();
    }

    /**
     * Calculate data quality score (0-100)
     */
    private int calculateDataQualityScore(Customer customer) {
        int score = 0;
        int maxScore = 100;
        
        // Required fields (60 points)
        if (customer.getFirstName() != null && !customer.getFirstName().trim().isEmpty()) score += 20;
        if (customer.getLastName() != null && !customer.getLastName().trim().isEmpty()) score += 20;
        if (customer.getEncryptedPanToken() != null && !customer.getEncryptedPanToken().trim().isEmpty()) score += 20;
        
        // Optional but important fields (40 points)
        if (customer.getEmail() != null && isValidEmail(customer.getEmail())) score += 15;
        if (customer.getPhone() != null && isValidPhone(customer.getPhone())) score += 15;
        if (customer.getDateOfBirth() != null) score += 10;
        
        return Math.min(score, maxScore);
    }

    /**
     * Infer nationality from phone number
     */
    private String inferNationalityFromPhone(String phone) {
        if (phone == null) return null;
        
        if (phone.startsWith("+966")) return "SAU"; // Saudi Arabia
        if (phone.startsWith("+971")) return "ARE"; // UAE
        if (phone.startsWith("+965")) return "KWT"; // Kuwait
        if (phone.startsWith("+973")) return "BHR"; // Bahrain
        if (phone.startsWith("+974")) return "QAT"; // Qatar
        if (phone.startsWith("+968")) return "OMN"; // Oman
        
        return null; // Unknown
    }

    /**
     * Generate similarity score between two customers (0.0 - 1.0)
     */
    public double calculateSimilarityScore(Customer customer1, Customer customer2) {
        double score = 0.0;
        int factors = 0;
        
        // Name similarity (40% weight)
        if (customer1.getFirstName() != null && customer2.getFirstName() != null) {
            score += calculateStringSimilarity(customer1.getFirstName(), customer2.getFirstName()) * 0.2;
            factors++;
        }
        
        if (customer1.getLastName() != null && customer2.getLastName() != null) {
            score += calculateStringSimilarity(customer1.getLastName(), customer2.getLastName()) * 0.2;
            factors++;
        }
        
        // Date of birth (30% weight)
        if (customer1.getDateOfBirth() != null && customer2.getDateOfBirth() != null) {
            score += customer1.getDateOfBirth().equals(customer2.getDateOfBirth()) ? 0.3 : 0.0;
            factors++;
        }
        
        // Contact information (30% weight)
        if (customer1.getEmail() != null && customer2.getEmail() != null) {
            score += customer1.getEmail().equalsIgnoreCase(customer2.getEmail()) ? 0.15 : 0.0;
            factors++;
        }
        
        if (customer1.getPhone() != null && customer2.getPhone() != null) {
            score += customer1.getPhone().equals(customer2.getPhone()) ? 0.15 : 0.0;
            factors++;
        }
        
        return factors > 0 ? score : 0.0;
    }

    /**
     * Calculate string similarity using Levenshtein distance
     */
    private double calculateStringSimilarity(String s1, String s2) {
        if (s1 == null || s2 == null) return 0.0;
        
        s1 = s1.toLowerCase().trim();
        s2 = s2.toLowerCase().trim();
        
        if (s1.equals(s2)) return 1.0;
        
        int maxLength = Math.max(s1.length(), s2.length());
        if (maxLength == 0) return 1.0;
        
        int distance = levenshteinDistance(s1, s2);
        return 1.0 - (double) distance / maxLength;
    }

    /**
     * Calculate Levenshtein distance between two strings
     */
    private int levenshteinDistance(String s1, String s2) {
        int[][] dp = new int[s1.length() + 1][s2.length() + 1];
        
        for (int i = 0; i <= s1.length(); i++) {
            dp[i][0] = i;
        }
        
        for (int j = 0; j <= s2.length(); j++) {
            dp[0][j] = j;
        }
        
        for (int i = 1; i <= s1.length(); i++) {
            for (int j = 1; j <= s2.length(); j++) {
                int cost = s1.charAt(i - 1) == s2.charAt(j - 1) ? 0 : 1;
                dp[i][j] = Math.min(Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1), dp[i - 1][j - 1] + cost);
            }
        }
        
        return dp[s1.length()][s2.length()];
    }
}