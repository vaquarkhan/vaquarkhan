package com.cardlinked.benefits.auth.repository;

import com.cardlinked.benefits.auth.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    // Basic user queries
    Optional<User> findByUsername(String username);
    
    Optional<User> findByUsernameAndStatus(String username, User.UserStatus status);
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByEmailAndStatus(String email, User.UserStatus status);

    // Status-based queries
    List<User> findByStatus(User.UserStatus status);
    
    Page<User> findByStatus(User.UserStatus status, Pageable pageable);
    
    long countByStatus(User.UserStatus status);

    // Department-based queries
    List<User> findByDepartmentAndStatus(String department, User.UserStatus status);
    
    Page<User> findByDepartment(String department, Pageable pageable);

    // Role-based queries
    @Query("SELECT u FROM User u JOIN u.roles r WHERE r.name = :roleName AND u.status = :status")
    List<User> findByRoleNameAndStatus(@Param("roleName") String roleName, 
                                      @Param("status") User.UserStatus status);

    @Query("SELECT u FROM User u JOIN u.roles r WHERE r.name = :roleName")
    Page<User> findByRoleName(@Param("roleName") String roleName, Pageable pageable);

    // Security queries
    @Query("SELECT u FROM User u WHERE u.failedLoginAttempts >= :maxAttempts")
    List<User> findUsersWithFailedAttempts(@Param("maxAttempts") int maxAttempts);
    
    @Query("SELECT u FROM User u WHERE u.accountLockedUntil IS NOT NULL AND u.accountLockedUntil > CURRENT_TIMESTAMP")
    List<User> findLockedUsers();
    
    @Query("SELECT u FROM User u WHERE u.passwordExpiryDate IS NOT NULL AND u.passwordExpiryDate < CURRENT_TIMESTAMP")
    List<User> findUsersWithExpiredPasswords();

    // Date-based queries
    List<User> findByLastLoginDateBefore(LocalDateTime date);
    
    List<User> findByCreatedDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT u FROM User u WHERE u.lastLoginDate IS NULL OR u.lastLoginDate < :cutoffDate")
    List<User> findInactiveUsers(@Param("cutoffDate") LocalDateTime cutoffDate);

    // Search functionality
    @Query("SELECT u FROM User u WHERE " +
           "LOWER(u.username) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(CONCAT(u.firstName, ' ', u.lastName)) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<User> searchUsers(@Param("searchTerm") String searchTerm, Pageable pageable);

    // Analytics queries
    @Query("SELECT u.department, COUNT(u) FROM User u WHERE u.status = :status GROUP BY u.department")
    List<Object[]> countUsersByDepartment(@Param("status") User.UserStatus status);

    @Query("SELECT r.name, COUNT(u) FROM User u JOIN u.roles r WHERE u.status = :status GROUP BY r.name")
    List<Object[]> countUsersByRole(@Param("status") User.UserStatus status);

    // Compliance queries
    @Query("SELECT COUNT(u) FROM User u WHERE u.createdDate >= :startDate AND u.createdDate < :endDate")
    long countNewUsersInPeriod(@Param("startDate") LocalDateTime startDate, 
                              @Param("endDate") LocalDateTime endDate);

    // Two-factor authentication queries
    List<User> findByTwoFactorEnabledAndStatus(Boolean twoFactorEnabled, User.UserStatus status);
}