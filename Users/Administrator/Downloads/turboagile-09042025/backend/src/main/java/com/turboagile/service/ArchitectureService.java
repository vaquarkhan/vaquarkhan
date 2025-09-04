package com.turboagile.service;

import com.turboagile.dto.*;
import java.util.List;

/**
 * Architecture Service Interface
 */
public interface ArchitectureService {
    
    /**
     * Generate architecture patterns based on BRD context and user preferences
     */
    List<ArchitecturePatternResponse> generateArchitecturePatterns(ArchitecturePatternRequest request);
    
    /**
     * Generate diagrams for selected architecture pattern
     */
    DiagramGenerationResponse generateDiagrams(DiagramGenerationRequest request);
    
    /**
     * Generate code based on architecture and technology choices
     */
    CodeGenerationResponse generateCode(CodeGenerationRequest request);
    
    /**
     * Get cost estimation for architecture pattern
     */
    Double getCostEstimation(String patternId);
}