package com.turboagile.dto;

import java.util.Map;

/**
 * Response DTO for code generation
 */
public class CodeGenerationResponse {
    private String language;
    private String framework;
    private Map<String, String> files;

    // Constructors
    public CodeGenerationResponse() {}

    public CodeGenerationResponse(String language, String framework, Map<String, String> files) {
        this.language = language;
        this.framework = framework;
        this.files = files;
    }

    // Getters and Setters
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

    public Map<String, String> getFiles() {
        return files;
    }

    public void setFiles(Map<String, String> files) {
        this.files = files;
    }
}