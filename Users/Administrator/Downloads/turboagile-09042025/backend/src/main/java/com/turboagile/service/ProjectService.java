package com.turboagile.service;

import com.turboagile.entity.Project;
import com.turboagile.entity.Organization;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Service interface for Project operations
 * 
 * @author TurboAgile Team
 * @version 2.0.0
 */
public interface ProjectService {

    /**
     * Creates a new project
     * 
     * @param project the project to create
     * @return the created project
     */
    Project createProject(Project project);

    /**
     * Finds a project by its ID
     * 
     * @param id the project ID
     * @return optional containing the project if found
     */
    Optional<Project> findById(UUID id);

    /**
     * Finds a project by its key
     * 
     * @param key the project key
     * @return optional containing the project if found
     */
    Optional<Project> findByKey(String key);

    /**
     * Finds projects by organization with pagination
     * 
     * @param organization the organization
     * @param pageable pagination parameters
     * @return page of projects
     */
    Page<Project> findByOrganization(Organization organization, Pageable pageable);

    /**
     * Finds all projects by organization
     * 
     * @param organization the organization
     * @return list of projects
     */
    List<Project> findByOrganization(Organization organization);

    /**
     * Finds active projects by organization
     * 
     * @param organization the organization
     * @return list of active projects
     */
    List<Project> findActiveProjectsByOrganization(Organization organization);

    /**
     * Finds projects by status
     * 
     * @param status the project status
     * @return list of projects
     */
    List<Project> findByStatus(Project.ProjectStatus status);

    /**
     * Finds projects by organization and status
     * 
     * @param organization the organization
     * @param status the project status
     * @return list of projects
     */
    List<Project> findByOrganizationAndStatus(Organization organization, Project.ProjectStatus status);

    /**
     * Finds overdue projects
     * 
     * @param currentDate the current date to compare against
     * @return list of overdue projects
     */
    List<Project> findOverdueProjects(LocalDateTime currentDate);

    /**
     * Finds projects by tag
     * 
     * @param tag the tag to search for
     * @return list of projects
     */
    List<Project> findByTag(String tag);

    /**
     * Finds high priority projects
     * 
     * @return list of high priority projects
     */
    List<Project> findHighPriorityProjects();

    /**
     * Updates an existing project
     * 
     * @param id the project ID
     * @param project the updated project details
     * @return the updated project
     */
    Project updateProject(UUID id, Project project);

    /**
     * Soft deletes a project
     * 
     * @param id the project ID
     */
    void deleteProject(UUID id);

    /**
     * Starts a project
     * 
     * @param id the project ID
     * @return the started project
     */
    Project startProject(UUID id);

    /**
     * Completes a project
     * 
     * @param id the project ID
     * @return the completed project
     */
    Project completeProject(UUID id);

    /**
     * Puts a project on hold
     * 
     * @param id the project ID
     * @return the project on hold
     */
    Project putProjectOnHold(UUID id);

    /**
     * Cancels a project
     * 
     * @param id the project ID
     * @return the cancelled project
     */
    Project cancelProject(UUID id);

    /**
     * Checks if a project key exists
     * 
     * @param key the project key
     * @return true if the key exists, false otherwise
     */
    boolean existsByKey(String key);

    /**
     * Counts projects by organization
     * 
     * @param organization the organization
     * @return the count of projects
     */
    long countByOrganization(Organization organization);

    /**
     * Counts projects by status
     * 
     * @param status the project status
     * @return the count of projects
     */
    long countByStatus(Project.ProjectStatus status);

    /**
     * Gets the Business Requirements Document for a project
     * 
     * @param id the project ID
     * @return the BRD content
     */
    String getProjectBRD(UUID id);
}
