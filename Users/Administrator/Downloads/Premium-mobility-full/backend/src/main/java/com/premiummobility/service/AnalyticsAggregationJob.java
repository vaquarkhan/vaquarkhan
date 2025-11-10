package com.premiummobility.service;

import com.premiummobility.model.AnalyticsSnapshot;
import com.premiummobility.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AnalyticsAggregationJob {

    private static final Logger log = LoggerFactory.getLogger(AnalyticsAggregationJob.class);

    private final AnalyticsSnapshotRepository snapshotRepository;
    private final BookingRepository bookingRepository;
    private final LoyaltyTransactionRepository loyaltyTransactionRepository;
    private final AiInteractionRepository aiInteractionRepository;
    private final FeedbackEntryRepository feedbackEntryRepository;
    private final ConciergeRequestRepository conciergeRequestRepository;

    public AnalyticsAggregationJob(AnalyticsSnapshotRepository snapshotRepository,
                                   BookingRepository bookingRepository,
                                   LoyaltyTransactionRepository loyaltyTransactionRepository,
                                   AiInteractionRepository aiInteractionRepository,
                                   FeedbackEntryRepository feedbackEntryRepository,
                                   ConciergeRequestRepository conciergeRequestRepository) {
        this.snapshotRepository = snapshotRepository;
        this.bookingRepository = bookingRepository;
        this.loyaltyTransactionRepository = loyaltyTransactionRepository;
        this.aiInteractionRepository = aiInteractionRepository;
        this.feedbackEntryRepository = feedbackEntryRepository;
        this.conciergeRequestRepository = conciergeRequestRepository;
    }

    @Scheduled(cron = "${app.analytics.snapshot-cron:0 0 * * * *}")
    public void captureSnapshots() {
        LocalDateTime now = LocalDateTime.now();
        try {
            saveSnapshot(now, "bookings.total", BigDecimal.valueOf(bookingRepository.count()), "global", "Total bookings captured");

            long loyaltyDelta = loyaltyTransactionRepository.findAll().stream()
                    .mapToLong(tx -> tx.getPointsChange() != null ? tx.getPointsChange() : 0)
                    .sum();
            saveSnapshot(now, "loyalty.pointsChange", BigDecimal.valueOf(loyaltyDelta), "rolling", "Net loyalty points change (all time)");

            long aiLastHour = aiInteractionRepository.countByCreatedAtAfter(now.minusHours(1));
            saveSnapshot(now, "ai.requests.lastHour", BigDecimal.valueOf(aiLastHour), "hour", "AI interactions in the past hour");

            long successfulAi = aiInteractionRepository.countBySuccess(true);
            saveSnapshot(now, "ai.success.total", BigDecimal.valueOf(successfulAi), "global", "Successful AI interactions");

            List<com.premiummobility.model.FeedbackEntry> feedback = feedbackEntryRepository.findAll();
            if (!feedback.isEmpty()) {
                double avgRating = feedback.stream()
                        .filter(entry -> entry.getRating() != null)
                        .mapToInt(com.premiummobility.model.FeedbackEntry::getRating)
                        .average()
                        .orElse(0.0);
                saveSnapshot(now, "feedback.avgRating", BigDecimal.valueOf(avgRating).setScale(2, RoundingMode.HALF_UP), "global", "Average feedback rating");
            }

            long conciergeInProgress = conciergeRequestRepository.countByStatus("In Progress");
            saveSnapshot(now, "concierge.inProgress", BigDecimal.valueOf(conciergeInProgress), "global", "Active concierge requests");
        } catch (Exception ex) {
            log.warn("Failed to capture analytics snapshot", ex);
        }
    }

    private void saveSnapshot(LocalDateTime snapshotTime, String metricKey, BigDecimal value, String dimension, String notes) {
        AnalyticsSnapshot snapshot = new AnalyticsSnapshot();
        snapshot.setSnapshotTime(snapshotTime);
        snapshot.setMetricKey(metricKey);
        snapshot.setMetricValue(value);
        snapshot.setDimension(dimension);
        snapshot.setNotes(notes);
        snapshotRepository.save(snapshot);
    }
}
