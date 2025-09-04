package com.turboagile.dto;

import java.util.Map;

/**
 * Request DTO for code generation
 */
public class CodeGenerationRequest {
    private String projectId;
    private String language;
    private String framework;
    private ArchitecturePatternResponse pattern;
    private Map<String, String> diagrams;

    // Constructors
    public CodeGenerationRequest() {}

    public CodeGenerationRequest(String projectId, String language, String framework, 
                               ArchitecturePatternResponse pattern, Map<String, String> diagrams) {
        this.projectId = projectId;
        this.language = language;
        this.framework = framework;
        this.pattern = pattern;
        this.diagrams = diagrams;
    }

    // Getters and Setters
    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getFramework() {
        return framework;
    }

    public void setFramework(String framework) {
        this.framework = framework;
    }

    public ArchitecturePatternResponse getPattern() {
        return pattern;
    }

    public void setPattern(ArchitecturePatternResponse pattern) {
        this.pattern = pattern;
    }

    public Map<String, String> getDiagrams() {
        return diagrams;
    }

    public void setDiagrams(Map<String, String> diagrams) {
        this.diagrams = diagrams;
    }
}