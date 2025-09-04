package com.turboagile.dto;

/**
 * Validation Request DTO
 */
public class ValidationRequest {
    private String projectId;
    private String architecturePattern;
    private String cloudProvider;
    private String[] categories;
    private String customRequirements;

    // Constructors
    public ValidationRequest() {}

    public ValidationRequest(String projectId, String architecturePattern, String cloudProvider) {
        this.projectId = projectId;
        this.architecturePattern = architecturePattern;
        this.cloudProvider = cloudProvider;
    }

    // Getters and Setters
    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getArchitecturePattern() {
        return architecturePattern;
    }

    public void setArchitecturePattern(String architecturePattern) {
        this.architecturePattern = architecturePattern;
    }

    public String getCloudProvider() {
        return cloudProvider;
    }

    public void setCloudProvider(String cloudProvider) {
        this.cloudProvider = cloudProvider;
    }

    public String[] getCategories() {
        return categories;
    }

    public void setCategories(String[] categories) {
        this.categories = categories;
    }

    public String getCustomRequirements() {
        return customRequirements;
    }

    public void setCustomRequirements(String customRequirements) {
        this.customRequirements = customRequirements;
    }
}