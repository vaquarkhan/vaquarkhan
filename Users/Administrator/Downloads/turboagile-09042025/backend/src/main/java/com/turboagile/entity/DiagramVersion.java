package com.turboagile.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Diagram Version Entity
 * Tracks different versions of architecture diagrams
 * 
 * @author TurboAgile Team
 * @version 2.0.0
 */
@Entity
@Table(name = "diagram_versions", schema = "turboagile")
public class DiagramVersion extends BaseEntity {

    @Column(name = "version_number", nullable = false)
    private Integer versionNumber;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content; // JSON or XML content of the diagram

    @Column(name = "image_url")
    private String imageUrl; // URL to the generated image

    @Column(name = "svg_content", columnDefinition = "TEXT")
    private String svgContent; // SVG content for vector graphics

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "change_notes", columnDefinition = "TEXT")
    private String changeNotes;

    @Column(name = "is_current_version")
    private Boolean isCurrentVersion = false;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "architecture_diagram_id", nullable = false)
    private ArchitectureDiagram architectureDiagram;

    // Constructors
    public DiagramVersion() {}

    public DiagramVersion(Integer versionNumber, String content, ArchitectureDiagram architectureDiagram) {
        this.versionNumber = versionNumber;
        this.content = content;
        this.architectureDiagram = architectureDiagram;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Integer getVersionNumber() {
        return versionNumber;
    }

    public void setVersionNumber(Integer versionNumber) {
        this.versionNumber = versionNumber;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getSvgContent() {
        return svgContent;
    }

    public void setSvgContent(String svgContent) {
        this.svgContent = svgContent;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getChangeNotes() {
        return changeNotes;
    }

    public void setChangeNotes(String changeNotes) {
        this.changeNotes = changeNotes;
    }

    public Boolean getIsCurrentVersion() {
        return isCurrentVersion;
    }

    public void setIsCurrentVersion(Boolean isCurrentVersion) {
        this.isCurrentVersion = isCurrentVersion;
    }

    public ArchitectureDiagram getArchitectureDiagram() {
        return architectureDiagram;
    }

    public void setArchitectureDiagram(ArchitectureDiagram architectureDiagram) {
        this.architectureDiagram = architectureDiagram;
    }

    // Business methods
    public boolean isCurrentVersion() {
        return Boolean.TRUE.equals(isCurrentVersion);
    }

    public void markAsCurrentVersion() {
        this.isCurrentVersion = true;
    }

    public void markAsOldVersion() {
        this.isCurrentVersion = false;
    }

    public String getVersionLabel() {
        return "v" + versionNumber;
    }

    public boolean hasImage() {
        return imageUrl != null && !imageUrl.trim().isEmpty();
    }

    public boolean hasSvg() {
        return svgContent != null && !svgContent.trim().isEmpty();
    }

    @Override
    public String toString() {
        return "DiagramVersion{" +
                "id=" + getId() +
                ", versionNumber=" + versionNumber +
                ", createdAt=" + createdAt +
                ", isCurrentVersion=" + isCurrentVersion() +
                '}';
    }
}
