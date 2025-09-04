package com.turboagile.dto;

/**
 * Request DTO for diagram generation
 */
public class DiagramGenerationRequest {
    private String projectId;
    private ArchitecturePatternResponse pattern;
    private String cloudChoice;

    // Constructors
    public DiagramGenerationRequest() {}

    public DiagramGenerationRequest(String projectId, ArchitecturePatternResponse pattern, String cloudChoice) {
        this.projectId = projectId;
        this.pattern = pattern;
        this.cloudChoice = cloudChoice;
    }

    // Getters and Setters
    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public ArchitecturePatternResponse getPattern() {
        return pattern;
    }

    public void setPattern(ArchitecturePatternResponse pattern) {
        this.pattern = pattern;
    }

    public String getCloudChoice() {
        return cloudChoice;
    }

    public void setCloudChoice(String cloudChoice) {
        this.cloudChoice = cloudChoice;
    }
}