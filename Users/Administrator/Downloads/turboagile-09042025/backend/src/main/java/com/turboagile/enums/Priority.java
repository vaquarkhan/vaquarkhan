package com.turboagile.enums;

/**
 * Priority Enumeration
 * Defines the priority levels for stories and tasks
 * 
 * @author TurboAgile Team
 * @version 2.0.0
 */
public enum Priority {
    
    LOW("Low", 1, "Low priority, can be addressed later"),
    MEDIUM("Medium", 2, "Normal priority, standard development"),
    HIGH("High", 3, "High priority, should be addressed soon"),
    CRITICAL("Critical", 4, "Critical priority, immediate attention required"),
    URGENT("Urgent", 5, "Urgent priority, highest level of importance");

    private final String displayName;
    private final int level;
    private final String description;

    Priority(String displayName, int level, String description) {
        this.displayName = displayName;
        this.level = level;
        this.description = description;
    }

    public String getDisplayName() {
        return displayName;
    }

    public int getLevel() {
        return level;
    }

    public String getDescription() {
        return description;
    }

    public static Priority fromDisplayName(String displayName) {
        for (Priority priority : values()) {
            if (priority.displayName.equalsIgnoreCase(displayName)) {
                return priority;
            }
        }
        throw new IllegalArgumentException("Unknown priority: " + displayName);
    }

    public static Priority fromLevel(int level) {
        for (Priority priority : values()) {
            if (priority.level == level) {
                return priority;
            }
        }
        throw new IllegalArgumentException("Unknown priority level: " + level);
    }

    public boolean isHigherThan(Priority other) {
        return this.level > other.level;
    }

    public boolean isLowerThan(Priority other) {
        return this.level < other.level;
    }

    public boolean isCritical() {
        return this == CRITICAL || this == URGENT;
    }

    public boolean isHigh() {
        return this == HIGH || this.isCritical();
    }

    public boolean isLow() {
        return this == LOW || this == MEDIUM;
    }
}
