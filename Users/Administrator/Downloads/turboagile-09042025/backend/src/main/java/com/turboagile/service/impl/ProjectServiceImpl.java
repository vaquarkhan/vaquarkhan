package com.turboagile.service.impl;

import com.turboagile.entity.Project;
import com.turboagile.entity.Organization;
import com.turboagile.repository.ProjectRepository;
import com.turboagile.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Implementation of ProjectService
 * 
 * @author TurboAgile Team
 * @version 2.0.0
 */
@Service
@Transactional
public class ProjectServiceImpl implements ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Override
    public Project createProject(Project project) {
        // Set creation timestamp
        project.setCreatedAt(LocalDateTime.now());
        project.setUpdatedAt(LocalDateTime.now());
        
        // Set default status if not provided
        if (project.getStatus() == null) {
            project.setStatus(Project.ProjectStatus.PLANNING);
        }
        
        return projectRepository.save(project);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Project> findById(UUID id) {
        return projectRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Project> findByKey(String key) {
        return projectRepository.findByKey(key);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Project> findByOrganization(Organization organization, Pageable pageable) {
        return projectRepository.findByOrganization(organization, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Project> findByOrganization(Organization organization) {
        return projectRepository.findByOrganization(organization);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Project> findActiveProjectsByOrganization(Organization organization) {
        // Filter active projects from all organization projects
        return projectRepository.findByOrganization(organization).stream()
            .filter(project -> project.getStatus() == Project.ProjectStatus.ACTIVE)
            .collect(java.util.stream.Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<Project> findByStatus(Project.ProjectStatus status) {
        return projectRepository.findByStatus(status);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Project> findByOrganizationAndStatus(Organization organization, Project.ProjectStatus status) {
        return projectRepository.findByOrganizationAndStatus(organization, status);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Project> findOverdueProjects(LocalDateTime currentDate) {
        return projectRepository.findOverdueProjects(currentDate);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Project> findByTag(String tag) {
        return projectRepository.findAllWithTags().stream()
            .filter(project -> project.getTags() != null && 
                java.util.Arrays.asList(project.getTags()).contains(tag))
            .collect(java.util.stream.Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<Project> findHighPriorityProjects() {
        return projectRepository.findHighPriorityProjects();
    }

    @Override
    public Project updateProject(UUID id, Project project) {
        Project existingProject = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
        
        // Update fields
        existingProject.setName(project.getName());
        existingProject.setDescription(project.getDescription());
        existingProject.setKey(project.getKey());
        existingProject.setStatus(project.getStatus());
        existingProject.setStartDate(project.getStartDate());
        existingProject.setEndDate(project.getEndDate());
        existingProject.setTags(project.getTags());
        existingProject.setUpdatedAt(LocalDateTime.now());
        
        return projectRepository.save(existingProject);
    }

    @Override
    public void deleteProject(UUID id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
        
        // Soft delete - set status to CANCELLED
        project.setStatus(Project.ProjectStatus.CANCELLED);
        project.setUpdatedAt(LocalDateTime.now());
        projectRepository.save(project);
    }

    @Override
    public Project startProject(UUID id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
        
        if (project.getStatus() != Project.ProjectStatus.PLANNING) {
            throw new RuntimeException("Project must be in PLANNING status to start");
        }
        
        project.setStatus(Project.ProjectStatus.ACTIVE);
        project.setStartDate(LocalDateTime.now());
        project.setUpdatedAt(LocalDateTime.now());
        
        return projectRepository.save(project);
    }

    @Override
    public Project completeProject(UUID id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
        
        if (project.getStatus() != Project.ProjectStatus.ACTIVE && 
            project.getStatus() != Project.ProjectStatus.PLANNING) {
            throw new RuntimeException("Project must be in ACTIVE or PLANNING status to complete");
        }
        
        project.setStatus(Project.ProjectStatus.COMPLETED);
        project.setEndDate(LocalDateTime.now());
        project.setUpdatedAt(LocalDateTime.now());
        
        return projectRepository.save(project);
    }

    @Override
    public Project putProjectOnHold(UUID id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
        
        if (project.getStatus() != Project.ProjectStatus.ACTIVE && 
            project.getStatus() != Project.ProjectStatus.PLANNING) {
            throw new RuntimeException("Project must be in ACTIVE or PLANNING status to put on hold");
        }
        
        project.setStatus(Project.ProjectStatus.ON_HOLD);
        project.setUpdatedAt(LocalDateTime.now());
        
        return projectRepository.save(project);
    }

    @Override
    public Project cancelProject(UUID id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
        
        if (project.getStatus() == Project.ProjectStatus.COMPLETED) {
            throw new RuntimeException("Cannot cancel a completed project");
        }
        
        project.setStatus(Project.ProjectStatus.CANCELLED);
        project.setUpdatedAt(LocalDateTime.now());
        
        return projectRepository.save(project);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByKey(String key) {
        return projectRepository.existsByKey(key);
    }

    @Override
    @Transactional(readOnly = true)
    public long countByOrganization(Organization organization) {
        return projectRepository.countByOrganization(organization);
    }

    @Override
    @Transactional(readOnly = true)
    public long countByStatus(Project.ProjectStatus status) {
        return projectRepository.countByStatus(status);
    }

    @Override
    @Transactional(readOnly = true)
    public String getProjectBRD(UUID id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
        
        // In a real implementation, this would fetch the actual BRD document
        // For now, return a sample BRD based on project information
        return generateSampleBRD(project);
    }

    private String generateSampleBRD(Project project) {
        StringBuilder brd = new StringBuilder();
        brd.append("Business Requirements Document\n");
        brd.append("================================\n\n");
        brd.append("Project: ").append(project.getName()).append("\n");
        brd.append("Key: ").append(project.getKey()).append("\n");
        brd.append("Description: ").append(project.getDescription() != null ? project.getDescription() : "No description available").append("\n\n");
        brd.append("Functional Requirements:\n");
        brd.append("- User authentication and authorization\n");
        brd.append("- Data management and storage\n");
        brd.append("- API endpoints for CRUD operations\n");
        brd.append("- Real-time notifications\n\n");
        brd.append("Non-Functional Requirements:\n");
        brd.append("- Performance: Response time < 2 seconds\n");
        brd.append("- Scalability: Support 1000+ concurrent users\n");
        brd.append("- Security: Data encryption and secure authentication\n");
        brd.append("- Availability: 99.9% uptime\n\n");
        brd.append("Technical Constraints:\n");
        brd.append("- Must be cloud-deployable\n");
        brd.append("- RESTful API architecture\n");
        brd.append("- Database agnostic design\n");
        brd.append("- Mobile-responsive interface\n");
        
        return brd.toString();
    }
}
