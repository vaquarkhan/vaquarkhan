package com.turboagile.controller;

import com.turboagile.entity.Project;
import com.turboagile.entity.Organization;
import com.turboagile.service.ProjectService;
import com.turboagile.service.OrganizationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * REST Controller for Project operations
 * 
 * @author TurboAgile Team
 * @version 2.0.0
 */
@RestController
@RequestMapping("/api/v1/projects")
@Tag(name = "Project", description = "Project management APIs")
@CrossOrigin(origins = "*")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private OrganizationService organizationService;

    @PostMapping
    @Operation(summary = "Create a new project", description = "Creates a new project with the provided details")
    public ResponseEntity<Project> createProject(
            @Parameter(description = "Project details") @Valid @RequestBody Project project) {
        Project created = projectService.createProject(project);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get project by ID", description = "Retrieves a project by its unique identifier")
    public ResponseEntity<Project> getProjectById(
            @Parameter(description = "Project ID") @PathVariable UUID id) {
        return projectService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/key/{key}")
    @Operation(summary = "Get project by key", description = "Retrieves a project by its key")
    public ResponseEntity<Project> getProjectByKey(
            @Parameter(description = "Project key") @PathVariable String key) {
        return projectService.findByKey(key)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/organization/{organizationId}")
    @Operation(summary = "Get projects by organization", description = "Retrieves all projects for a specific organization")
    public ResponseEntity<Page<Project>> getProjectsByOrganization(
            @Parameter(description = "Organization ID") @PathVariable UUID organizationId,
            Pageable pageable) {
        Organization organization = organizationService.findById(organizationId)
                .orElseThrow(() -> new RuntimeException("Organization not found"));
        
        Page<Project> projects = projectService.findByOrganization(organization, pageable);
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/organization/{organizationId}/all")
    @Operation(summary = "Get all projects by organization", description = "Retrieves all projects for a specific organization as a list")
    public ResponseEntity<List<Project>> getAllProjectsByOrganization(
            @Parameter(description = "Organization ID") @PathVariable UUID organizationId) {
        Organization organization = organizationService.findById(organizationId)
                .orElseThrow(() -> new RuntimeException("Organization not found"));
        
        List<Project> projects = projectService.findByOrganization(organization);
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/organization/{organizationId}/active")
    @Operation(summary = "Get active projects by organization", description = "Retrieves active projects for a specific organization")
    public ResponseEntity<List<Project>> getActiveProjectsByOrganization(
            @Parameter(description = "Organization ID") @PathVariable UUID organizationId) {
        Organization organization = organizationService.findById(organizationId)
                .orElseThrow(() -> new RuntimeException("Organization not found"));
        
        List<Project> projects = projectService.findActiveProjectsByOrganization(organization);
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get projects by status", description = "Retrieves projects by status")
    public ResponseEntity<List<Project>> getProjectsByStatus(
            @Parameter(description = "Project status") @PathVariable Project.ProjectStatus status) {
        List<Project> projects = projectService.findByStatus(status);
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/organization/{organizationId}/status/{status}")
    @Operation(summary = "Get projects by organization and status", description = "Retrieves projects by organization and status")
    public ResponseEntity<List<Project>> getProjectsByOrganizationAndStatus(
            @Parameter(description = "Organization ID") @PathVariable UUID organizationId,
            @Parameter(description = "Project status") @PathVariable Project.ProjectStatus status) {
        Organization organization = organizationService.findById(organizationId)
                .orElseThrow(() -> new RuntimeException("Organization not found"));
        
        List<Project> projects = projectService.findByOrganizationAndStatus(organization, status);
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/overdue")
    @Operation(summary = "Get overdue projects", description = "Retrieves projects with overdue end dates")
    public ResponseEntity<List<Project>> getOverdueProjects() {
        LocalDateTime currentDate = LocalDateTime.now();
        List<Project> projects = projectService.findOverdueProjects(currentDate);
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/tag/{tag}")
    @Operation(summary = "Get projects by tag", description = "Retrieves projects by tag")
    public ResponseEntity<List<Project>> getProjectsByTag(
            @Parameter(description = "Tag") @PathVariable String tag) {
        List<Project> projects = projectService.findByTag(tag);
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/high-priority")
    @Operation(summary = "Get high priority projects", description = "Retrieves high priority projects")
    public ResponseEntity<List<Project>> getHighPriorityProjects() {
        List<Project> projects = projectService.findHighPriorityProjects();
        return ResponseEntity.ok(projects);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update project", description = "Updates an existing project")
    public ResponseEntity<Project> updateProject(
            @Parameter(description = "Project ID") @PathVariable UUID id,
            @Parameter(description = "Updated project details") @Valid @RequestBody Project project) {
        Project updated = projectService.updateProject(id, project);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete project", description = "Soft deletes a project")
    public ResponseEntity<Void> deleteProject(
            @Parameter(description = "Project ID") @PathVariable UUID id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/start")
    @Operation(summary = "Start project", description = "Starts a project")
    public ResponseEntity<Project> startProject(
            @Parameter(description = "Project ID") @PathVariable UUID id) {
        Project started = projectService.startProject(id);
        return ResponseEntity.ok(started);
    }

    @PostMapping("/{id}/complete")
    @Operation(summary = "Complete project", description = "Completes a project")
    public ResponseEntity<Project> completeProject(
            @Parameter(description = "Project ID") @PathVariable UUID id) {
        Project completed = projectService.completeProject(id);
        return ResponseEntity.ok(completed);
    }

    @PostMapping("/{id}/hold")
    @Operation(summary = "Put project on hold", description = "Puts a project on hold")
    public ResponseEntity<Project> putProjectOnHold(
            @Parameter(description = "Project ID") @PathVariable UUID id) {
        Project onHold = projectService.putProjectOnHold(id);
        return ResponseEntity.ok(onHold);
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancel project", description = "Cancels a project")
    public ResponseEntity<Project> cancelProject(
            @Parameter(description = "Project ID") @PathVariable UUID id) {
        Project cancelled = projectService.cancelProject(id);
        return ResponseEntity.ok(cancelled);
    }

    @GetMapping("/check/key/{key}")
    @Operation(summary = "Check if project key exists", description = "Checks if a project key is already taken")
    public ResponseEntity<Boolean> checkProjectKeyExists(
            @Parameter(description = "Project key") @PathVariable String key) {
        boolean exists = projectService.existsByKey(key);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/count/organization/{organizationId}")
    @Operation(summary = "Count projects by organization", description = "Counts projects for a specific organization")
    public ResponseEntity<Long> countProjectsByOrganization(
            @Parameter(description = "Organization ID") @PathVariable UUID organizationId) {
        Organization organization = organizationService.findById(organizationId)
                .orElseThrow(() -> new RuntimeException("Organization not found"));
        
        long count = projectService.countByOrganization(organization);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/count/status/{status}")
    @Operation(summary = "Count projects by status", description = "Counts projects by status")
    public ResponseEntity<Long> countProjectsByStatus(
            @Parameter(description = "Project status") @PathVariable Project.ProjectStatus status) {
        long count = projectService.countByStatus(status);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/{id}/brd")
    @Operation(summary = "Get project BRD", description = "Retrieves the Business Requirements Document for a project")
    public ResponseEntity<String> getProjectBRD(
            @Parameter(description = "Project ID") @PathVariable UUID id) {
        String brd = projectService.getProjectBRD(id);
        return ResponseEntity.ok(brd);
    }
}
