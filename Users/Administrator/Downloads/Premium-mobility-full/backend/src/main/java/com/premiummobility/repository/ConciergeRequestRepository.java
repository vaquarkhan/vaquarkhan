package com.premiummobility.repository;

import com.premiummobility.model.ConciergeRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConciergeRequestRepository extends JpaRepository<ConciergeRequest, Long> {
    long countByStatus(String status);
}

