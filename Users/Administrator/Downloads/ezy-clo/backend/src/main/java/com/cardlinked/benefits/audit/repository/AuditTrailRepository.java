package com.cardlinked.benefits.audit.repository;

import com.cardlinked.benefits.audit.entity.AuditTrail;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditTrailRepository extends JpaRepository<AuditTrail, String> {

    // User-based queries
    List<AuditTrail> findByUserIdOrderByTimestampDesc(String userId);
    
    Page<AuditTrail> findByUserId(String userId, Pageable pageable);
    
    @Query("SELECT a FROM AuditTrail a WHERE a.userId = :userId AND a.timestamp BETWEEN :startDate AND :endDate")
    List<AuditTrail> findByUserIdAndTimestampBetween(@Param("userId") String userId, 
                                                    @Param("startDate") LocalDateTime startDate, 
                                                    @Param("endDate") LocalDateTime endDate);

    // Action-based queries
    List<AuditTrail> findByActionOrderByTimestampDesc(String action);
    
    List<AuditTrail> findByActionAndTimestampBetween(String action, LocalDateTime startDate, LocalDateTime endDate);

    // Entity-based queries
    List<AuditTrail> findByEntityTypeAndEntityIdOrderByTimestampDesc(String entityType, String entityId);
    
    List<AuditTrail> findByEntityTypeOrderByTimestampDesc(String entityType);

    // Date-based queries
    List<AuditTrail> findByTimestampBetweenOrderByTimestampDesc(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT a FROM AuditTrail a WHERE DATE(a.timestamp) = CURRENT_DATE ORDER BY a.timestamp DESC")
    List<AuditTrail> findTodaysAuditTrail();

    // Severity-based queries
    List<AuditTrail> findBySeverityOrderByTimestampDesc(AuditTrail.AuditSeverity severity);
    
    @Query("SELECT a FROM AuditTrail a WHERE a.severity IN ('HIGH', 'CRITICAL') ORDER BY a.timestamp DESC")
    List<AuditTrail> findSecurityEvents();

    // Module-based queries
    List<AuditTrail> findByModuleOrderByTimestampDesc(String module);
    
    List<AuditTrail> findByModuleAndTimestampBetween(String module, LocalDateTime startDate, LocalDateTime endDate);

    // IP address queries
    List<AuditTrail> findByIpAddressOrderByTimestampDesc(String ipAddress);
    
    @Query("SELECT a.ipAddress, COUNT(a) FROM AuditTrail a WHERE a.timestamp BETWEEN :startDate AND :endDate " +
           "GROUP BY a.ipAddress ORDER BY COUNT(a) DESC")
    List<Object[]> getTopIpAddresses(@Param("startDate") LocalDateTime startDate, 
                                    @Param("endDate") LocalDateTime endDate);

    // Session-based queries
    List<AuditTrail> findBySessionIdOrderByTimestampDesc(String sessionId);

    // Analytics queries
    @Query("SELECT a.action, COUNT(a) FROM AuditTrail a WHERE a.timestamp BETWEEN :startDate AND :endDate " +
           "GROUP BY a.action ORDER BY COUNT(a) DESC")
    List<Object[]> getActionStatistics(@Param("startDate") LocalDateTime startDate, 
                                      @Param("endDate") LocalDateTime endDate);

    @Query("SELECT a.userId, COUNT(a) FROM AuditTrail a WHERE a.timestamp BETWEEN :startDate AND :endDate " +
           "GROUP BY a.userId ORDER BY COUNT(a) DESC")
    List<Object[]> getMostActiveUsers(@Param("startDate") LocalDateTime startDate, 
                                     @Param("endDate") LocalDateTime endDate);

    @Query("SELECT a.entityType, COUNT(a) FROM AuditTrail a WHERE a.timestamp BETWEEN :startDate AND :endDate " +
           "GROUP BY a.entityType ORDER BY COUNT(a) DESC")
    List<Object[]> getEntityTypeStatistics(@Param("startDate") LocalDateTime startDate, 
                                          @Param("endDate") LocalDateTime endDate);

    @Query("SELECT DATE(a.timestamp), COUNT(a) FROM AuditTrail a " +
           "WHERE a.timestamp BETWEEN :startDate AND :endDate " +
           "GROUP BY DATE(a.timestamp) ORDER BY DATE(a.timestamp)")
    List<Object[]> getDailyAuditActivity(@Param("startDate") LocalDateTime startDate, 
                                        @Param("endDate") LocalDateTime endDate);

    // Security monitoring queries
    @Query("SELECT a FROM AuditTrail a WHERE a.action IN ('LOGIN_FAILED', 'UNAUTHORIZED_ACCESS', 'PERMISSION_DENIED') " +
           "AND a.timestamp >= :since ORDER BY a.timestamp DESC")
    List<AuditTrail> findSecurityIncidents(@Param("since") LocalDateTime since);

    @Query("SELECT a FROM AuditTrail a WHERE a.userId = :userId AND a.action = 'LOGIN_FAILED' " +
           "AND a.timestamp >= :since")
    List<AuditTrail> findFailedLoginAttempts(@Param("userId") String userId, 
                                           @Param("since") LocalDateTime since);

    // Data change tracking
    @Query("SELECT a FROM AuditTrail a WHERE a.oldValues IS NOT NULL OR a.newValues IS NOT NULL " +
           "ORDER BY a.timestamp DESC")
    List<AuditTrail> findDataChangeEvents(Pageable pageable);

    @Query("SELECT a FROM AuditTrail a WHERE a.entityType = :entityType AND a.entityId = :entityId " +
           "AND (a.oldValues IS NOT NULL OR a.newValues IS NOT NULL) ORDER BY a.timestamp DESC")
    List<AuditTrail> findEntityChangeHistory(@Param("entityType") String entityType, 
                                           @Param("entityId") String entityId);

    // Compliance queries
    @Query("SELECT COUNT(a) FROM AuditTrail a WHERE a.timestamp >= :startDate AND a.timestamp < :endDate")
    long countAuditEventsInPeriod(@Param("startDate") LocalDateTime startDate, 
                                 @Param("endDate") LocalDateTime endDate);

    @Query("SELECT a FROM AuditTrail a WHERE a.timestamp < :cutoffDate")
    List<AuditTrail> findAuditTrailForArchival(@Param("cutoffDate") LocalDateTime cutoffDate);

    // Search functionality
    @Query("SELECT a FROM AuditTrail a WHERE " +
           "a.userId LIKE CONCAT('%', :searchTerm, '%') OR " +
           "a.action LIKE CONCAT('%', :searchTerm, '%') OR " +
           "a.entityType LIKE CONCAT('%', :searchTerm, '%') OR " +
           "a.description LIKE CONCAT('%', :searchTerm, '%')")
    Page<AuditTrail> searchAuditTrail(@Param("searchTerm") String searchTerm, Pageable pageable);

    // Correlation queries
    List<AuditTrail> findByCorrelationIdOrderByTimestampDesc(String correlationId);
}