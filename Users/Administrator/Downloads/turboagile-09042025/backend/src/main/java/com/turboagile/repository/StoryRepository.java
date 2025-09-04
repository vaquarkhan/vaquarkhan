package com.turboagile.repository;

import com.turboagile.entity.Story;
import com.turboagile.entity.Project;
import com.turboagile.entity.Sprint;
import com.turboagile.enums.StoryStatus;
import com.turboagile.enums.StoryType;
import com.turboagile.enums.Priority;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for Story entity
 * 
 * @author TurboAgile Team
 * @version 2.0.0
 */
@Repository
public interface StoryRepository extends JpaRepository<Story, UUID> {

    /**
     * Find stories by project
     */
    List<Story> findByProject(Project project);

    /**
     * Find stories by project with pagination
     */
    Page<Story> findByProject(Project project, Pageable pageable);

    /**
     * Find stories by sprint
     */
    List<Story> findBySprint(Sprint sprint);

    /**
     * Find stories by status
     */
    List<Story> findByStatus(StoryStatus status);

    /**
     * Find stories by type
     */
    List<Story> findByType(StoryType type);

    /**
     * Find stories by priority
     */
    List<Story> findByPriority(Priority priority);

    /**
     * Find stories by assignee
     */
    List<Story> findByAssignee(String assignee);

    /**
     * Find stories by reporter
     */
    List<Story> findByReporter(String reporter);

    /**
     * Find stories by project and status
     */
    List<Story> findByProjectAndStatus(Project project, StoryStatus status);

    /**
     * Find stories by project and type
     */
    List<Story> findByProjectAndType(Project project, StoryType type);

    /**
     * Find stories by project and priority
     */
    List<Story> findByProjectAndPriority(Project project, Priority priority);

    /**
     * Find stories by project and assignee
     */
    List<Story> findByProjectAndAssignee(Project project, String assignee);

    /**
     * Find active stories by project
     */
    @Query("SELECT s FROM Story s WHERE s.project = :project AND s.status IN ('IN_PROGRESS', 'REVIEW', 'TESTING')")
    List<Story> findActiveStoriesByProject(@Param("project") Project project);

    /**
     * Find completed stories by project
     */
    @Query("SELECT s FROM Story s WHERE s.project = :project AND s.status = 'DONE'")
    List<Story> findCompletedStoriesByProject(@Param("project") Project project);

    /**
     * Find blocked stories by project
     */
    @Query("SELECT s FROM Story s WHERE s.project = :project AND s.status IN ('BLOCKED', 'ON_HOLD')")
    List<Story> findBlockedStoriesByProject(@Param("project") Project project);

    /**
     * Find overdue stories by project
     */
    @Query("SELECT s FROM Story s WHERE s.project = :project AND s.dueDate < :currentTime AND s.status != 'DONE'")
    List<Story> findOverdueStoriesByProject(@Param("project") Project project, @Param("currentTime") java.time.LocalDateTime currentTime);

    /**
     * Find stories by epic link
     */
    List<Story> findByEpicLink(String epicLink);

    /**
     * Find stories by label
     */
    @Query("SELECT s FROM Story s WHERE s.labels IS NOT NULL")
    List<Story> findAllWithLabels();

    /**
     * Find stories by story points range
     */
    @Query("SELECT s FROM Story s WHERE s.storyPoints BETWEEN :minPoints AND :maxPoints")
    List<Story> findByStoryPointsRange(@Param("minPoints") int minPoints, @Param("maxPoints") int maxPoints);

    /**
     * Find stories by due date range
     */
    @Query("SELECT s FROM Story s WHERE s.dueDate BETWEEN :startDate AND :endDate")
    List<Story> findByDueDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    /**
     * Find stories by completion date range
     */
    @Query("SELECT s FROM Story s WHERE s.completedAt BETWEEN :startDate AND :endDate")
    List<Story> findByCompletionDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    /**
     * Find stories by estimated hours range
     */
    @Query("SELECT s FROM Story s WHERE s.estimatedHours BETWEEN :minHours AND :maxHours")
    List<Story> findByEstimatedHoursRange(@Param("minHours") double minHours, @Param("maxHours") double maxHours);

    /**
     * Find stories by actual hours range
     */
    @Query("SELECT s FROM Story s WHERE s.actualHours BETWEEN :minHours AND :maxHours")
    List<Story> findByActualHoursRange(@Param("minHours") double minHours, @Param("maxHours") double maxHours);

    /**
     * Count stories by project
     */
    long countByProject(Project project);

    /**
     * Count stories by project and status
     */
    long countByProjectAndStatus(Project project, StoryStatus status);

    /**
     * Count stories by project and type
     */
    long countByProjectAndType(Project project, StoryType type);

    /**
     * Count stories by project and priority
     */
    long countByProjectAndPriority(Project project, Priority priority);

    /**
     * Count stories by sprint
     */
    long countBySprint(Sprint sprint);

    /**
     * Count completed stories by project
     */
    @Query("SELECT COUNT(s) FROM Story s WHERE s.project = :project AND s.status = 'DONE'")
    long countCompletedStoriesByProject(@Param("project") Project project);

    /**
     * Count active stories by project
     */
    @Query("SELECT COUNT(s) FROM Story s WHERE s.project = :project AND s.status IN ('IN_PROGRESS', 'REVIEW', 'TESTING')")
    long countActiveStoriesByProject(@Param("project") Project project);

    /**
     * Count blocked stories by project
     */
    @Query("SELECT COUNT(s) FROM Story s WHERE s.project = :project AND s.status IN ('BLOCKED', 'ON_HOLD')")
    long countBlockedStoriesByProject(@Param("project") Project project);

    /**
     * Find stories by title containing (case-insensitive)
     */
    @Query("SELECT s FROM Story s WHERE LOWER(s.title) LIKE LOWER(CONCAT('%', :title, '%'))")
    List<Story> findByTitleContainingIgnoreCase(@Param("title") String title);

    /**
     * Find stories by description containing (case-insensitive)
     */
    @Query("SELECT s FROM Story s WHERE LOWER(s.description) LIKE LOWER(CONCAT('%', :description, '%'))")
    List<Story> findByDescriptionContainingIgnoreCase(@Param("description") String description);

    /**
     * Find high priority stories by project
     */
    @Query("SELECT s FROM Story s WHERE s.project = :project AND s.priority IN ('HIGH', 'CRITICAL', 'URGENT') ORDER BY s.priority DESC")
    List<Story> findHighPriorityStoriesByProject(@Param("project") Project project);

    /**
     * Find stories without assignee by project
     */
    @Query("SELECT s FROM Story s WHERE s.project = :project AND s.assignee IS NULL")
    List<Story> findUnassignedStoriesByProject(@Param("project") Project project);
}
