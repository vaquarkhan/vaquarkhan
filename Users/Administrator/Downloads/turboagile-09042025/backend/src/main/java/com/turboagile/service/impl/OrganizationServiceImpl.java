package com.turboagile.service.impl;

import com.turboagile.dto.OrganizationStatistics;
import com.turboagile.entity.Organization;
import com.turboagile.repository.OrganizationRepository;
import com.turboagile.service.OrganizationService;
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
 * Implementation of OrganizationService
 * 
 * @author TurboAgile Team
 * @version 2.0.0
 */
@Service
@Transactional
public class OrganizationServiceImpl implements OrganizationService {

    @Autowired
    private OrganizationRepository organizationRepository;

    @Override
    public Organization createOrganization(Organization organization) {
        // Set default values
        if (organization.getSubscriptionPlan() == null) {
            organization.setSubscriptionPlan(Organization.SubscriptionPlan.FREE);
        }
        if (organization.getMaxUsers() == null) {
            organization.setMaxUsers(10);
        }
        if (organization.getMaxProjects() == null) {
            organization.setMaxProjects(5);
        }
        if (organization.getTimezone() == null) {
            organization.setTimezone("UTC");
        }
        if (organization.getLocale() == null) {
            organization.setLocale("en_US");
        }
        
        return organizationRepository.save(organization);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Organization> findById(UUID id) {
        return organizationRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Organization> findByName(String name) {
        return organizationRepository.findByName(name);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Organization> findByDomain(String domain) {
        return organizationRepository.findByDomain(domain);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Organization> findAll() {
        return organizationRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Organization> findAll(Pageable pageable) {
        return organizationRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Organization> findActiveOrganizations() {
        return organizationRepository.findActiveOrganizations();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Organization> findBySubscriptionPlan(Organization.SubscriptionPlan subscriptionPlan) {
        return organizationRepository.findBySubscriptionPlan(subscriptionPlan);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Organization> findOrganizationsWithActiveSubscription(LocalDateTime currentTime) {
        return organizationRepository.findOrganizationsWithActiveSubscription(currentTime);
    }

    @Override
    public Organization updateOrganization(UUID id, Organization organizationDetails) {
        Organization organization = organizationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Organization not found with id: " + id));

        // Update fields
        if (organizationDetails.getName() != null) {
            organization.setName(organizationDetails.getName());
        }
        if (organizationDetails.getDescription() != null) {
            organization.setDescription(organizationDetails.getDescription());
        }
        if (organizationDetails.getDomain() != null) {
            organization.setDomain(organizationDetails.getDomain());
        }
        if (organizationDetails.getLogoUrl() != null) {
            organization.setLogoUrl(organizationDetails.getLogoUrl());
        }
        if (organizationDetails.getWebsiteUrl() != null) {
            organization.setWebsiteUrl(organizationDetails.getWebsiteUrl());
        }
        if (organizationDetails.getContactEmail() != null) {
            organization.setContactEmail(organizationDetails.getContactEmail());
        }
        if (organizationDetails.getContactPhone() != null) {
            organization.setContactPhone(organizationDetails.getContactPhone());
        }
        if (organizationDetails.getAddress() != null) {
            organization.setAddress(organizationDetails.getAddress());
        }
        if (organizationDetails.getTimezone() != null) {
            organization.setTimezone(organizationDetails.getTimezone());
        }
        if (organizationDetails.getLocale() != null) {
            organization.setLocale(organizationDetails.getLocale());
        }
        if (organizationDetails.getMaxUsers() != null) {
            organization.setMaxUsers(organizationDetails.getMaxUsers());
        }
        if (organizationDetails.getMaxProjects() != null) {
            organization.setMaxProjects(organizationDetails.getMaxProjects());
        }
        if (organizationDetails.getSubscriptionPlan() != null) {
            organization.setSubscriptionPlan(organizationDetails.getSubscriptionPlan());
        }
        if (organizationDetails.getSubscriptionExpiresAt() != null) {
            organization.setSubscriptionExpiresAt(organizationDetails.getSubscriptionExpiresAt());
        }

        return organizationRepository.save(organization);
    }

    @Override
    public void deleteOrganization(UUID id) {
        Organization organization = organizationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Organization not found with id: " + id));
        
        // Soft delete by setting isActive to false
        organization.setIsActive(false);
        organizationRepository.save(organization);
    }

    @Override
    public Organization activateOrganization(UUID id) {
        Organization organization = organizationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Organization not found with id: " + id));
        
        organization.setIsActive(true);
        return organizationRepository.save(organization);
    }

    @Override
    public Organization deactivateOrganization(UUID id) {
        Organization organization = organizationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Organization not found with id: " + id));
        
        organization.setIsActive(false);
        return organizationRepository.save(organization);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByName(String name) {
        return organizationRepository.existsByName(name);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByDomain(String domain) {
        return organizationRepository.existsByDomain(domain);
    }

    @Override
    @Transactional(readOnly = true)
    public long countBySubscriptionPlan(Organization.SubscriptionPlan subscriptionPlan) {
        return organizationRepository.countBySubscriptionPlan(subscriptionPlan);
    }

    @Override
    @Transactional(readOnly = true)
    public OrganizationStatistics getOrganizationStatistics(UUID organizationId) {
        Organization organization = organizationRepository.findById(organizationId)
                .orElseThrow(() -> new RuntimeException("Organization not found with id: " + organizationId));

        // This is a simplified implementation - in a real application, you would
        // calculate these statistics from the actual data
        OrganizationStatistics stats = new OrganizationStatistics();
        stats.setTotalUsers((long) organization.getUsers().size());
        stats.setTotalProjects((long) organization.getProjects().size());
        stats.setTotalStories(0L); // Would calculate from projects
        stats.setTotalSprints(0L); // Would calculate from projects
        stats.setActiveProjects(0L); // Would calculate from projects
        stats.setCompletedProjects(0L); // Would calculate from projects
        stats.setActiveStories(0L); // Would calculate from stories
        stats.setCompletedStories(0L); // Would calculate from stories
        stats.setActiveSprints(0L); // Would calculate from sprints
        stats.setCompletedSprints(0L); // Would calculate from sprints
        stats.setLastActivity(organization.getUpdatedAt());
        stats.setAverageProjectProgress(0.0); // Would calculate from projects
        stats.setAverageSprintVelocity(0.0); // Would calculate from sprints

        return stats;
    }
}
