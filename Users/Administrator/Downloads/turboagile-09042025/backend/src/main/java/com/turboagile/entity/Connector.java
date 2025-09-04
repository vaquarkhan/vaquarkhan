package com.turboagile.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Connector Entity
 * Represents external system integrations and connectors
 * 
 * @author TurboAgile Team
 * @version 2.0.0
 */
@Entity
@Table(name = "connectors", schema = "turboagile")
public class Connector extends BaseEntity {

    @NotBlank(message = "Connector name is required")
    @Size(min = 3, max = 100, message = "Connector name must be between 3 and 100 characters")
    @Column(name = "name", nullable = false)
    private String name;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private ConnectorType type;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ConnectorStatus status = ConnectorStatus.INACTIVE;

    @Column(name = "endpoint_url")
    private String endpointUrl;

    @Column(name = "api_key")
    private String apiKey;

    @Column(name = "api_secret")
    private String apiSecret;

    @Column(name = "access_token")
    private String accessToken;

    @Column(name = "refresh_token")
    private String refreshToken;

    @Column(name = "token_expires_at")
    private LocalDateTime tokenExpiresAt;

    @Column(name = "webhook_url")
    private String webhookUrl;

    @Column(name = "webhook_secret")
    private String webhookSecret;

    @Column(name = "rate_limit")
    private Integer rateLimit; // requests per minute

    @Column(name = "last_sync")
    private LocalDateTime lastSync;

    @Column(name = "sync_interval_minutes")
    private Integer syncIntervalMinutes = 60;

    @Column(name = "config", columnDefinition = "JSONB")
    private String config; // JSON configuration

    @Column(name = "metadata", columnDefinition = "JSONB")
    private String metadata; // Additional metadata

    @Column(name = "health_check_url")
    private String healthCheckUrl;

    @Column(name = "last_health_check")
    private LocalDateTime lastHealthCheck;

    @Column(name = "health_status")
    private String healthStatus = "UNKNOWN";

    @Column(name = "error_count")
    private Integer errorCount = 0;

    @Column(name = "last_error")
    private String lastError;

    @Column(name = "last_error_at")
    private LocalDateTime lastErrorAt;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    // Constructors
    public Connector() {}

