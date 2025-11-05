package com.cardlinked.benefits.admin.repository;

import com.cardlinked.benefits.admin.entity.ApprovalWorkflow;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ApprovalWorkflowRepository extends JpaRepository<ApprovalWorkflow, String> {

    // Entity-based queries
    List<ApprovalWorkflow> findByEntityTypeAndEntityIdOrderByCreatedDateDesc(ApprovalWorkflow.EntityType entityType, 
                                                                            String entityId);
    
    Optional<ApprovalWorkflow> findByEntityTypeAndEntityIdAndStatus(ApprovalWorkflow.EntityType entityType, 
                                                                   String entityId, 
                                                                   ApprovalWorkflow.WorkflowStatus status);

    // Status-based queries
    List<ApprovalWorkflow> findByStatusOrderByCreatedDateDesc(ApprovalWorkflow.WorkflowStatus status);
    
    Page<ApprovalWorkflow> findByStatus(ApprovalWorkflow.WorkflowStatus status, Pageable pageable);
    
    long countByStatus(ApprovalWorkflow.WorkflowStatus status);

    // User role queries
    List<ApprovalWorkflow> findByMakerIdOrderByCreatedDateDesc(String makerId);
    
    List<ApprovalWorkflow> findByCheckerIdOrderByCreatedDateDesc(String checkerId);
    
    List<ApprovalWorkflow> findByApproverIdOrderByCreatedDateDesc(String approverId);

    // Pending work queries
    @Query("SELECT w FROM ApprovalWorkflow w WHERE w.status = 'PENDING_CHECKER' ORDER BY w.createdDate ASC")
    List<ApprovalWorkflow> findPendingCheckerWork();
    
    @Query("SELECT w FROM ApprovalWorkflow w WHERE w.status = 'PENDING_APPROVER' ORDER BY w.createdDate ASC")
    List<ApprovalWorkflow> findPendingApproverWork();

    // Priority-based queries
    List<ApprovalWorkflow> findByPriorityAndStatusOrderByCreatedDateDesc(ApprovalWorkflow.Priority priority, 
                                                                        ApprovalWorkflow.WorkflowStatus status);
    
    @Query("SELECT w FROM ApprovalWorkflow w WHERE w.priority IN ('HIGH', 'URGENT') " +
           "AND w.status IN ('PENDING_CHECKER', 'PENDING_APPROVER') ORDER BY w.priority DESC, w.createdDate ASC")
    List<ApprovalWorkflow> findHighPriorityPendingWork();

    // Due date queries
    @Query("SELECT w FROM ApprovalWorkflow w WHERE w.dueDate < :now " +
           "AND w.status IN ('PENDING_CHECKER', 'PENDING_APPROVER')")
    List<ApprovalWorkflow> findOverdueWorkflows(@Param("now") LocalDateTime now);
    
    @Query("SELECT w FROM ApprovalWorkflow w WHERE w.dueDate BETWEEN :startDate AND :endDate " +
           "AND w.status IN ('PENDING_CHECKER', 'PENDING_APPROVER')")
    List<ApprovalWorkflow> findWorkflowsDueSoon(@Param("startDate") LocalDateTime startDate, 
                                               @Param("endDate") LocalDateTime endDate);

    // Department-based queries
    List<ApprovalWorkflow> findByDepartmentAndStatusOrderByCreatedDateDesc(String department, 
                                                                          ApprovalWorkflow.WorkflowStatus status);

    // Action type queries
    List<ApprovalWorkflow> findByActionTypeAndStatusOrderByCreatedDateDesc(ApprovalWorkflow.ActionType actionType, 
                                                                          ApprovalWorkflow.WorkflowStatus status);

    // Analytics queries
    @Query("SELECT w.status, COUNT(w) FROM ApprovalWorkflow w GROUP BY w.status")
    List<Object[]> getWorkflowStatusStatistics();

    @Query("SELECT w.entityType, COUNT(w) FROM ApprovalWorkflow w " +
           "WHERE w.createdDate BETWEEN :startDate AND :endDate GROUP BY w.entityType")
    List<Object[]> getWorkflowsByEntityType(@Param("startDate") LocalDateTime startDate, 
                                           @Param("endDate") LocalDateTime endDate);

    @Query("SELECT w.makerId, COUNT(w) FROM ApprovalWorkflow w " +
           "WHERE w.createdDate BETWEEN :startDate AND :endDate GROUP BY w.makerId " +
           "ORDER BY COUNT(w) DESC")
    List<Object[]> getMostActiveMakers(@Param("startDate") LocalDateTime startDate, 
                                      @Param("endDate") LocalDateTime endDate);

    @Query("SELECT AVG(TIMESTAMPDIFF(HOUR, w.createdDate, w.approverDate)) FROM ApprovalWorkflow w " +
           "WHERE w.status = 'APPROVED' AND w.approverDate IS NOT NULL")
    Double getAverageApprovalTime();

    // Performance queries
    @Query("SELECT w FROM ApprovalWorkflow w WHERE w.status = 'APPROVED' " +
           "AND TIMESTAMPDIFF(HOUR, w.createdDate, w.approverDate) <= :hours")
    List<ApprovalWorkflow> findFastApprovals(@Param("hours") int hours);

    @Query("SELECT w FROM ApprovalWorkflow w WHERE w.status IN ('PENDING_CHECKER', 'PENDING_APPROVER') " +
           "AND TIMESTAMPDIFF(DAY, w.createdDate, CURRENT_TIMESTAMP) > :days")
    List<ApprovalWorkflow> findLongPendingWorkflows(@Param("days") int days);

    // Escalation queries
    List<ApprovalWorkflow> findByEscalationLevelGreaterThanOrderByCreatedDateDesc(Integer escalationLevel);
    
    @Query("SELECT w FROM ApprovalWorkflow w WHERE w.escalationLevel > 0 " +
           "AND w.status IN ('PENDING_CHECKER', 'PENDING_APPROVER')")
    List<ApprovalWorkflow> findEscalatedWorkflows();

    // Auto-approval queries
    @Query("SELECT w FROM ApprovalWorkflow w WHERE w.autoApproveEligible = true " +
           "AND w.status = 'PENDING_CHECKER'")
    List<ApprovalWorkflow> findAutoApprovalCandidates();

    // Date range queries
    List<ApprovalWorkflow> findByCreatedDateBetweenOrderByCreatedDateDesc(LocalDateTime startDate, 
                                                                         LocalDateTime endDate);

    // Search functionality
    @Query("SELECT w FROM ApprovalWorkflow w WHERE " +
           "w.makerId LIKE CONCAT('%', :searchTerm, '%') OR " +
           "w.checkerComments LIKE CONCAT('%', :searchTerm, '%') OR " +
           "w.approverComments LIKE CONCAT('%', :searchTerm, '%') OR " +
           "w.rejectionReason LIKE CONCAT('%', :searchTerm, '%')")
    Page<ApprovalWorkflow> searchWorkflows(@Param("searchTerm") String searchTerm, Pageable pageable);

    // Compliance queries
    @Query("SELECT COUNT(w) FROM ApprovalWorkflow w WHERE w.createdDate >= :startDate AND w.createdDate < :endDate")
    long countWorkflowsInPeriod(@Param("startDate") LocalDateTime startDate, 
                               @Param("endDate") LocalDateTime endDate);
}