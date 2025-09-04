package com.turboagile.dto;

import java.time.LocalDateTime;

/**
 * DTO for Organization statistics
 * 
 * @author TurboAgile Team
 * @version 2.0.0
 */
public class OrganizationStatistics {

    private Long totalUsers;
    private Long totalProjects;
    private Long totalStories;
    private Long totalSprints;
    private Long activeProjects;
    private Long completedProjects;
    private Long activeStories;
    private Long completedStories;
    private Long activeSprints;
    private Long completedSprints;
    private LocalDateTime lastActivity;
    private Double averageProjectProgress;
    private Double averageSprintVelocity;

    // Constructors
    public OrganizationStatistics() {}

    public OrganizationStatistics(Long totalUsers, Long totalProjects, Long totalStories, Long totalSprints) {
        this.totalUsers = totalUsers;
        this.totalProjects = totalProjects;
        this.totalStories = totalStories;
        this.totalSprints = totalSprints;
    }

    // Getters and Setters
    public Long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(Long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Long getTotalProjects() {
        return totalProjects;
    }

    public void setTotalProjects(Long totalProjects) {
        this.totalProjects = totalProjects;
    }

    public Long getTotalStories() {
        return totalStories;
    }

    public void setTotalStories(Long totalStories) {
        this.totalStories = totalStories;
    }

    public Long getTotalSprints() {
        return totalSprints;
    }

    public void setTotalSprints(Long totalSprints) {
        this.totalSprints = totalSprints;
    }

    public Long getActiveProjects() {
        return activeProjects;
    }

    public void setActiveProjects(Long activeProjects) {
        this.activeProjects = activeProjects;
    }

    public Long getCompletedProjects() {
        return completedProjects;
    }

    public void setCompletedProjects(Long completedProjects) {
        this.completedProjects = completedProjects;
    }

    public Long getActiveStories() {
        return activeStories;
    }

    public void setActiveStories(Long activeStories) {
        this.activeStories = activeStories;
    }

    public Long getCompletedStories() {
        return completedStories;
    }

    public void setCompletedStories(Long completedStories) {
        this.completedStories = completedStories;
    }

    public Long getActiveSprints() {
        return activeSprints;
    }

    public void setActiveSprints(Long activeSprints) {
        this.activeSprints = activeSprints;
    }

    public Long getCompletedSprints() {
        return completedSprints;
    }

    public void setCompletedSprints(Long completedSprints) {
        this.completedSprints = completedSprints;
    }

    public LocalDateTime getLastActivity() {
        return lastActivity;
    }

    public void setLastActivity(LocalDateTime lastActivity) {
        this.lastActivity = lastActivity;
    }

    public Double getAverageProjectProgress() {
        return averageProjectProgress;
    }

    public void setAverageProjectProgress(Double averageProjectProgress) {
        this.averageProjectProgress = averageProjectProgress;
    }

    public Double getAverageSprintVelocity() {
        return averageSprintVelocity;
    }

    public void setAverageSprintVelocity(Double averageSprintVelocity) {
        this.averageSprintVelocity = averageSprintVelocity;
    }

    @Override
    public String toString() {
        return "OrganizationStatistics{" +
                "totalUsers=" + totalUsers +
                ", totalProjects=" + totalProjects +
                ", totalStories=" + totalStories +
                ", totalSprints=" + totalSprints +
                ", activeProjects=" + activeProjects +
                ", completedProjects=" + completedProjects +
                ", activeStories=" + activeStories +
                ", completedStories=" + completedStories +
                ", activeSprints=" + activeSprints +
                ", completedSprints=" + completedSprints +
                ", lastActivity=" + lastActivity +
                ", averageProjectProgress=" + averageProjectProgress +
                ", averageSprintVelocity=" + averageSprintVelocity +
                '}';
    }
}
