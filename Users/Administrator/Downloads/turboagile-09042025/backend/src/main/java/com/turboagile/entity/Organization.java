package com.turboagile.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;

/**
 * Organization Entity
 * Represents a tenant organization in the multi-tenant system
 * 
 * @author TurboAgile Team
 * @version 2.0.0
 */
@Entity
@Table(name = "organizations", schema = "turboagile")
public class Organization extends BaseEntity {

    @NotBlank(message = "Organization name is required")
    @Size(min = 2, max = 100, message = "Organization name must be between 2 and 100 characters")
    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "domain", unique = true)
    private String domain;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(name = "website_url")
    private String websiteUrl;

    @Column(name = "contact_email")
    private String contactEmail;

    @Column(name = "contact_phone")
    private String contactPhone;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "timezone", length = 50)
    private String timezone = "UTC";

    @Column(name = "locale", length = 10)
    private String locale = "en_US";

    @Column(name = "max_users")
    private Integer maxUsers = 100;

    @Column(name = "max_projects")
    private Integer maxProjects = 50;

    @Column(name = "subscription_plan")
    @Enumerated(EnumType.STRING)
    private SubscriptionPlan subscriptionPlan = SubscriptionPlan.FREE;

    @Column(name = "subscription_expires_at")
    private java.time.LocalDateTime subscriptionExpiresAt;

    // Relationships
    @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Project> projects = new HashSet<>();

    @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<User> users = new HashSet<>();

    @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Connector> connectors = new HashSet<>();

    // Constructors
    public Organization() {}

    public Organization(String name, String description) {
        this.name = name;
        this.description = description;
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

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }

    public String getWebsiteUrl() {
        return websiteUrl;
    }

    public void setWebsiteUrl(String websiteUrl) {
        this.websiteUrl = websiteUrl;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public String getLocale() {
        return locale;
    }

    public void setLocale(String locale) {
        this.locale = locale;
    }

    public Integer getMaxUsers() {
        return maxUsers;
    }

    public void setMaxUsers(Integer maxUsers) {
        this.maxUsers = maxUsers;
    }

    public Integer getMaxProjects() {
        return maxProjects;
    }

    public void setMaxProjects(Integer maxProjects) {
        this.maxProjects = maxProjects;
    }

    public SubscriptionPlan getSubscriptionPlan() {
        return subscriptionPlan;
    }

    public void setSubscriptionPlan(SubscriptionPlan subscriptionPlan) {
        this.subscriptionPlan = subscriptionPlan;
    }

    public java.time.LocalDateTime getSubscriptionExpiresAt() {
        return subscriptionExpiresAt;
    }

    public void setSubscriptionExpiresAt(java.time.LocalDateTime subscriptionExpiresAt) {
        this.subscriptionExpiresAt = subscriptionExpiresAt;
    }

    // Relationship getters and setters
    public Set<Project> getProjects() {
        return projects;
    }

    public void setProjects(Set<Project> projects) {
        this.projects = projects;
    }

    public Set<User> getUsers() {
        return users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }

    public Set<Connector> getConnectors() {
        return connectors;
    }

    public void setConnectors(Set<Connector> connectors) {
        this.connectors = connectors;
    }

    // Business methods
    public void addProject(Project project) {
        projects.add(project);
        project.setOrganization(this);
    }

    public void removeProject(Project project) {
        projects.remove(project);
        project.setOrganization(null);
    }

    public void addUser(User user) {
        users.add(user);
        user.setOrganization(this);
    }

    public void removeUser(User user) {
        users.remove(user);
        user.setOrganization(null);
    }

    public boolean canAddUser() {
        return users.size() < maxUsers;
    }

    public boolean canAddProject() {
        return projects.size() < maxProjects;
    }

    public boolean isSubscriptionActive() {
        return subscriptionExpiresAt == null || 
               subscriptionExpiresAt.isAfter(java.time.LocalDateTime.now());
    }

    @Override
    public String toString() {
        return "Organization{" +
                "id=" + getId() +
                ", name='" + name + '\'' +
                ", domain='" + domain + '\'' +
                ", isActive=" + isActive() +
                '}';
    }

    // Subscription Plan Enum
    public enum SubscriptionPlan {
        FREE("Free", 0, 5, 2),
        BASIC("Basic", 29, 25, 10),
        PROFESSIONAL("Professional", 99, 100, 50),
        ENTERPRISE("Enterprise", 299, -1, -1);

        private final String displayName;
        private final int monthlyPrice;
        private final int maxUsers;
        private final int maxProjects;

        SubscriptionPlan(String displayName, int monthlyPrice, int maxUsers, int maxProjects) {
            this.displayName = displayName;
            this.monthlyPrice = monthlyPrice;
            this.maxUsers = maxUsers;
            this.maxProjects = maxProjects;
        }

        public String getDisplayName() {
            return displayName;
        }

        public int getMonthlyPrice() {
            return monthlyPrice;
        }

        public int getMaxUsers() {
            return maxUsers;
        }

        public int getMaxProjects() {
            return maxProjects;
        }
    }
}
