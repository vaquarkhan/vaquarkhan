package com.turboagile.controller;

import com.turboagile.entity.Project;
import com.turboagile.entity.Organization;
import com.turboagile.service.ProjectService;
import com.turboagile.service.OrganizationService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Test class for ProjectController
 * 
 * @author TurboAgile Team
 * @version 2.0.0
 */
@ExtendWith(MockitoExtension.class)
class ProjectControllerTest {

    @Mock
    private ProjectService projectService;

    @Mock
    private OrganizationService organizationService;

    @InjectMocks
    private ProjectController projectController;

    @Test
    void testGetProjectById_WhenProjectExists_ShouldReturnProject() {
        // Arrange
        UUID projectId = UUID.randomUUID();
        Project project = new Project();
        project.setId(projectId);
        project.setName("Test Project");
        
        when(projectService.findById(projectId)).thenReturn(Optional.of(project));

        // Act
        ResponseEntity<Project> response = projectController.getProjectById(projectId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(projectId, response.getBody().getId());
        assertEquals("Test Project", response.getBody().getName());
        
        verify(projectService).findById(projectId);
    }

    @Test
    void testGetProjectById_WhenProjectDoesNotExist_ShouldReturnNotFound() {
        // Arrange
        UUID projectId = UUID.randomUUID();
        when(projectService.findById(projectId)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<Project> response = projectController.getProjectById(projectId);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNull(response.getBody());
        
        verify(projectService).findById(projectId);
    }

    @Test
    void testGetProjectByKey_WhenProjectExists_ShouldReturnProject() {
        // Arrange
        String projectKey = "TEST";
        Project project = new Project();
        project.setKey(projectKey);
        project.setName("Test Project");
        
        when(projectService.findByKey(projectKey)).thenReturn(Optional.of(project));

        // Act
        ResponseEntity<Project> response = projectController.getProjectByKey(projectKey);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(projectKey, response.getBody().getKey());
        assertEquals("Test Project", response.getBody().getName());
        
        verify(projectService).findByKey(projectKey);
    }

    @Test
    void testGetProjectByKey_WhenProjectDoesNotExist_ShouldReturnNotFound() {
        // Arrange
        String projectKey = "TEST";
        when(projectService.findByKey(projectKey)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<Project> response = projectController.getProjectByKey(projectKey);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNull(response.getBody());
        
        verify(projectService).findByKey(projectKey);
    }

    @Test
    void testCheckProjectKeyExists_ShouldReturnTrue() {
        // Arrange
        String projectKey = "TEST";
        when(projectService.existsByKey(projectKey)).thenReturn(true);

        // Act
        ResponseEntity<Boolean> response = projectController.checkProjectKeyExists(projectKey);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody());
        
        verify(projectService).existsByKey(projectKey);
    }

    @Test
    void testCheckProjectKeyExists_ShouldReturnFalse() {
        // Arrange
        String projectKey = "TEST";
        when(projectService.existsByKey(projectKey)).thenReturn(false);

        // Act
        ResponseEntity<Boolean> response = projectController.checkProjectKeyExists(projectKey);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertFalse(response.getBody());
        
        verify(projectService).existsByKey(projectKey);
    }
}
