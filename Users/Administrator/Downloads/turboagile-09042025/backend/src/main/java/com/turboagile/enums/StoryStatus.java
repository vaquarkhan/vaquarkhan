package com.turboagile.enums;

/**
 * Story Status Enumeration
 * Defines the different workflow states for user stories
 * 
 * @author TurboAgile Team
 * @version 2.0.0
 */
public enum StoryStatus {
    
    BACKLOG("Backlog", "Story is in the product backlog"),
    TO_DO("To Do", "Story is planned and ready for development"),
    IN_PROGRESS("In Progress", "Story is currently being worked on"),
    REVIEW("Review", "Story is completed and under review"),
    TESTING("Testing", "Story is being tested"),
    DONE("Done", "Story is completed and accepted"),
    CANCELLED("Cancelled", "Story has been cancelled"),
    BLOCKED("Blocked", "Story is blocked and cannot proceed"),
    ON_HOLD("On Hold", "Story is temporarily paused");

    private final String displayName;
    private final String description;

    StoryStatus(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getDescription() {
        return description;
    }

    public static StoryStatus fromDisplayName(String displayName) {
        for (StoryStatus status : values()) {
            if (status.displayName.equalsIgnoreCase(displayName)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown story status: " + displayName);
    }

    public boolean isActive() {
        return this == IN_PROGRESS || this == REVIEW || this == TESTING;
    }

    public boolean isCompleted() {
        return this == DONE;
    }

    public boolean isBlocked() {
        return this == BLOCKED || this == ON_HOLD;
    }

    public boolean canTransitionTo(StoryStatus targetStatus) {
        switch (this) {
            case BACKLOG:
                return targetStatus == TO_DO || targetStatus == CANCELLED;
            case TO_DO:
                return targetStatus == IN_PROGRESS || targetStatus == BLOCKED || targetStatus == CANCELLED;
            case IN_PROGRESS:
                return targetStatus == REVIEW || targetStatus == BLOCKED || targetStatus == ON_HOLD;
            case REVIEW:
                return targetStatus == TESTING || targetStatus == IN_PROGRESS || targetStatus == BLOCKED;
            case TESTING:
                return targetStatus == DONE || targetStatus == IN_PROGRESS || targetStatus == BLOCKED;
            case DONE:
                return targetStatus == IN_PROGRESS; // Reopening
            case BLOCKED:
                return targetStatus == TO_DO || targetStatus == IN_PROGRESS;
            case ON_HOLD:
                return targetStatus == TO_DO || targetStatus == IN_PROGRESS;
            case CANCELLED:
                return false; // Cannot transition from cancelled
            default:
                return false;
        }
    }
}
