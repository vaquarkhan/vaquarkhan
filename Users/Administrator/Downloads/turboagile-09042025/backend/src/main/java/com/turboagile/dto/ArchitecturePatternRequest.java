package com.turboagile.dto;

/**
 * Request DTO for architecture pattern generation
 */
public class ArchitecturePatternRequest {
    private String projectId;
    private String cloudChoice;
    private String customPrompt;
    private String brdContext;

    // Constructors
    public ArchitecturePatternRequest() {}

    public ArchitecturePatternRequest(String projectId, String cloudChoice, String customPrompt, String brdContext) {
        this.projectId = projectId;
        this.cloudChoice = cloudChoice;
        this.customPrompt = customPrompt;
        this.brdContext = brdContext;
    }

    // Getters and Setters
    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getCloudChoice() {
        return cloudChoice;
    }

    public void setCloudChoice(String cloudChoice) {
        this.cloudChoice = cloudChoice;
    }

    public String getCustomPrompt() {
        return customPrompt;
    }

    public void setCustomPrompt(String customPrompt) {
        this.customPrompt = customPrompt;
    }

    public String getBrdContext() {
        return brdContext;
    }

    public void setBrdContext(String brdContext) {
        this.brdContext = brdContext;
    }
}