package com.turboagile.service;

import com.turboagile.dto.ValidationRequest;
import com.turboagile.dto.ValidationResult;
import java.util.List;

/**
 * Architecture Validation Service Interface
 */
public interface ArchitectureValidationService {
    
    /**
     * Validate architecture against best practices
     */
    List<ValidationResult> validateArchitecture(ValidationRequest request);
    
    /**
     * Get validation rules by category
     */
    List<ValidationResult> getValidationRules(String category);
    
    /**
     * Run security validation
     */
    List<ValidationResult> validateSecurity(ValidationRequest request);
    
    /**
     * Run performance validation
     */
    List<ValidationResult> validatePerformance(ValidationRequest request);
    
    /**
     * Run scalability validation
     */
    List<ValidationResult> validateScalability(ValidationRequest request);
}