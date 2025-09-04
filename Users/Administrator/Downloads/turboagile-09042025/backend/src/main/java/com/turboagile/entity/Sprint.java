package com.turboagile.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Sprint Entity
 * Represents a Scrum sprint within a project
 * 
 * @author TurboAgile Team
 * @version 2.0.0
 */
@Entity
@Table(name = "sprints", schema = "turboagile")
public class Sprint extends BaseEntity {

    @NotBlank(message = "Sprint name is required")
    @Size(min = 2, max = 100, message = "Sprint name must be between 2 and 100 characters")
    @Column(name = "name", nullable = false)
    private String name;

    @Size(max = 500, message = "Goal cannot exceed 500 characters")
    @Column(name = "goal", columnDefinition = "TEXT")
    private String goal;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private SprintStatus status = SprintStatus.PLANNED;

    @Column(name = "capacity_hours")
    private Double capacityHours;

    @Column(name = "velocity")
    private Double velocity;

    @Column(name = "planned_story_points")
    private Integer plannedStoryPoints;

    @Column(name = "completed_story_points")
    private Integer completedStoryPoints = 0;

    @Column(name = "planned_stories_count")
    private Integer plannedStoriesCount = 0;

    @Column(name = "completed_stories_count")
    private Integer completedStoriesCount = 0;

    @Column(name = "retrospective_notes", columnDefinition = "TEXT")
    private String retrospectiveNotes;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @OneToMany(mappedBy = "sprint", fetch = FetchType.LAZY)
    private Set<Story> stories = new HashSet<>();

    // Constructors
    public Sprint() {}

    public Sprint(String name, LocalDateTime startDate, LocalDateTime endDate, Project project) {
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.project = project;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getGoal() {
        return goal;
    }

    public void setGoal(String goal) {
        this.goal = goal;
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

    public SprintStatus getStatus() {
        return status;
    }

    public void setStatus(SprintStatus status) {
        this.status = status;
    }

    public Double getCapacityHours() {
        return capacityHours;
    }

    public void setCapacityHours(Double capacityHours) {
        this.capacityHours = capacityHours;
    }

    public Double getVelocity() {
        return velocity;
    }

    public void setVelocity(Double velocity) {
        this.velocity = velocity;
    }

    public Integer getPlannedStoryPoints() {
        return plannedStoryPoints;
    }

    public void setPlannedStoryPoints(Integer plannedStoryPoints) {
        this.plannedStoryPoints = plannedStoryPoints;
    }

    public Integer getCompletedStoryPoints() {
        return completedStoryPoints;
    }

    public void setCompletedStoryPoints(Integer completedStoryPoints) {
        this.completedStoryPoints = completedStoryPoints;
    }

    public Integer getPlannedStoriesCount() {
        return plannedStoriesCount;
    }

    public void setPlannedStoriesCount(Integer plannedStoriesCount) {
        this.plannedStoriesCount = plannedStoriesCount;
    }

    public Integer getCompletedStoriesCount() {
        return completedStoriesCount;
    }

    public void setCompletedStoriesCount(Integer completedStoriesCount) {
        this.completedStoriesCount = completedStoriesCount;
    }

    public String getRetrospectiveNotes() {
        return retrospectiveNotes;
    }

    public void setRetrospectiveNotes(String retrospectiveNotes) {
        this.retrospectiveNotes = retrospectiveNotes;
    }

    // Relationship getters and setters
    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public Set<Story> getStories() {
        return stories;
    }

    public void setStories(Set<Story> stories) {
        this.stories = stories;
    }

    // Business methods
    public boolean isActive() {
        return status == SprintStatus.ACTIVE;
    }

    public boolean isCompleted() {
        return status == SprintStatus.COMPLETED;
    }

    public boolean isPlanned() {
        return status == SprintStatus.PLANNED;
    }

    public boolean isDateInRange(LocalDateTime date) {
        return date != null && !date.isBefore(startDate) && !date.isAfter(endDate);
    }

    public void start() {
        this.status = SprintStatus.ACTIVE;
        if (this.startDate == null) {
            this.startDate = LocalDateTime.now();
        }
    }

    public void complete() {
        this.status = SprintStatus.COMPLETED;
        this.endDate = LocalDateTime.now();
        calculateVelocity();
    }

    public void calculateVelocity() {
        if (this.completedStoryPoints != null && this.completedStoryPoints > 0) {
            long days = java.time.Duration.between(startDate, endDate).toDays();
            if (days > 0) {
                this.velocity = (double) this.completedStoryPoints / days;
            }
        }
    }

    public void addStory(Story story) {
        stories.add(story);
        story.setSprint(this);
        updateCounts();
    }

    public void removeStory(Story story) {
        stories.remove(story);
        story.setSprint(null);
        updateCounts();
    }

    private void updateCounts() {
        this.plannedStoriesCount = stories.size();
        this.plannedStoryPoints = stories.stream()
                .mapToInt(s -> s.getStoryPoints() != null ? s.getStoryPoints() : 0)
                .sum();
        
        this.completedStoriesCount = (int) stories.stream()
                .filter(Story::isCompleted)
                .count();
        
        this.completedStoryPoints = stories.stream()
                .filter(Story::isCompleted)
                .mapToInt(s -> s.getStoryPoints() != null ? s.getStoryPoints() : 0)
                .sum();
    }

    public double getProgressPercentage() {
        if (plannedStoryPoints == null || plannedStoryPoints == 0) {
            return 0.0;
        }
        return (double) completedStoryPoints / plannedStoryPoints * 100;
    }

    public boolean isOverdue() {
        return LocalDateTime.now().isAfter(endDate) && !isCompleted();
    }

    public long getRemainingDays() {
        if (isCompleted()) {
            return 0;
        }
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(startDate)) {
            return java.time.Duration.between(now, startDate).toDays();
        } else {
            return java.time.Duration.between(now, endDate).toDays();
        }
    }

    @Override
    public String toString() {
        return "Sprint{" +
                "id=" + getId() +
                ", name='" + name + '\'' +
                ", status=" + status +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                ", isActive=" + isActive() +
                '}';
    }

    // Sprint Status Enum
    public enum SprintStatus {
        PLANNED("Planned", "Sprint is planned but not started"),
        ACTIVE("Active", "Sprint is currently running"),
        COMPLETED("Completed", "Sprint has been completed"),
        CANCELLED("Cancelled", "Sprint has been cancelled");

        private final String displayName;
        private final String description;

        SprintStatus(String displayName, String description) {
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
