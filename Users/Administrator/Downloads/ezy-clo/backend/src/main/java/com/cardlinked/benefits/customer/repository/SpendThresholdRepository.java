package com.cardlinked.benefits.customer.repository;

import com.cardlinked.benefits.customer.entity.SpendThreshold;
import com.cardlinked.benefits.customer.entity.Customer;
import com.cardlinked.benefits.customer.entity.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface SpendThresholdRepository extends JpaRepository<SpendThreshold, String> {

    // Customer-related queries
    List<SpendThreshold> findByCustomerAndStatus(Customer customer, SpendThreshold.ThresholdStatus status);
    
    List<SpendThreshold> findByCustomerCustomerId(String customerId);

    // Card-related queries
    List<SpendThreshold> findByCardAndStatus(Card card, SpendThreshold.ThresholdStatus status);
    
    List<SpendThreshold> findByCardAndThresholdTypeAndStatus(Card card, 
                                                               SpendThreshold.ThresholdType thresholdType,
                                                               SpendThreshold.ThresholdStatus status);

    // Threshold type queries
    List<SpendThreshold> findByThresholdTypeAndStatus(SpendThreshold.ThresholdType thresholdType, 
                                                     SpendThreshold.ThresholdStatus status);

    // Reset date queries
    List<SpendThreshold> findByResetDateBeforeAndStatus(LocalDate date, SpendThreshold.ThresholdStatus status);
    
    @Query("SELECT st FROM SpendThreshold st WHERE st.resetDate = :date AND st.status = :status")
    List<SpendThreshold> findThresholdsToReset(@Param("date") LocalDate date, 
                                              @Param("status") SpendThreshold.ThresholdStatus status);

    // Progress tracking queries
    @Query("SELECT st FROM SpendThreshold st WHERE st.currentSpend >= st.thresholdAmount AND st.status = 'ACTIVE'")
    List<SpendThreshold> findCompletedThresholds();

    @Query("SELECT st FROM SpendThreshold st WHERE " +
           "st.currentSpend / st.thresholdAmount >= :percentage AND st.status = 'ACTIVE'")
    List<SpendThreshold> findThresholdsNearCompletion(@Param("percentage") double percentage);

    // Analytics queries
    @Query("SELECT st.thresholdType, AVG(st.currentSpend), AVG(st.thresholdAmount) " +
           "FROM SpendThreshold st WHERE st.status = :status GROUP BY st.thresholdType")
    List<Object[]> getAverageSpendByThresholdType(@Param("status") SpendThreshold.ThresholdStatus status);

    @Query("SELECT st.customer.segmentType, st.thresholdType, COUNT(st) " +
           "FROM SpendThreshold st WHERE st.status = :status " +
           "GROUP BY st.customer.segmentType, st.thresholdType")
    List<Object[]> countThresholdsBySegmentAndType(@Param("status") SpendThreshold.ThresholdStatus status);

    // Customer segment analysis
    @Query("SELECT st FROM SpendThreshold st WHERE " +
           "st.customer.segmentType = :segmentType AND " +
           "st.thresholdType = :thresholdType AND " +
           "st.status = :status")
    List<SpendThreshold> findByCustomerSegmentAndThresholdType(@Param("segmentType") Customer.SegmentType segmentType,
                                                              @Param("thresholdType") SpendThreshold.ThresholdType thresholdType,
                                                              @Param("status") SpendThreshold.ThresholdStatus status);
}