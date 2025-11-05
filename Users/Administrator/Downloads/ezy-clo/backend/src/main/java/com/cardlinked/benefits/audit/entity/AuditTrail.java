package com.cardlinked.benefits.audit.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "audit_trail", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_entity_type_id", columnList = "entity_type, entity_id"),
    @Index(name = "idx_timestamp", columnList = "timestamp"),
    @Index(name = "idx_action", columnList = "action"),
    @Index(name = "idx_audit_trail_timestamp_user", columnList = "timestamp, user_id")
})
public class AuditTrail {

    @Id
    @Column(name = "audit_id", length = 36)
    private String auditId;

    @NotBlank
    @Size(max = 100)
    @Column(name = "user_id", nullable = false, length = 100)
    private String userId;

    @NotBlank
    @Size(max = 100)
    @Column(name = "action", nullable = false, length = 100)
    private String action;

    @NotBlank
    @Size(max = 50)
    @Column(name = "entity_type", nullable = false, length = 50)
    private String entityType;

    @Size(max = 36)
    @Column(name = "entity_id", length = 36)
    private String entityId;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "old_values", columnDefinition = "JSON")
    private Map<String, Object> oldValues;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "new_values", columnDefinition = "JSON")
    private Map<String, Object> newValues;

    @Size(max = 45)
    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "user_agent", columnDefinition = "TEXT")
    private String userAgent;

    @Size(max = 255)
    @Column(name = "session_id")
    private String sessionId;

    @NotNull
    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;

    // Additional fields for enhanced auditing
    @Size(max = 100)
    @Column(name = "module", length = 100)
    private String module;

    @Enumerated(EnumType.STRING)
    @Column(name = "severity")
    private AuditSeverity severity = AuditSeverity.INFO;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Size(max = 100)
    @Column(name = "correlation_id", length = 100)
    private String correlationId;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "additional_data", columnDefinition = "JSON")
    private Map<String, Object> additionalData;

    // Constructors
    public AuditTrail() {
        this.timestamp = LocalDateTime.now();
    }

    public AuditTrail(String auditId, String userId, String action, String entityType) {
        this();
        this.auditId = auditId;
        this.userId = userId;
        this.action = action;
        this.entityType = entityType;
    }

    // Getters and Setters
    public String getAuditId() { return auditId; }
    public void setAuditId(String auditId) { this.auditId = auditId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }

    public String getEntityId() { return entityId; }
    public void setEntityId(String entityId) { this.entityId = entityId; }

    public Map<String, Object> getOldValues() { return oldValues; }
    public void setOldValues(Map<String, Object> oldValues) { this.oldValues = oldValues; }

    public Map<String, Object> getNewValues() { return newValues; }
    public void setNewValues(Map<String, Object> newValues) { this.newValues = newValues; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public String getModule() { return module; }
    public void setModule(String module) { this.module = module; }

    public AuditSeverity getSeverity() { return severity; }
    public void setSeverity(AuditSeverity severity) { this.severity = severity; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCorrelationId() { return correlationId; }
    public void setCorrelationId(String correlationId) { this.correlationId = correlationId; }

    public Map<String, Object> getAdditionalData() { return additionalData; }
    public void setAdditionalData(Map<String, Object> additionalData) { this.additionalData = additionalData; }

    // Helper methods
    public boolean isSecurityEvent() {
        return severity == AuditSeverity.CRITICAL || severity == AuditSeverity.HIGH;
    }

    public boolean isDataChange() {
        return oldValues != null || newValues != null;
    }

    // Enums
    public enum AuditSeverity {
        LOW, INFO, MEDIUM, HIGH, CRITICAL
    }

    // Static factory methods for common audit events
    public static AuditTrail createLoginEvent(String userId, String ipAddress, String sessionId) {
        AuditTrail audit = new AuditTrail();
        audit.setUserId(userId);
        audit.setAction("LOGIN");
        audit.setEntityType("USER_SESSION");
        audit.setIpAddress(ipAddress);
        audit.setSessionId(sessionId);
        audit.setSeverity(AuditSeverity.INFO);
        audit.setModule("AUTHENTICATION");
        return audit;
    }

    public static AuditTrail createLogoutEvent(String userId, String sessionId) {
        AuditTrail audit = new AuditTrail();
        audit.setUserId(userId);
        audit.setAction("LOGOUT");
        audit.setEntityType("USER_SESSION");
        audit.setSessionId(sessionId);
        audit.setSeverity(AuditSeverity.INFO);
        audit.setModule("AUTHENTICATION");
        return audit;
    }

    public static AuditTrail createDataChangeEvent(String userId, String action, String entityType, 
                                                  String entityId, Map<String, Object> oldValues, 
                                                  Map<String, Object> newValues) {
        AuditTrail audit = new AuditTrail();
        audit.setUserId(userId);
        audit.setAction(action);
        audit.setEntityType(entityType);
        audit.setEntityId(entityId);
        audit.setOldValues(oldValues);
        audit.setNewValues(newValues);
        audit.setSeverity(AuditSeverity.MEDIUM);
        return audit;
    }

    public static AuditTrail createSecurityEvent(String userId, String action, String description, 
                                               String ipAddress, AuditSeverity severity) {
        AuditTrail audit = new AuditTrail();
        audit.setUserId(userId);
        audit.setAction(action);
        audit.setEntityType("SECURITY_EVENT");
        audit.setDescription(description);
        audit.setIpAddress(ipAddress);
        audit.setSeverity(severity);
        audit.setModule("SECURITY");
        return audit;
    }
}