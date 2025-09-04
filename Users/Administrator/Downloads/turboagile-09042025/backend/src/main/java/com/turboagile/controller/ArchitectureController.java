package com.turboagile.controller;

import com.turboagile.dto.ArchitecturePatternRequest;
import com.turboagile.dto.ArchitecturePatternResponse;
import com.turboagile.dto.DiagramGenerationRequest;
import com.turboagile.dto.DiagramGenerationResponse;
import com.turboagile.dto.CodeGenerationRequest;
import com.turboagile.dto.CodeGenerationResponse;
import com.turboagile.dto.ValidationRequest;
import com.turboagile.dto.ValidationResult;
import com.turboagile.service.ArchitectureService;
import com.turboagile.service.ArchitectureValidationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Architecture Controller
 * Handles architecture story workflow endpoints
 */
@RestController
@RequestMapping("/api/architecture")
@CrossOrigin(origins = "*")
public class ArchitectureController {

    @Autowired
    private ArchitectureService architectureService;

    /**
     * Generate architecture patterns based on BRD context and user preferences
     */
    @PostMapping("/generate-patterns")
    public ResponseEntity<List<ArchitecturePatternResponse>> generatePatterns(
            @RequestBody ArchitecturePatternRequest request) {
        try {
            List<ArchitecturePatternResponse> patterns = architectureService.generateArchitecturePatterns(request);
            return ResponseEntity.ok(patterns);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Generate architecture diagrams (architecture, sequence, ER)
     */
    @PostMapping("/generate-diagrams")
    public ResponseEntity<DiagramGenerationResponse> generateDiagrams(
            @RequestBody DiagramGenerationRequest request) {
        try {
            DiagramGenerationResponse diagrams = architectureService.generateDiagrams(request);
            return ResponseEntity.ok(diagrams);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Generate code based on selected architecture and technology stack
     */
    @PostMapping("/generate-code")
    public ResponseEntity<CodeGenerationResponse> generateCode(
            @RequestBody CodeGenerationRequest request) {
        try {
            CodeGenerationResponse code = architectureService.generateCode(request);
            return ResponseEntity.ok(code);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get AWS cost estimation for architecture pattern
     */
    @GetMapping("/cost-estimation/{patternId}")
    public ResponseEntity<Double> getCostEstimation(@PathVariable String patternId) {
        try {
            Double cost = architectureService.getCostEstimation(patternId);
            return ResponseEntity.ok(cost);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @Autowired
    private ArchitectureValidationService validationService;

    /**
     * Validate architecture against best practices
     */
    @PostMapping("/validate")
    public ResponseEntity<List<ValidationResult>> validateArchitecture(
            @RequestBody ValidationRequest request) {
        try {
            List<ValidationResult> results = validationService.validateArchitecture(request);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get validation rules by category
     */
    @GetMapping("/validation-rules/{category}")
    public ResponseEntity<List<ValidationResult>> getValidationRules(
            @PathVariable String category) {
        try {
            List<ValidationResult> rules = validationService.getValidationRules(category);
            return ResponseEntity.ok(rules);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}