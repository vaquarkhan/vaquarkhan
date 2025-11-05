package com.cardlinked.benefits.rules.entity;

import com.cardlinked.benefits.common.entity.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Map;

@Entity
@Table(name = "business_rules", indexes = {
    @Index(name = "idx_rule_name", columnList = "name", unique = true),
    @Index(name = "idx_rule_type", columnList = "rule_type"),
    @Index(name = "idx_rule_status", columnList = "status"),
    @Index(name = "idx_rule_priority", columnList = "priority")
})
public class Rule extends BaseEntity {

    @Id
    @Column(name = "rule_id", length = 36)
    private String ruleId;

    @NotBlank
    @Size(max = 100)
    @Column(name = "name", nullable = false, unique = true, length = 100)
    private String name;

    @Size(max = 255)
    @Column(name = "description")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "rule_type", nullable = false)
    private RuleType ruleType;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "conditions", columnDefinition = "JSON")
    private Map<String, Object> conditions;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "actions", columnDefinition = "JSON")
    private Map<String, Object> actions;

    @Column(name = "priority")
    private Integer priority = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private RuleStatus status = RuleStatus.DRAFT;

    @Size(max = 50)
    @Column(name = "category", length = 50)
    private String category;

    @Column(name = "version")
    private Integer version = 1;

    @Size(max = 36)
    @Column(name = "parent_rule_id", length = 36)
    private String parentRuleId;

    // Constructors
    public Rule() {
        super();
    }

    public Rule(String ruleId, String name, RuleType ruleType) {
        this();
        this.ruleId = ruleId;
        this.name = name;
        this.ruleType = ruleType;
    }

    // Getters and Setters
    public String getRuleId() { return ruleId; }
    public void setRuleId(String ruleId) { this.ruleId = ruleId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public RuleType getRuleType() { return ruleType; }
    public void setRuleType(RuleType ruleType) { this.ruleType = ruleType; }

    public Map<String, Object> getConditions() { return conditions; }
    public void setConditions(Map<String, Object> conditions) { this.conditions = conditions; }

    public Map<String, Object> getActions() { return actions; }
    public void setActions(Map<String, Object> actions) { this.actions = actions; }

    public Integer getPriority() { return priority; }
    public void setPriority(Integer priority) { this.priority = priority; }

    public RuleStatus getStatus() { return status; }
    public void setStatus(RuleStatus status) { this.status = status; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }

    public String getParentRuleId() { return parentRuleId; }
    public void setParentRuleId(String parentRuleId) { this.parentRuleId = parentRuleId; }

    // Helper methods
    public boolean isActive() {
        return status == RuleStatus.ACTIVE;
    }

    public boolean isEligibilityRule() {
        return ruleType == RuleType.ELIGIBILITY;
    }

    public boolean isCalculationRule() {
        return ruleType == RuleType.CALCULATION;
    }

    // Enums
    public enum RuleType {
        ELIGIBILITY,    // Rules for determining offer eligibility
        CALCULATION,    // Rules for calculating discounts/cashback
        VALIDATION,     // Rules for validating transactions
        NOTIFICATION,   // Rules for triggering notifications
        WORKFLOW       // Rules for approval workflows
    }

    public enum RuleStatus {
        DRAFT,
        ACTIVE,
        INACTIVE,
        ARCHIVED
    }
}