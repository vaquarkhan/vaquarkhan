package com.turboagile.repository;

import com.turboagile.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for Organization entity
 * 
 * @author TurboAgile Team
 * @version 2.0.0
 */
@Repository
public interface OrganizationRepository extends JpaRepository<Organization, UUID> {

    /**
     * Find organization by name
     */
    Optional<Organization> findByName(String name);

    /**
     * Find organization by domain
     */
    Optional<Organization> findByDomain(String domain);

    /**
     * Find organizations by subscription plan
     */
    List<Organization> findBySubscriptionPlan(Organization.SubscriptionPlan subscriptionPlan);

    /**
     * Find active organizations
     */
    @Query("SELECT o FROM Organization o WHERE o.isActive = true")
    List<Organization> findActiveOrganizations();

    /**
     * Find organizations by subscription status
     */
    @Query("SELECT o FROM Organization o WHERE o.subscriptionExpiresAt > :currentTime")
    List<Organization> findOrganizationsWithActiveSubscription(@Param("currentTime") java.time.LocalDateTime currentTime);

    /**
     * Find organizations by user count range
     */
    @Query("SELECT o FROM Organization o WHERE SIZE(o.users) BETWEEN :minUsers AND :maxUsers")
    List<Organization> findByUserCountRange(@Param("minUsers") int minUsers, @Param("maxUsers") int maxUsers);

    /**
     * Find organizations by project count range
     */
    @Query("SELECT o FROM Organization o WHERE SIZE(o.projects) BETWEEN :minProjects AND :maxProjects")
    List<Organization> findByProjectCountRange(@Param("minProjects") int minProjects, @Param("maxProjects") int maxProjects);

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
     * Find organizations created in date range
     */
    @Query("SELECT o FROM Organization o WHERE o.createdAt BETWEEN :startDate AND :endDate")
    List<Organization> findByCreatedDateRange(@Param("startDate") java.time.LocalDateTime startDate, 
                                            @Param("endDate") java.time.LocalDateTime endDate);
}
