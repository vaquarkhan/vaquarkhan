package com.cardlinked.benefits.rules.repository;

import com.cardlinked.benefits.rules.entity.Rule;
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
public interface RuleRepository extends JpaRepository<Rule, String> {

    // Basic queries
    Optional<Rule> findByName(String name);
    
    List<Rule> findByRuleType(Rule.RuleType ruleType);
    
    List<Rule> findByStatus(Rule.RuleStatus status);

    // Rule type and status queries
    List<Rule> findByRuleTypeAndStatus(Rule.RuleType ruleType, Rule.RuleStatus status);
    
    List<Rule> findByRuleTypeAndStatusOrderByPriorityDesc(Rule.RuleType ruleType, Rule.RuleStatus status);

    // Category queries
    List<Rule> findByCategory(String category);
    
    List<Rule> findByCategoryAndStatus(String category, Rule.RuleStatus status);

    // Priority queries
    List<Rule> findByRuleTypeOrderByPriorityDesc(Rule.RuleType ruleType);
    
    @Query("SELECT r FROM Rule r WHERE r.ruleType = :ruleType AND r.status = :status AND r.priority >= :minPriority ORDER BY r.priority DESC")
    List<Rule> findHighPriorityRules(@Param("ruleType") Rule.RuleType ruleType, 
                                    @Param("status") Rule.RuleStatus status, 
                                    @Param("minPriority") Integer minPriority);

    // Version queries
    List<Rule> findByParentRuleIdOrderByVersionDesc(String parentRuleId);
    
    @Query("SELECT r FROM Rule r WHERE r.parentRuleId = :parentRuleId AND r.status = :status ORDER BY r.version DESC")
    List<Rule> findActiveVersions(@Param("parentRuleId") String parentRuleId, 
                                 @Param("status") Rule.RuleStatus status);

    // Search queries
    @Query("SELECT r FROM Rule r WHERE " +
           "LOWER(r.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(r.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(r.category) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Rule> searchRules(@Param("searchTerm") String searchTerm, Pageable pageable);

    // Analytics queries
    @Query("SELECT r.ruleType, COUNT(r) FROM Rule r WHERE r.status = :status GROUP BY r.ruleType")
    List<Object[]> countRulesByType(@Param("status") Rule.RuleStatus status);

    @Query("SELECT r.category, COUNT(r) FROM Rule r WHERE r.status = :status GROUP BY r.category")
    List<Object[]> countRulesByCategory(@Param("status") Rule.RuleStatus status);

    @Query("SELECT r.status, COUNT(r) FROM Rule r GROUP BY r.status")
    List<Object[]> countRulesByStatus();

    // Date-based queries
    List<Rule> findByCreatedDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT r FROM Rule r WHERE r.lastUpdated >= :since ORDER BY r.lastUpdated DESC")
    List<Rule> findRecentlyUpdatedRules(@Param("since") LocalDateTime since);

    // Conflict detection queries
    @Query("SELECT r FROM Rule r WHERE r.ruleType = :ruleType AND r.status = 'ACTIVE' AND r.priority = :priority")
    List<Rule> findRulesWithSamePriority(@Param("ruleType") Rule.RuleType ruleType, 
                                        @Param("priority") Integer priority);

    // Validation queries
    @Query("SELECT COUNT(r) > 0 FROM Rule r WHERE r.name = :name AND r.ruleId != :excludeRuleId")
    boolean existsByNameAndNotRuleId(@Param("name") String name, @Param("excludeRuleId") String excludeRuleId);

    // Performance queries
    @Query("SELECT r FROM Rule r WHERE r.status = 'ACTIVE' ORDER BY r.priority DESC, r.createdDate ASC")
    List<Rule> findActiveRulesOrderedByPriority();

    // Maintenance queries
    @Query("SELECT r FROM Rule r WHERE r.status = 'DRAFT' AND r.createdDate < :cutoffDate")
    List<Rule> findOldDraftRules(@Param("cutoffDate") LocalDateTime cutoffDate);
}