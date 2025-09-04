package com.turboagile.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Project Entity
 * Represents a project within an organization
 * 
 * @author TurboAgile Team
 * @version 2.0.0
 */
@Entity
@Table(name = "projects", schema = "turboagile")
public class Project extends BaseEntity {

    @NotBlank(message = "Project name is required")
    @Size(min = 2, max = 100, message = "Project name must be between 2 and 100 characters")
    @Column(name = "name", nullable = false)
    private String name;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "key", unique = true, length = 10)
    private String key;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ProjectStatus status = ProjectStatus.ACTIVE;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "budget")
    private Double budget;

    @Column(name = "currency", length = 3)
    private String currency = "USD";

    @Column(name = "team_size")
    private Integer teamSize = 0;

    @Column(name = "progress_percentage")
    private Integer progressPercentage = 0;

    @Column(name = "repository_url")
    private String repositoryUrl;

    @Column(name = "documentation_url")
    private String documentationUrl;

    @Column(name = "tags", columnDefinition = "TEXT[]")
    private String[] tags;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Story> stories = new HashSet<>();

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Sprint> sprints = new HashSet<>();

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<ArchitectureDiagram> architectureDiagrams = new HashSet<>();

    // Constructors
    public Project() {}

    public Project(String name, String description, Organization organization) {
        this.name = name;
        this.description = description;
        this.organization = organization;
    }

    // Getters and Setters
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

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public ProjectStatus getStatus() {
        return status;
    }

    public void setStatus(ProjectStatus status) {
        this.status = status;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public Double getBudget() {
        return budget;
    }

    public void setBudget(Double budget) {
        this.budget = budget;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public Integer getTeamSize() {
        return teamSize;
    }

    public void setTeamSize(Integer teamSize) {
        this.teamSize = teamSize;
    }

    public Integer getProgressPercentage() {
        return progressPercentage;
    }

    public void setProgressPercentage(Integer progressPercentage) {
        this.progressPercentage = progressPercentage;
    }

    public String getRepositoryUrl() {
        return repositoryUrl;
    }

    public void setRepositoryUrl(String repositoryUrl) {
        this.repositoryUrl = repositoryUrl;
    }

    public String getDocumentationUrl() {
        return documentationUrl;
    }

    public void setDocumentationUrl(String documentationUrl) {
        this.documentationUrl = documentationUrl;
    }

    public String[] getTags() {
        return tags;
    }

    public void setTags(String[] tags) {
        this.tags = tags;
    }

    // Relationship getters and setters
    public Organization getOrganization() {
        return organization;
    }

    public void setOrganization(Organization organization) {
        this.organization = organization;
    }

    public Set<Story> getStories() {
        return stories;
    }

    public void setStories(Set<Story> stories) {
        this.stories = stories;
    }

    public Set<Sprint> getSprints() {
        return sprints;
    }

    public void setSprints(Set<Sprint> sprints) {
        this.sprints = sprints;
    }

    public Set<ArchitectureDiagram> getArchitectureDiagrams() {
        return architectureDiagrams;
    }

    public void setArchitectureDiagrams(Set<ArchitectureDiagram> architectureDiagrams) {
        this.architectureDiagrams = architectureDiagrams;
    }

    // Business methods
    public void addStory(Story story) {
        stories.add(story);
        story.setProject(this);
    }

    public void removeStory(Story story) {
        stories.remove(story);
        story.setProject(null);
    }

    public void addSprint(Sprint sprint) {
        sprints.add(sprint);
        sprint.setProject(this);
    }

    public void removeSprint(Sprint sprint) {
        sprints.remove(sprint);
        sprint.setProject(null);
    }

    public void addArchitectureDiagram(ArchitectureDiagram diagram) {
        architectureDiagrams.add(diagram);
        diagram.setProject(this);
    }

    public void removeArchitectureDiagram(ArchitectureDiagram diagram) {
        architectureDiagrams.remove(diagram);
        diagram.setProject(null);
    }

    public boolean isActive() {
        return status == ProjectStatus.ACTIVE;
    }

    public boolean isCompleted() {
        return status == ProjectStatus.COMPLETED;
    }

    public boolean isOnHold() {
        return status == ProjectStatus.ON_HOLD;
    }

    public boolean isCancelled() {
        return status == ProjectStatus.CANCELLED;
    }

    public void start() {
        this.status = ProjectStatus.ACTIVE;
        if (this.startDate == null) {
            this.startDate = LocalDateTime.now();
        }
    }

    public void complete() {
        this.status = ProjectStatus.COMPLETED;
        this.endDate = LocalDateTime.now();
        this.progressPercentage = 100;
    }

    public void putOnHold() {
        this.status = ProjectStatus.ON_HOLD;
    }

    public void cancel() {
        this.status = ProjectStatus.CANCELLED;
        this.endDate = LocalDateTime.now();
    }

    @Override
    public String toString() {
        return "Project{" +
                "id=" + getId() +
                ", name='" + name + '\'' +
                ", key='" + key + '\'' +
                ", status=" + status +
                ", isActive=" + isActive() +
                '}';
    }

    // Project Status Enum
    public enum ProjectStatus {
        PLANNING("Planning", "Project is in planning phase"),
        ACTIVE("Active", "Project is currently active"),
        ON_HOLD("On Hold", "Project is temporarily paused"),
        COMPLETED("Completed", "Project has been completed"),
        CANCELLED("Cancelled", "Project has been cancelled");

        private final String displayName;
        private final String description;

        ProjectStatus(String displayName, String description) {
            this.displayName = displayName;
            this.description = description;
        }

        public String getDisplayName() {
            return displayName;
        }

        public String getDescription() {
            return description;
        }
    }
}
