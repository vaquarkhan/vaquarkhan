package com.turboagile.service;

import com.turboagile.entity.Organization;
import com.turboagile.dto.OrganizationStatistics;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Service interface for Organization operations
 * 
 * @author TurboAgile Team
 * @version 2.0.0
 */
public interface OrganizationService {

    /**
     * Create a new organization
     */
    Organization createOrganization(Organization organization);

    /**
     * Find organization by ID
     */
    Optional<Organization> findById(UUID id);

    /**
     * Find organization by name
     */
    Optional<Organization> findByName(String name);

    /**
     * Find organization by domain
     */
    Optional<Organization> findByDomain(String domain);

    /**
     * Find all organizations
     */
    List<Organization> findAll();

    /**
     * Find all organizations with pagination
     */
    Page<Organization> findAll(Pageable pageable);

    /**
     * Find active organizations
     */
    List<Organization> findActiveOrganizations();

    /**
     * Find organizations by subscription plan
     */
    List<Organization> findBySubscriptionPlan(Organization.SubscriptionPlan subscriptionPlan);

    /**
     * Find organizations with active subscription
     */
    List<Organization> findOrganizationsWithActiveSubscription(LocalDateTime currentTime);

    /**
     * Update organization
     */
    Organization updateOrganization(UUID id, Organization organization);

    /**
     * Delete organization
     */
    void deleteOrganization(UUID id);

    /**
     * Activate organization
     */
    Organization activateOrganization(UUID id);

    /**
     * Deactivate organization
     */
    Organization deactivateOrganization(UUID id);

    /**
     * Check if organization name exists
     */
    boolean existsByName(String name);

    /**
     * Check if organization domain exists
     */
    boolean existsByDomain(String domain);

    /**
     * Count organizations by subscription plan
     */
    long countBySubscriptionPlan(Organization.SubscriptionPlan subscriptionPlan);

    /**
     * Get organization statistics
     */
    OrganizationStatistics getOrganizationStatistics(UUID organizationId);
}
