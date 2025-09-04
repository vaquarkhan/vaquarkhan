package com.turboagile.enums;

/**
 * Story Type Enumeration
 * Defines the different types of user stories in the system
 * 
 * @author TurboAgile Team
 * @version 2.0.0
 */
public enum StoryType {
    
    STORY("Story", "User story describing a feature or requirement"),
    BUG("Bug", "Defect or issue that needs to be fixed"),
    TASK("Task", "Technical task or work item"),
    EPIC("Epic", "Large body of work that can be broken down into stories"),
    SUBTASK("Subtask", "Smaller task that is part of a larger story"),
    IMPROVEMENT("Improvement", "Enhancement to existing functionality"),
    RESEARCH("Research", "Investigation or analysis work"),
    DOCUMENTATION("Documentation", "Documentation or knowledge base work"),
    ARCHITECTURE("Architecture", "Architecture design and pattern definition");

    private final String displayName;
    private final String description;

    StoryType(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getDescription() {
        return description;
    }

    public static StoryType fromDisplayName(String displayName) {
        for (StoryType type : values()) {
            if (type.displayName.equalsIgnoreCase(displayName)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown story type: " + displayName);
    }

    public boolean isEpic() {
        return this == EPIC;
    }

    public boolean isStory() {
        return this == STORY;
    }

    public boolean isBug() {
        return this == BUG;
    }

    public boolean isTask() {
        return this == TASK;
    }
}
