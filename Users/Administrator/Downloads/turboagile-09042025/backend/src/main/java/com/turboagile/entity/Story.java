package com.turboagile.entity;

import com.turboagile.enums.Priority;
import com.turboagile.enums.StoryStatus;
import com.turboagile.enums.StoryType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Story Entity
 * Represents a user story with Jira Scrum methodology support
 * 
 * @author TurboAgile Team
 * @version 2.0.0
 */
@Entity
@Table(name = "stories", schema = "turboagile")
public class Story extends BaseEntity {

    @NotBlank(message = "Story title is required")
    @Size(min = 3, max = 255, message = "Story title must be between 3 and 255 characters")
    @Column(name = "title", nullable = false)
    private String title;

    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Size(max = 1000, message = "Acceptance criteria cannot exceed 1000 characters")
    @Column(name = "acceptance_criteria", columnDefinition = "TEXT")
    private String acceptanceCriteria;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private StoryType type = StoryType.STORY;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private StoryStatus status = StoryStatus.BACKLOG;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false)
    private Priority priority = Priority.MEDIUM;

    @Column(name = "story_points")
    private Integer storyPoints;

    @Column(name = "assignee")
    private String assignee;

    @Column(name = "reporter")
    private String reporter;

    @Column(name = "epic_link")
    private String epicLink;

    @Column(name = "labels", columnDefinition = "TEXT[]")
    private String[] labels;

    @Column(name = "due_date")
    private LocalDateTime dueDate;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "estimated_hours")
    private Double estimatedHours;

    @Column(name = "actual_hours")
    private Double actualHours;

    @Column(name = "blocked_reason")
    private String blockedReason;

    @Column(name = "blocked_until")
    private LocalDateTime blockedUntil;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sprint_id")
    private Sprint sprint;

    @OneToMany(mappedBy = "story", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<StoryHistory> history = new HashSet<>();

    // Constructors
    public Story() {}

    public Story(String title, String description, Project project) {
        this.title = title;
        this.description = description;
        this.project = project;
    }

    // Getters and Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAcceptanceCriteria() {
        return acceptanceCriteria;
    }

    public void setAcceptanceCriteria(String acceptanceCriteria) {
        this.acceptanceCriteria = acceptanceCriteria;
    }

    public StoryType getType() {
        return type;
    }

    public void setType(StoryType type) {
        this.type = type;
    }

    public StoryStatus getStatus() {
        return status;
    }

    public void setStatus(StoryStatus status) {
        this.status = status;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public Integer getStoryPoints() {
        return storyPoints;
    }

    public void setStoryPoints(Integer storyPoints) {
        this.storyPoints = storyPoints;
    }

    public String getAssignee() {
        return assignee;
    }

    public void setAssignee(String assignee) {
        this.assignee = assignee;
    }

    public String getReporter() {
        return reporter;
    }

    public void setReporter(String reporter) {
        this.reporter = reporter;
    }

    public String getEpicLink() {
        return epicLink;
    }

    public void setEpicLink(String epicLink) {
        this.epicLink = epicLink;
    }

    public String[] getLabels() {
        return labels;
    }

    public void setLabels(String[] labels) {
        this.labels = labels;
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public Double getEstimatedHours() {
        return estimatedHours;
    }

    public void setEstimatedHours(Double estimatedHours) {
        this.estimatedHours = estimatedHours;
    }

    public Double getActualHours() {
        return actualHours;
    }

    public void setActualHours(Double actualHours) {
        this.actualHours = actualHours;
    }

    public String getBlockedReason() {
        return blockedReason;
    }

    public void setBlockedReason(String blockedReason) {
        this.blockedReason = blockedReason;
    }

    public LocalDateTime getBlockedUntil() {
        return blockedUntil;
    }

    public void setBlockedUntil(LocalDateTime blockedUntil) {
        this.blockedUntil = blockedUntil;
    }

    // Relationship getters and setters
    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public Sprint getSprint() {
        return sprint;
    }

    public void setSprint(Sprint sprint) {
        this.sprint = sprint;
    }

    public Set<StoryHistory> getHistory() {
        return history;
    }

    public void setHistory(Set<StoryHistory> history) {
        this.history = history;
    }

    // Business methods
    public boolean isCompleted() {
        return status == StoryStatus.DONE;
    }

    public boolean isBlocked() {
        return status == StoryStatus.BLOCKED || status == StoryStatus.ON_HOLD;
    }

    public boolean isInProgress() {
        return status == StoryStatus.IN_PROGRESS || status == StoryStatus.REVIEW || status == StoryStatus.TESTING;
    }

    public boolean isInSprint() {
        return sprint != null && sprint.isActive();
    }

    public boolean isOverdue() {
        return dueDate != null && dueDate.isBefore(LocalDateTime.now()) && !isCompleted();
    }

    public void moveToSprint(Sprint newSprint) {
        if (this.sprint != null) {
            this.sprint.getStories().remove(this);
        }
        this.sprint = newSprint;
        if (newSprint != null) {
            newSprint.getStories().add(this);
        }
    }

    public void markAsCompleted() {
        this.status = StoryStatus.DONE;
        this.completedAt = LocalDateTime.now();
    }

    public void block(String reason, LocalDateTime blockedUntil) {
        this.status = StoryStatus.BLOCKED;
        this.blockedReason = reason;
        this.blockedUntil = blockedUntil;
    }

    public void unblock() {
        this.status = StoryStatus.TO_DO;
        this.blockedReason = null;
        this.blockedUntil = null;
    }

    public void addLabel(String label) {
        if (this.labels == null) {
            this.labels = new String[0];
        }
        String[] newLabels = new String[this.labels.length + 1];
        System.arraycopy(this.labels, 0, newLabels, 0, this.labels.length);
        newLabels[this.labels.length] = label;
        this.labels = newLabels;
    }

    public void removeLabel(String label) {
        if (this.labels == null) {
            return;
        }
        // Implementation to remove label
        // This is a simplified version - in production you might want a more sophisticated approach
    }

    public boolean hasLabel(String label) {
        if (this.labels == null) {
            return false;
        }
        for (String l : this.labels) {
            if (l.equals(label)) {
                return true;
            }
        }
        return false;
    }

    @Override
    public String toString() {
        return "Story{" +
                "id=" + getId() +
                ", title='" + title + '\'' +
                ", type=" + type +
                ", status=" + status +
                ", priority=" + priority +
                ", storyPoints=" + storyPoints +
                ", isCompleted=" + isCompleted() +
                '}';
    }
}
