package com.premiummobility.repository;

import com.premiummobility.model.AiInteraction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AiInteractionRepository extends JpaRepository<AiInteraction, Long> {
    List<AiInteraction> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
    long countByCreatedAtAfter(LocalDateTime createdAt);
    long countBySuccess(Boolean success);
}

