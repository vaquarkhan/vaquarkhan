package com.turboagile.dto;

/**
 * Validation Result DTO
 */
public class ValidationResult {
    private String id;
    private String name;
    private String category;
    private String severity;
    private String status;
    private String message;
    private String suggestion;
    private String description;

    // Constructors
    public ValidationResult() {}

    public ValidationResult(String id, String name, String category, String severity, 
                          String status, String message) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.severity = severity;
        this.status = status;
        this.message = message;
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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getSuggestion() {
        return suggestion;
    }

    public void setSuggestion(String suggestion) {
        this.suggestion = suggestion;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}