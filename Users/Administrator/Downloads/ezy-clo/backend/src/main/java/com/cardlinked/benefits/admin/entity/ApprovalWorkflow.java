package com.cardlinked.benefits.admin.entity;

import com.cardlinked.benefits.common.entity.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

@Entity
@Table(name = "approval_workflow", indexes = {
    @Index(name = "idx_entity_type_id", columnList = "entity_type, entity_id"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_maker_id", columnList = "maker_id")
})
public class ApprovalWorkflow extends BaseEntity {

    @Id
    @Column(name = "workflow_id", length = 36)
    private String workflowId;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "entity_type", nullable = false)
    private EntityType entityType;

    @NotBlank
    @Size(max = 36)
    @Column(name = "entity_id", nullable = false, length = 36)
    private String entityId;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "action_type", nullable = false)
    private ActionType actionType;

    @NotBlank
    @Size(max = 100)
    @Column(name = "maker_id", nullable = false, length = 100)
    private String makerId;

    @Size(max = 100)
    @Column(name = "checker_id", length = 100)
    private String checkerId;

    @Size(max = 100)
    @Column(name = "approver_id", length = 100)
    private String approverId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private WorkflowStatus status = WorkflowStatus.PENDING_CHECKER;

    @Column(name = "maker_comments", columnDefinition = "TEXT")
    private String makerComments;

    @Column(name = "checker_comments", columnDefinition = "TEXT")
    private String checkerComments;

    @Column(name = "approver_comments", columnDefinition = "TEXT")
    private String approverComments;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "checker_date")
    private LocalDateTime checkerDate;

    @Column(name = "approver_date")
    private LocalDateTime approverDate;

    // Additional fields for enhanced workflow management
    @Column(name = "priority")
    @Enumerated(EnumType.STRING)
    private Priority priority = Priority.NORMAL;

    @Column(name = "due_date")
    private LocalDateTime dueDate;

    @Size(max = 100)
    @Column(name = "department", length = 100)
    private String department;

    @Column(name = "auto_approve_eligible")
    private Boolean autoApproveEligible = false;

    @Column(name = "escalation_level")
    private Integer escalationLevel = 0;

    // Constructors
    public ApprovalWorkflow() {
        super();
    }

    public ApprovalWorkflow(String workflowId, EntityType entityType, String entityId, 
                           ActionType actionType, String makerId) {
        this();
        this.workflowId = workflowId;
        this.entityType = entityType;
        this.entityId = entityId;
        this.actionType = actionType;
        this.makerId = makerId;
    }

    // Getters and Setters
    public String getWorkflowId() { return workflowId; }
    public void setWorkflowId(String workflowId) { this.workflowId = workflowId; }

    public EntityType getEntityType() { return entityType; }
    public void setEntityType(EntityType entityType) { this.entityType = entityType; }

    public String getEntityId() { return entityId; }
    public void setEntityId(String entityId) { this.entityId = entityId; }

    public ActionType getActionType() { return actionType; }
    public void setActionType(ActionType actionType) { this.actionType = actionType; }

    public String getMakerId() { return makerId; }
    public void setMakerId(String makerId) { this.makerId = makerId; }

    public String getCheckerId() { return checkerId; }
    public void setCheckerId(String checkerId) { this.checkerId = checkerId; }

    public String getApproverId() { return approverId; }
    public void setApproverId(String approverId) { this.approverId = approverId; }

    public WorkflowStatus getStatus() { return status; }
    public void setStatus(WorkflowStatus status) { this.status = status; }

    public String getMakerComments() { return makerComments; }
    public void setMakerComments(String makerComments) { this.makerComments = makerComments; }

    public String getCheckerComments() { return checkerComments; }
    public void setCheckerComments(String checkerComments) { this.checkerComments = checkerComments; }

    public String getApproverComments() { return approverComments; }
    public void setApproverComments(String approverComments) { this.approverComments = approverComments; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public LocalDateTime getCheckerDate() { return checkerDate; }
    public void setCheckerDate(LocalDateTime checkerDate) { this.checkerDate = checkerDate; }

    public LocalDateTime getApproverDate() { return approverDate; }
    public void setApproverDate(LocalDateTime approverDate) { this.approverDate = approverDate; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public LocalDateTime getDueDate() { return dueDate; }
    public void setDueDate(LocalDateTime dueDate) { this.dueDate = dueDate; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Boolean getAutoApproveEligible() { return autoApproveEligible; }
    public void setAutoApproveEligible(Boolean autoApproveEligible) { this.autoApproveEligible = autoApproveEligible; }

    public Integer getEscalationLevel() { return escalationLevel; }
    public void setEscalationLevel(Integer escalationLevel) { this.escalationLevel = escalationLevel; }

    // Helper methods
    public boolean isPendingChecker() {
        return status == WorkflowStatus.PENDING_CHECKER;
    }

    public boolean isPendingApprover() {
        return status == WorkflowStatus.PENDING_APPROVER;
    }

    public boolean isCompleted() {
        return status == WorkflowStatus.APPROVED || status == WorkflowStatus.REJECTED;
    }

    public boolean isOverdue() {
        return dueDate != null && LocalDateTime.now().isAfter(dueDate) && !isCompleted();
    }

    public long getDaysInWorkflow() {
        return java.time.Duration.between(getCreatedDate(), LocalDateTime.now()).toDays();
    }

    public void moveToChecker(String checkerId, String comments) {
        this.checkerId = checkerId;
        this.checkerComments = comments;
        this.checkerDate = LocalDateTime.now();
        this.status = WorkflowStatus.PENDING_APPROVER;
    }

    public void approve(String approverId, String comments) {
        this.approverId = approverId;
        this.approverComments = comments;
        this.approverDate = LocalDateTime.now();
        this.status = WorkflowStatus.APPROVED;
    }

    public void reject(String rejectorId, String reason) {
        if (status == WorkflowStatus.PENDING_CHECKER) {
            this.checkerId = rejectorId;
            this.checkerDate = LocalDateTime.now();
        } else if (status == WorkflowStatus.PENDING_APPROVER) {
            this.approverId = rejectorId;
            this.approverDate = LocalDateTime.now();
        }
        this.rejectionReason = reason;
        this.status = WorkflowStatus.REJECTED;
    }

    // Enums
    public enum EntityType {
        OFFER, BANK_PARTNER, SSO_CONFIG, RULE, CUSTOMER, TRANSACTION
    }

    public enum ActionType {
        CREATE, UPDATE, DELETE, ACTIVATE, DEACTIVATE
    }

    public enum WorkflowStatus {
        PENDING_CHECKER, PENDING_APPROVER, APPROVED, REJECTED
    }

    public enum Priority {
        LOW, NORMAL, HIGH, URGENT
    }
}