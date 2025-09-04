package com.turboagile.repository;

import com.turboagile.entity.Project;
import com.turboagile.entity.Organization;
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
 * Repository interface for Project entity
 * 
 * @author TurboAgile Team
 * @version 2.0.0
 */
@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {

    /**
     * Find project by key
     */
    Optional<Project> findByKey(String key);

    /**
     * Find projects by organization
     */
    List<Project> findByOrganization(Organization organization);

    /**
     * Find projects by organization with pagination
     */
    Page<Project> findByOrganization(Organization organization, Pageable pageable);

    /**
     * Find projects by status
     */
    List<Project> findByStatus(Project.ProjectStatus status);

    /**
     * Find projects by organization and status
     */
    List<Project> findByOrganizationAndStatus(Organization organization, Project.ProjectStatus status);

    /**
     * Find active projects by organization
     */
    @Query("SELECT p FROM Project p WHERE p.organization = :organization AND p.isActive = true")
    List<Project> findActiveProjectsByOrganization(@Param("organization") Organization organization);

    /**
     * Find projects by team size range
     */
    @Query("SELECT p FROM Project p WHERE p.teamSize BETWEEN :minSize AND :maxSize")
    List<Project> findByTeamSizeRange(@Param("minSize") int minSize, @Param("maxSize") int maxSize);

    /**
     * Find projects by progress percentage range
     */
    @Query("SELECT p FROM Project p WHERE p.progressPercentage BETWEEN :minProgress AND :maxProgress")
    List<Project> findByProgressRange(@Param("minProgress") int minProgress, @Param("maxProgress") int maxProgress);

    /**
     * Find projects by budget range
     */
    @Query("SELECT p FROM Project p WHERE p.budget BETWEEN :minBudget AND :maxBudget")
    List<Project> findByBudgetRange(@Param("minBudget") double minBudget, @Param("maxBudget") double maxBudget);

    /**
     * Find projects by start date range
     */
    @Query("SELECT p FROM Project p WHERE p.startDate BETWEEN :startDate AND :endDate")
    List<Project> findByStartDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    /**
     * Find projects by end date range
     */
    @Query("SELECT p FROM Project p WHERE p.endDate BETWEEN :startDate AND :endDate")
    List<Project> findByEndDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    /**
     * Find projects with overdue end dates
     */
    @Query("SELECT p FROM Project p WHERE p.endDate < :currentDate AND p.status != 'COMPLETED' AND p.status != 'CANCELLED'")
    List<Project> findOverdueProjects(@Param("currentDate") LocalDateTime currentDate);

    /**
     * Find projects by tag
     */
    @Query("SELECT p FROM Project p WHERE p.tags IS NOT NULL")
    List<Project> findAllWithTags();

    /**
     * Count projects by organization
     */
    long countByOrganization(Organization organization);

    /**
     * Count projects by status
     */
    long countByStatus(Project.ProjectStatus status);

    /**
     * Count projects by organization and status
     */
    long countByOrganizationAndStatus(Organization organization, Project.ProjectStatus status);

    /**
     * Check if project key exists
     */
    boolean existsByKey(String key);

    /**
     * Check if project key exists in organization
     */
    boolean existsByKeyAndOrganization(String key, Organization organization);

    /**
     * Find projects by name containing (case-insensitive)
     */
    @Query("SELECT p FROM Project p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Project> findByNameContainingIgnoreCase(@Param("name") String name);

    /**
     * Find projects by description containing (case-insensitive)
     */
    @Query("SELECT p FROM Project p WHERE LOWER(p.description) LIKE LOWER(CONCAT('%', :description, '%'))")
    List<Project> findByDescriptionContainingIgnoreCase(@Param("description") String description);

    /**
     * Find projects with high priority (high progress or critical status)
     */
    @Query("SELECT p FROM Project p WHERE p.progressPercentage > 80 OR p.status = 'ACTIVE' ORDER BY p.progressPercentage DESC")
    List<Project> findHighPriorityProjects();
}
