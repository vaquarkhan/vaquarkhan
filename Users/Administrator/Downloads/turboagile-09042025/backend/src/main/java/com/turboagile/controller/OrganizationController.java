package com.turboagile.controller;

import com.turboagile.dto.OrganizationStatistics;
import com.turboagile.entity.Organization;
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
 * REST Controller for Organization operations
 * 
 * @author TurboAgile Team
 * @version 2.0.0
 */
@RestController
@RequestMapping("/api/v1/organizations")
@Tag(name = "Organization", description = "Organization management APIs")
@CrossOrigin(origins = "*")
public class OrganizationController {

    @Autowired
    private OrganizationService organizationService;

    @PostMapping
    @Operation(summary = "Create a new organization", description = "Creates a new organization with the provided details")
    public ResponseEntity<Organization> createOrganization(
            @Parameter(description = "Organization details") @Valid @RequestBody Organization organization) {
        Organization created = organizationService.createOrganization(organization);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get organization by ID", description = "Retrieves an organization by its unique identifier")
    public ResponseEntity<Organization> getOrganizationById(
            @Parameter(description = "Organization ID") @PathVariable UUID id) {
        return organizationService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/name/{name}")
    @Operation(summary = "Get organization by name", description = "Retrieves an organization by its name")
    public ResponseEntity<Organization> getOrganizationByName(
            @Parameter(description = "Organization name") @PathVariable String name) {
        return organizationService.findByName(name)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/domain/{domain}")
    @Operation(summary = "Get organization by domain", description = "Retrieves an organization by its domain")
    public ResponseEntity<Organization> getOrganizationByDomain(
            @Parameter(description = "Organization domain") @PathVariable String domain) {
        return organizationService.findByDomain(domain)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    @Operation(summary = "Get all organizations", description = "Retrieves all organizations with optional pagination")
    public ResponseEntity<Page<Organization>> getAllOrganizations(Pageable pageable) {
        Page<Organization> organizations = organizationService.findAll(pageable);
        return ResponseEntity.ok(organizations);
    }

    @GetMapping("/all")
    @Operation(summary = "Get all organizations without pagination", description = "Retrieves all organizations as a list")
    public ResponseEntity<List<Organization>> getAllOrganizationsList() {
        List<Organization> organizations = organizationService.findAll();
        return ResponseEntity.ok(organizations);
    }

    @GetMapping("/active")
    @Operation(summary = "Get active organizations", description = "Retrieves all active organizations")
    public ResponseEntity<List<Organization>> getActiveOrganizations() {
        List<Organization> organizations = organizationService.findActiveOrganizations();
        return ResponseEntity.ok(organizations);
    }

    @GetMapping("/subscription/{plan}")
    @Operation(summary = "Get organizations by subscription plan", description = "Retrieves organizations by subscription plan")
    public ResponseEntity<List<Organization>> getOrganizationsBySubscriptionPlan(
            @Parameter(description = "Subscription plan") @PathVariable Organization.SubscriptionPlan plan) {
        List<Organization> organizations = organizationService.findBySubscriptionPlan(plan);
        return ResponseEntity.ok(organizations);
    }

    @GetMapping("/subscription/active")
    @Operation(summary = "Get organizations with active subscription", description = "Retrieves organizations with active subscription")
    public ResponseEntity<List<Organization>> getOrganizationsWithActiveSubscription() {
        LocalDateTime currentTime = LocalDateTime.now();
        List<Organization> organizations = organizationService.findOrganizationsWithActiveSubscription(currentTime);
        return ResponseEntity.ok(organizations);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update organization", description = "Updates an existing organization")
    public ResponseEntity<Organization> updateOrganization(
            @Parameter(description = "Organization ID") @PathVariable UUID id,
            @Parameter(description = "Updated organization details") @Valid @RequestBody Organization organization) {
        Organization updated = organizationService.updateOrganization(id, organization);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete organization", description = "Soft deletes an organization")
    public ResponseEntity<Void> deleteOrganization(
            @Parameter(description = "Organization ID") @PathVariable UUID id) {
        organizationService.deleteOrganization(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/activate")
    @Operation(summary = "Activate organization", description = "Activates a deactivated organization")
    public ResponseEntity<Organization> activateOrganization(
            @Parameter(description = "Organization ID") @PathVariable UUID id) {
        Organization activated = organizationService.activateOrganization(id);
        return ResponseEntity.ok(activated);
    }

    @PostMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate organization", description = "Deactivates an active organization")
    public ResponseEntity<Organization> deactivateOrganization(
            @Parameter(description = "Organization ID") @PathVariable UUID id) {
        Organization deactivated = organizationService.deactivateOrganization(id);
        return ResponseEntity.ok(deactivated);
    }

    @GetMapping("/{id}/statistics")
    @Operation(summary = "Get organization statistics", description = "Retrieves statistics for an organization")
    public ResponseEntity<OrganizationStatistics> getOrganizationStatistics(
            @Parameter(description = "Organization ID") @PathVariable UUID id) {
        OrganizationStatistics stats = organizationService.getOrganizationStatistics(id);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/check/name/{name}")
    @Operation(summary = "Check if organization name exists", description = "Checks if an organization name is already taken")
    public ResponseEntity<Boolean> checkOrganizationNameExists(
            @Parameter(description = "Organization name") @PathVariable String name) {
        boolean exists = organizationService.existsByName(name);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/check/domain/{domain}")
    @Operation(summary = "Check if organization domain exists", description = "Checks if an organization domain is already taken")
    public ResponseEntity<Boolean> checkOrganizationDomainExists(
            @Parameter(description = "Organization domain") @PathVariable String domain) {
        boolean exists = organizationService.existsByDomain(domain);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/count/subscription/{plan}")
    @Operation(summary = "Count organizations by subscription plan", description = "Counts organizations by subscription plan")
    public ResponseEntity<Long> countOrganizationsBySubscriptionPlan(
            @Parameter(description = "Subscription plan") @PathVariable Organization.SubscriptionPlan plan) {
        long count = organizationService.countBySubscriptionPlan(plan);
        return ResponseEntity.ok(count);
    }
}
