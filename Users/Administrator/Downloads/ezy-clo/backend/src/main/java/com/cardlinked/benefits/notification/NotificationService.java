package com.cardlinked.benefits.notification;

import org.springframework.stereotype.Service;
import org.springframework.context.ApplicationEventPublisher;
import lombok.extern.slf4j.Slf4j;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.List;

@Service
@Slf4j
public class NotificationService {

    private final ApplicationEventPublisher eventPublisher;

    public NotificationService(ApplicationEventPublisher eventPublisher) {
        this.eventPublisher = eventPublisher;
    }

    public void sendOfferNotification(String userId, String offerId, NotificationType type) {
        NotificationRequest request = NotificationRequest.builder()
            .userId(userId)
            .type(type)
            .title(getOfferNotificationTitle(type))
            .message(getOfferNotificationMessage(type, offerId))
            .data(Map.of("offerId", offerId, "type", type.name()))
            .channels(List.of(NotificationChannel.IN_APP, NotificationChannel.EMAIL))
            .build();
        
        sendNotification(request);
    }

    public void sendSpendThresholdNotification(String userId, String thresholdName, 
                                             Double currentSpend, Double targetSpend) {
        double progress = (currentSpend / targetSpend) * 100;
        
        NotificationRequest request = NotificationRequest.builder()
            .userId(userId)
            .type(NotificationType.SPEND_PROGRESS)
            .title("Spend Progress Update")
            .message(String.format("You're %.0f%% towards your %s threshold!", progress, thresholdName))
            .data(Map.of(
                "thresholdName", thresholdName,
                "currentSpend", currentSpend.toString(),
                "targetSpend", targetSpend.toString(),
                "progress", String.valueOf(progress)
            ))
            .channels(List.of(NotificationChannel.IN_APP))
            .build();
        
        sendNotification(request);
    }

    public void sendSystemAlert(String message, AlertSeverity severity) {
        NotificationRequest request = NotificationRequest.builder()
            .userId("SYSTEM")
            .type(NotificationType.SYSTEM_ALERT)
            .title("System Alert - " + severity.name())
            .message(message)
            .data(Map.of("severity", severity.name()))
            .channels(List.of(NotificationChannel.EMAIL, NotificationChannel.SMS))
            .priority(severity == AlertSeverity.CRITICAL ? NotificationPriority.HIGH : NotificationPriority.NORMAL)
            .build();
        
        sendNotification(request);
    }

    private void sendNotification(NotificationRequest request) {
        try {
            // Publish event for async processing
            eventPublisher.publishEvent(new NotificationEvent(request));
            log.info("Notification queued for user: {} with type: {}", 
                request.getUserId(), request.getType());
        } catch (Exception e) {
            log.error("Failed to queue notification for user: {}", request.getUserId(), e);
        }
    }

    private String getOfferNotificationTitle(NotificationType type) {
        return switch (type) {
            case NEW_OFFER -> "New Offer Available!";
            case OFFER_EXPIRING -> "Offer Expiring Soon";
            case OFFER_REDEEMED -> "Offer Successfully Redeemed";
            default -> "Offer Update";
        };
    }

    private String getOfferNotificationMessage(NotificationType type, String offerId) {
        return switch (type) {
            case NEW_OFFER -> "A new personalized offer is available for you!";
            case OFFER_EXPIRING -> "Your offer expires soon. Don't miss out!";
            case OFFER_REDEEMED -> "Your offer has been successfully redeemed.";
            default -> "Offer update for: " + offerId;
        };
    }

    @Data
    @lombok.Builder
    public static class NotificationRequest {
        private String userId;
        private NotificationType type;
        private String title;
        private String message;
        private Map<String, String> data;
        private List<NotificationChannel> channels;
        private NotificationPriority priority = NotificationPriority.NORMAL;
        private LocalDateTime scheduledFor;
    }

    public static class NotificationEvent {
        private final NotificationRequest request;
        private final LocalDateTime createdAt;

        public NotificationEvent(NotificationRequest request) {
            this.request = request;
            this.createdAt = LocalDateTime.now();
        }

        public NotificationRequest getRequest() { return request; }
        public LocalDateTime getCreatedAt() { return createdAt; }
    }

    public enum NotificationType {
        NEW_OFFER, OFFER_EXPIRING, OFFER_REDEEMED, SPEND_PROGRESS, SYSTEM_ALERT
    }

    public enum NotificationChannel {
        EMAIL, SMS, IN_APP, PUSH
    }

    public enum NotificationPriority {
        LOW, NORMAL, HIGH, URGENT
    }

    public enum AlertSeverity {
        INFO, WARNING, ERROR, CRITICAL
    }
}