    public Connector(String name, String description, ConnectorType type, Organization organization) {
        this.name = name;
        this.description = description;
        this.type = type;
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

    public ConnectorType getType() {
        return type;
    }

    public void setType(ConnectorType type) {
        this.type = type;
    }

    public ConnectorStatus getStatus() {
        return status;
    }

    public void setStatus(ConnectorStatus status) {
        this.status = status;
    }

    public String getEndpointUrl() {
        return endpointUrl;
    }

    public void setEndpointUrl(String endpointUrl) {
        this.endpointUrl = endpointUrl;
    }

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    public String getApiSecret() {
        return apiSecret;
    }

    public void setApiSecret(String apiSecret) {
        this.apiSecret = apiSecret;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public LocalDateTime getTokenExpiresAt() {
        return tokenExpiresAt;
    }

    public void setTokenExpiresAt(LocalDateTime tokenExpiresAt) {
        this.tokenExpiresAt = tokenExpiresAt;
    }

    public String getWebhookUrl() {
        return webhookUrl;
    }

    public void setWebhookUrl(String webhookUrl) {
        this.webhookUrl = webhookUrl;
    }

    public String getWebhookSecret() {
        return webhookSecret;
    }

    public void setWebhookSecret(String webhookSecret) {
        this.webhookSecret = webhookSecret;
    }

    public Integer getRateLimit() {
        return rateLimit;
    }

    public void setRateLimit(Integer rateLimit) {
        this.rateLimit = rateLimit;
    }

    public LocalDateTime getLastSync() {
        return lastSync;
    }

    public void setLastSync(LocalDateTime lastSync) {
        this.lastSync = lastSync;
    }

    public Integer getSyncIntervalMinutes() {
        return syncIntervalMinutes;
    }

    public void setSyncIntervalMinutes(Integer syncIntervalMinutes) {
        this.syncIntervalMinutes = syncIntervalMinutes;
    }

    public String getConfig() {
        return config;
    }

    public void setConfig(String config) {
        this.config = config;
    }

    public String getMetadata() {
        return metadata;
    }

    public void setMetadata(String metadata) {
        this.metadata = metadata;
    }

    public String getHealthCheckUrl() {
        return healthCheckUrl;
    }

    public void setHealthCheckUrl(String healthCheckUrl) {
        this.healthCheckUrl = healthCheckUrl;
    }

    public LocalDateTime getLastHealthCheck() {
        return lastHealthCheck;
    }

    public void setLastHealthCheck(LocalDateTime lastHealthCheck) {
        this.lastHealthCheck = lastHealthCheck;
    }

    public String getHealthStatus() {
        return healthStatus;
    }

    public void setHealthStatus(String healthStatus) {
        this.healthStatus = healthStatus;
    }

    public Integer getErrorCount() {
        return errorCount;
    }

    public void setErrorCount(Integer errorCount) {
        this.errorCount = errorCount;
    }

    public String getLastError() {
        return lastError;
    }

    public void setLastError(String lastError) {
        this.lastError = lastError;
    }

    public LocalDateTime getLastErrorAt() {
        return lastErrorAt;
    }

    public void setLastErrorAt(LocalDateTime lastErrorAt) {
        this.lastErrorAt = lastErrorAt;
    }

    // Relationship getters and setters
    public Organization getOrganization() {
        return organization;
    }

    public void setOrganization(Organization organization) {
        this.organization = organization;
    }

    // Business methods
    public boolean isActive() {
        return status == ConnectorStatus.ACTIVE;
    }

    public boolean isInactive() {
        return status == ConnectorStatus.INACTIVE;
    }

    public boolean isError() {
        return status == ConnectorStatus.ERROR;
    }

    public boolean isMaintenance() {
        return status == ConnectorStatus.MAINTENANCE;
    }

    public boolean isTokenExpired() {
        return tokenExpiresAt != null && tokenExpiresAt.isBefore(LocalDateTime.now());
    }

    public boolean needsSync() {
        if (lastSync == null) {
            return true;
        }
        return LocalDateTime.now().isAfter(lastSync.plusMinutes(syncIntervalMinutes));
    }

    public boolean isHealthy() {
        return "HEALTHY".equals(healthStatus);
    }

    public boolean isUnhealthy() {
        return "UNHEALTHY".equals(healthStatus);
    }

    public void activate() {
        this.status = ConnectorStatus.ACTIVE;
    }

    public void deactivate() {
        this.status = ConnectorStatus.INACTIVE;
    }

    public void markAsError(String error) {
        this.status = ConnectorStatus.ERROR;
        this.lastError = error;
        this.lastErrorAt = LocalDateTime.now();
        this.errorCount++;
    }

    public void markAsHealthy() {
        this.healthStatus = "HEALTHY";
        this.lastHealthCheck = LocalDateTime.now();
    }

    public void markAsUnhealthy(String reason) {
        this.healthStatus = "UNHEALTHY";
        this.lastHealthCheck = LocalDateTime.now();
        this.lastError = reason;
    }

    public void recordSync() {
        this.lastSync = LocalDateTime.now();
        this.errorCount = 0;
        this.lastError = null;
        this.lastErrorAt = null;
    }

    public void refreshToken(String newAccessToken, String newRefreshToken, LocalDateTime expiresAt) {
        this.accessToken = newAccessToken;
        this.refreshToken = newRefreshToken;
        this.tokenExpiresAt = expiresAt;
    }

    @Override
    public String toString() {
        return "Connector{" +
                "id=" + getId() +
                ", name='" + name + '\'' +
                ", type=" + type +
                ", status=" + status +
                ", healthStatus='" + healthStatus + '\'' +
                ", isActive=" + isActive() +
                '}';
    }

    // Connector Type Enum
    public enum ConnectorType {
        GITHUB("GitHub", "Git repository hosting service"),
        GITLAB("GitLab", "Git repository hosting service"),
        JIRA("Jira", "Project management and issue tracking"),
        SLACK("Slack", "Team communication platform"),
        TEAMS("Microsoft Teams", "Team collaboration platform"),
        EMAIL("Email", "Email integration"),
        WEBHOOK("Webhook", "Generic webhook integration"),
        API("API", "Generic API integration"),
        DATABASE("Database", "Database connection"),
        FILE_SYSTEM("File System", "Local or network file system"),
        CLOUD_STORAGE("Cloud Storage", "Cloud storage services"),
        CI_CD("CI/CD", "Continuous integration/deployment"),
        MONITORING("Monitoring", "System monitoring tools"),
        LOGGING("Logging", "Log aggregation services"),
        CUSTOM("Custom", "Custom connector type");

        private final String displayName;
        private final String description;

        ConnectorType(String displayName, String description) {
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

    // Connector Status Enum
    public enum ConnectorStatus {
        ACTIVE("Active", "Connector is active and working"),
        INACTIVE("Inactive", "Connector is inactive"),
        ERROR("Error", "Connector has encountered an error"),
        MAINTENANCE("Maintenance", "Connector is under maintenance"),
        CONFIGURING("Configuring", "Connector is being configured"),
        TESTING("Testing", "Connector is being tested");

        private final String displayName;
        private final String description;

        ConnectorStatus(String displayName, String description) {
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
