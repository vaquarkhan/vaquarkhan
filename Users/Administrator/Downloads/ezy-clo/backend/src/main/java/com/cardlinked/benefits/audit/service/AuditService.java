package com.cardlinked.benefits.audit.service;

import com.cardlinked.benefits.audit.entity.AuditTrail;
import com.cardlinked.benefits.audit.repository.AuditTrailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.UUID;

@Service
@Transactional
public class AuditService {

    private final AuditTrailRepository auditTrailRepository;

    @Autowired
    public AuditService(AuditTrailRepository auditTrailRepository) {
        this.auditTrailRepository = auditTrailRepository;
    }

    /**
     * Log a general audit event
     */
    public void logEvent(String userId, String action, String entityType, String entityId, 
                        Map<String, Object> oldValues, Map<String, Object> newValues) {
        AuditTrail auditTrail = new AuditTrail();
        auditTrail.setAuditId(UUID.randomUUID().toString());
        auditTrail.setUserId(userId);
        auditTrail.setAction(action);
        auditTrail.setEntityType(entityType);
        auditTrail.setEntityId(entityId);
        auditTrail.setOldValues(oldValues);
        auditTrail.setNewValues(newValues);
        auditTrail.setSeverity(AuditTrail.AuditSeverity.INFO);
        
        auditTrailRepository.save(auditTrail);
    }

    /**
     * Log a security event
     */
    public void logSecurityEvent(String userId, String action, String description, 
                               String ipAddress, AuditTrail.AuditSeverity severity) {
        AuditTrail auditTrail = new AuditTrail();
        auditTrail.setAuditId(UUID.randomUUID().toString());
        auditTrail.setUserId(userId);
        auditTrail.setAction(action);
        auditTrail.setEntityType("SECURITY_EVENT");
        auditTrail.setDescription(description);
        auditTrail.setIpAddress(ipAddress);
        auditTrail.setSeverity(severity);
        auditTrail.setModule("SECURITY");
        
        auditTrailRepository.save(auditTrail);
    }
}