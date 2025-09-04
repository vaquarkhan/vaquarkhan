package com.turboagile.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Story History Entity
 * Tracks changes to story fields for audit purposes
 * 
 * @author TurboAgile Team
 * @version 2.0.0
 */
@Entity
@Table(name = "story_history", schema = "turboagile")
public class StoryHistory extends BaseEntity {

    @Column(name = "field_name", nullable = false)
    private String fieldName;

    @Column(name = "old_value", columnDefinition = "TEXT")
    private String oldValue;

    @Column(name = "new_value", columnDefinition = "TEXT")
    private String newValue;

    @Column(name = "change_type", nullable = false)
    private String changeType; // CREATE, UPDATE, DELETE

    @Column(name = "change_reason")
    private String changeReason;

    @Column(name = "changed_at", nullable = false)
    private LocalDateTime changedAt;

    @Column(name = "changed_by")
    private String changedBy;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "story_id", nullable = false)
    private Story story;

    // Constructors
    public StoryHistory() {}

    public StoryHistory(String fieldName, String oldValue, String newValue, String changeType, Story story) {
        this.fieldName = fieldName;
        this.oldValue = oldValue;
        this.newValue = newValue;
        this.changeType = changeType;
        this.story = story;
        this.changedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getFieldName() {
        return fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

    public String getOldValue() {
        return oldValue;
    }

    public void setOldValue(String oldValue) {
        this.oldValue = oldValue;
    }

    public String getNewValue() {
        return newValue;
    }

    public void setNewValue(String newValue) {
        this.newValue = newValue;
    }

    public String getChangeType() {
        return changeType;
    }

    public void setChangeType(String changeType) {
        this.changeType = changeType;
    }

    public String getChangeReason() {
        return changeReason;
    }

    public void setChangeReason(String changeReason) {
        this.changeReason = changeReason;
    }

    public LocalDateTime getChangedAt() {
        return changedAt;
    }

    public void setChangedAt(LocalDateTime changedAt) {
        this.changedAt = changedAt;
    }

    public String getChangedBy() {
        return changedBy;
    }

    public void setChangedBy(String changedBy) {
        this.changedBy = changedBy;
    }

    public Story getStory() {
        return story;
    }

    public void setStory(Story story) {
        this.story = story;
    }

    // Business methods
    public boolean isCreate() {
        return "CREATE".equals(changeType);
    }

    public boolean isUpdate() {
        return "UPDATE".equals(changeType);
    }

    public boolean isDelete() {
        return "DELETE".equals(changeType);
    }

    public boolean hasValueChange() {
        return oldValue != null && newValue != null && !oldValue.equals(newValue);
    }

    public String getChangeSummary() {
        if (isCreate()) {
            return "Field '" + fieldName + "' created with value: " + newValue;
        } else if (isUpdate()) {
            return "Field '" + fieldName + "' changed from '" + oldValue + "' to '" + newValue + "'";
        } else if (isDelete()) {
            return "Field '" + fieldName + "' deleted (was: " + oldValue + ")";
        }
        return "Field '" + fieldName + "' modified";
    }

    @Override
    public String toString() {
        return "StoryHistory{" +
                "id=" + getId() +
                ", fieldName='" + fieldName + '\'' +
                ", changeType='" + changeType + '\'' +
                ", changedAt=" + changedAt +
                ", changedBy='" + changedBy + '\'' +
                '}';
    }
}
