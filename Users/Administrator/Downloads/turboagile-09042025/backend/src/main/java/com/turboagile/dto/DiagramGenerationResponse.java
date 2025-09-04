package com.turboagile.dto;

/**
 * Response DTO for diagram generation
 */
public class DiagramGenerationResponse {
    private String architectureDiagram;
    private String sequenceDiagram;
    private String erDiagram;

    // Constructors
    public DiagramGenerationResponse() {}

    public DiagramGenerationResponse(String architectureDiagram, String sequenceDiagram, String erDiagram) {
        this.architectureDiagram = architectureDiagram;
        this.sequenceDiagram = sequenceDiagram;
        this.erDiagram = erDiagram;
    }

    // Getters and Setters
    public String getArchitectureDiagram() {
        return architectureDiagram;
    }

    public void setArchitectureDiagram(String architectureDiagram) {
        this.architectureDiagram = architectureDiagram;
    }

    public String getSequenceDiagram() {
        return sequenceDiagram;
    }

    public void setSequenceDiagram(String sequenceDiagram) {
        this.sequenceDiagram = sequenceDiagram;
    }

    public String getErDiagram() {
        return erDiagram;
    }

    public void setErDiagram(String erDiagram) {
        this.erDiagram = erDiagram;
    }
}