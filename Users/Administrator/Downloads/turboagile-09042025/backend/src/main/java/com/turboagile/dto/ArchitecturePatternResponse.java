package com.turboagile.dto;

import java.util.List;

/**
 * Response DTO for architecture patterns
 */
public class ArchitecturePatternResponse {
    private String id;
    private String name;
    private String description;
    private String referenceLink;
    private Double estimatedCost;
    private List<String> pros;
    private List<String> cons;

    // Constructors
    public ArchitecturePatternResponse() {}

    public ArchitecturePatternResponse(String id, String name, String description, String referenceLink, 
                                     Double estimatedCost, List<String> pros, List<String> cons) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.referenceLink = referenceLink;
        this.estimatedCost = estimatedCost;
        this.pros = pros;
        this.cons = cons;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getReferenceLink() {
        return referenceLink;
    }

    public void setReferenceLink(String referenceLink) {
        this.referenceLink = referenceLink;
    }

    public Double getEstimatedCost() {
        return estimatedCost;
    }

    public void setEstimatedCost(Double estimatedCost) {
        this.estimatedCost = estimatedCost;
    }

    public List<String> getPros() {
        return pros;
    }

    public void setPros(List<String> pros) {
        this.pros = pros;
    }

    public List<String> getCons() {
        return cons;
    }

    public void setCons(List<String> cons) {
        this.cons = cons;
    }
}