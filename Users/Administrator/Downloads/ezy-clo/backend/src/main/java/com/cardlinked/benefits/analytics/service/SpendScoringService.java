package com.cardlinked.benefits.analytics.service;

import com.cardlinked.benefits.customer.entity.Customer;
import com.cardlinked.benefits.customer.entity.Card;
import com.cardlinked.benefits.customer.entity.SpendThreshold;
import com.cardlinked.benefits.customer.repository.SpendThresholdRepository;
import com.cardlinked.benefits.transaction.entity.Transaction;
import com.cardlinked.benefits.transaction.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
public class SpendScoringService {

    private final TransactionRepository transactionRepository;
    private final SpendThresholdRepository spendThresholdRepository;

    @Autowired
    public SpendScoringService(TransactionRepository transactionRepository,
                              SpendThresholdRepository spendThresholdRepository) {
        this.transactionRepository = transactionRepository;
        this.spendThresholdRepository = spendThresholdRepository;
    }

    /**
     * Calculate comprehensive spend score for customer (T-1 processing)
     */
    public SpendScore calculateSpendScore(Customer customer, Card card) {
        LocalDateTime yesterday = LocalDateTime.now().minusDays(1);
        LocalDateTime startOfYesterday = yesterday.toLocalDate().atStartOfDay();
        LocalDateTime endOfYesterday = yesterday.toLocalDate().atTime(23, 59, 59);

        // Process transactions from yesterday (T-1)
        List<Transaction> yesterdayTransactions = transactionRepository
                .findByCardAndTransactionDateBetween(card, startOfYesterday, endOfYesterday);

        // Update spend thresholds
        updateSpendThresholds(customer, card, yesterdayTransactions);

        // Calculate current spend score
        return generateSpendScore(customer, card);
    }

    /**
     * Update all spend thresholds for a customer/card based on new transactions
     */
    public void updateSpendThresholds(Customer customer, Card card, List<Transaction> newTransactions) {
        // Calculate spend amounts by period
        Map<SpendThreshold.ThresholdType, BigDecimal> spendByPeriod = calculateSpendByPeriod(newTransactions);

        // Update each threshold type
        for (SpendThreshold.ThresholdType thresholdType : SpendThreshold.ThresholdType.values()) {
            updateThresholdForPeriod(customer, card, thresholdType, spendByPeriod.get(thresholdType));
        }
    }

    /**
     * Create or update spend threshold for specific period
     */
    public SpendThreshold createOrUpdateThreshold(Customer customer, Card card, 
                                                SpendThreshold.ThresholdType thresholdType, 
                                                BigDecimal thresholdAmount) {
        List<SpendThreshold> existingThresholds = spendThresholdRepository
                .findByCardAndThresholdTypeAndStatus(card, thresholdType, SpendThreshold.ThresholdStatus.ACTIVE);

        SpendThreshold threshold;
        if (existingThresholds.isEmpty()) {
            threshold = new SpendThreshold();
            threshold.setThresholdId(UUID.randomUUID().toString());
            threshold.setCustomer(customer);
            threshold.setCard(card);
            threshold.setThresholdType(thresholdType);
            threshold.setThresholdAmount(thresholdAmount);
            threshold.setCurrentSpend(BigDecimal.ZERO);
            threshold.setResetDate(calculateResetDate(thresholdType));
        } else {
            threshold = existingThresholds.get(0);
            threshold.setThresholdAmount(thresholdAmount);
        }

        return spendThresholdRepository.save(threshold);
    }

    /**
     * Get spend analysis by merchant category
     */
    public Map<String, SpendAnalysis> getSpendByMerchantCategory(Customer customer, Card card, 
                                                               LocalDateTime startDate, LocalDateTime endDate) {
        List<Object[]> spendData = transactionRepository.getSpendByMerchantCategory(startDate, endDate);
        Map<String, SpendAnalysis> analysis = new HashMap<>();

        for (Object[] row : spendData) {
            String merchantCode = (String) row[0];
            Long transactionCount = (Long) row[1];
            BigDecimal totalAmount = (BigDecimal) row[2];

            SpendAnalysis categoryAnalysis = new SpendAnalysis();
            categoryAnalysis.setMerchantCategoryCode(merchantCode);
            categoryAnalysis.setTransactionCount(transactionCount.intValue());
            categoryAnalysis.setTotalAmount(totalAmount);
            categoryAnalysis.setAverageTransactionAmount(
                totalAmount.divide(BigDecimal.valueOf(transactionCount), 2, RoundingMode.HALF_UP));

            analysis.put(merchantCode, categoryAnalysis);
        }

        return analysis;
    }

    /**
     * Calculate spend velocity (spending rate over time)
     */
    public SpendVelocity calculateSpendVelocity(Customer customer, Card card) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime thirtyDaysAgo = now.minusDays(30);
        LocalDateTime sixtyDaysAgo = now.minusDays(60);

        BigDecimal last30DaysSpend = transactionRepository.calculateCustomerSpend(customer, thirtyDaysAgo, now);
        BigDecimal previous30DaysSpend = transactionRepository.calculateCustomerSpend(customer, sixtyDaysAgo, thirtyDaysAgo);

        SpendVelocity velocity = new SpendVelocity();
        velocity.setLast30DaysSpend(last30DaysSpend);
        velocity.setPrevious30DaysSpend(previous30DaysSpend);
        
        if (previous30DaysSpend.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal changePercentage = last30DaysSpend.subtract(previous30DaysSpend)
                    .divide(previous30DaysSpend, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
            velocity.setChangePercentage(changePercentage);
        } else {
            velocity.setChangePercentage(BigDecimal.ZERO);
        }

        velocity.setDailyAverageSpend(last30DaysSpend.divide(BigDecimal.valueOf(30), 2, RoundingMode.HALF_UP));
        
        return velocity;
    }

    /**
     * Reset expired thresholds
     */
    @Transactional
    public void resetExpiredThresholds() {
        LocalDate today = LocalDate.now();
        List<SpendThreshold> expiredThresholds = spendThresholdRepository
                .findByResetDateBeforeAndStatus(today, SpendThreshold.ThresholdStatus.ACTIVE);

        for (SpendThreshold threshold : expiredThresholds) {
            threshold.setCurrentSpend(BigDecimal.ZERO);
            threshold.setResetDate(calculateResetDate(threshold.getThresholdType()));
            threshold.setStatus(SpendThreshold.ThresholdStatus.ACTIVE);
        }

        spendThresholdRepository.saveAll(expiredThresholds);
    }

    // Private helper methods
    private void updateThresholdForPeriod(Customer customer, Card card, 
                                        SpendThreshold.ThresholdType thresholdType, 
                                        BigDecimal additionalSpend) {
        if (additionalSpend == null || additionalSpend.compareTo(BigDecimal.ZERO) <= 0) {
            return;
        }

        List<SpendThreshold> thresholds = spendThresholdRepository
                .findByCardAndThresholdTypeAndStatus(card, thresholdType, SpendThreshold.ThresholdStatus.ACTIVE);

        if (!thresholds.isEmpty()) {
            SpendThreshold threshold = thresholds.get(0);
            
            // Check if threshold needs reset
            if (threshold.isExpired()) {
                threshold.setCurrentSpend(additionalSpend);
                threshold.setResetDate(calculateResetDate(thresholdType));
            } else {
                threshold.setCurrentSpend(threshold.getCurrentSpend().add(additionalSpend));
            }

            // Check if threshold is met
            if (threshold.isThresholdMet() && threshold.getStatus() == SpendThreshold.ThresholdStatus.ACTIVE) {
                threshold.setStatus(SpendThreshold.ThresholdStatus.COMPLETED);
            }

            spendThresholdRepository.save(threshold);
        }
    }

    private Map<SpendThreshold.ThresholdType, BigDecimal> calculateSpendByPeriod(List<Transaction> transactions) {
        Map<SpendThreshold.ThresholdType, BigDecimal> spendByPeriod = new HashMap<>();
        
        for (SpendThreshold.ThresholdType type : SpendThreshold.ThresholdType.values()) {
            spendByPeriod.put(type, BigDecimal.ZERO);
        }

        for (Transaction transaction : transactions) {
            if (transaction.getTransactionType() == Transaction.TransactionType.PURCHASE) {
                BigDecimal amount = transaction.getAmount();
                
                // Add to all period types (daily transactions contribute to weekly, monthly, yearly)
                for (SpendThreshold.ThresholdType type : SpendThreshold.ThresholdType.values()) {
                    spendByPeriod.put(type, spendByPeriod.get(type).add(amount));
                }
            }
        }

        return spendByPeriod;
    }

    private LocalDate calculateResetDate(SpendThreshold.ThresholdType thresholdType) {
        LocalDate today = LocalDate.now();
        
        switch (thresholdType) {
            case DAILY:
                return today.plusDays(1);
            case WEEKLY:
                return today.with(TemporalAdjusters.next(java.time.DayOfWeek.MONDAY));
            case MONTHLY:
                return today.with(TemporalAdjusters.firstDayOfNextMonth());
            case YEARLY:
                return today.with(TemporalAdjusters.firstDayOfNextYear());
            default:
                return today.plusDays(1);
        }
    }

    private SpendScore generateSpendScore(Customer customer, Card card) {
        SpendScore score = new SpendScore();
        score.setCustomer(customer);
        score.setCard(card);
        score.setCalculationDate(LocalDateTime.now());

        // Get all active thresholds
        List<SpendThreshold> thresholds = spendThresholdRepository
                .findByCardAndStatus(card, SpendThreshold.ThresholdStatus.ACTIVE);

        Map<SpendThreshold.ThresholdType, ThresholdProgress> progressMap = new HashMap<>();
        
        for (SpendThreshold threshold : thresholds) {
            ThresholdProgress progress = new ThresholdProgress();
            progress.setThresholdType(threshold.getThresholdType());
            progress.setCurrentSpend(threshold.getCurrentSpend());
            progress.setThresholdAmount(threshold.getThresholdAmount());
            progress.setProgressPercentage(threshold.getProgressPercentage());
            progress.setRemainingAmount(threshold.getRemainingAmount());
            progress.setIsCompleted(threshold.isThresholdMet());
            progress.setResetDate(threshold.getResetDate());
            
            progressMap.put(threshold.getThresholdType(), progress);
        }

        score.setThresholdProgress(progressMap);
        
        // Calculate overall score (0-100)
        int overallScore = calculateOverallScore(progressMap);
        score.setOverallScore(overallScore);
        
        return score;
    }

    private int calculateOverallScore(Map<SpendThreshold.ThresholdType, ThresholdProgress> progressMap) {
        if (progressMap.isEmpty()) {
            return 0;
        }

        BigDecimal totalProgress = BigDecimal.ZERO;
        int count = 0;

        for (ThresholdProgress progress : progressMap.values()) {
            totalProgress = totalProgress.add(progress.getProgressPercentage());
            count++;
        }

        return totalProgress.divide(BigDecimal.valueOf(count), 0, RoundingMode.HALF_UP).intValue();
    }

    // Inner classes
    public static class SpendScore {
        private Customer customer;
        private Card card;
        private LocalDateTime calculationDate;
        private int overallScore;
        private Map<SpendThreshold.ThresholdType, ThresholdProgress> thresholdProgress;

        // Getters and setters
        public Customer getCustomer() { return customer; }
        public void setCustomer(Customer customer) { this.customer = customer; }

        public Card getCard() { return card; }
        public void setCard(Card card) { this.card = card; }

        public LocalDateTime getCalculationDate() { return calculationDate; }
        public void setCalculationDate(LocalDateTime calculationDate) { this.calculationDate = calculationDate; }

        public int getOverallScore() { return overallScore; }
        public void setOverallScore(int overallScore) { this.overallScore = overallScore; }

        public Map<SpendThreshold.ThresholdType, ThresholdProgress> getThresholdProgress() { return thresholdProgress; }
        public void setThresholdProgress(Map<SpendThreshold.ThresholdType, ThresholdProgress> thresholdProgress) { this.thresholdProgress = thresholdProgress; }
    }

    public static class ThresholdProgress {
        private SpendThreshold.ThresholdType thresholdType;
        private BigDecimal currentSpend;
        private BigDecimal thresholdAmount;
        private BigDecimal progressPercentage;
        private BigDecimal remainingAmount;
        private boolean isCompleted;
        private LocalDate resetDate;

        // Getters and setters
        public SpendThreshold.ThresholdType getThresholdType() { return thresholdType; }
        public void setThresholdType(SpendThreshold.ThresholdType thresholdType) { this.thresholdType = thresholdType; }

        public BigDecimal getCurrentSpend() { return currentSpend; }
        public void setCurrentSpend(BigDecimal currentSpend) { this.currentSpend = currentSpend; }

        public BigDecimal getThresholdAmount() { return thresholdAmount; }
        public void setThresholdAmount(BigDecimal thresholdAmount) { this.thresholdAmount = thresholdAmount; }

        public BigDecimal getProgressPercentage() { return progressPercentage; }
        public void setProgressPercentage(BigDecimal progressPercentage) { this.progressPercentage = progressPercentage; }

        public BigDecimal getRemainingAmount() { return remainingAmount; }
        public void setRemainingAmount(BigDecimal remainingAmount) { this.remainingAmount = remainingAmount; }

        public boolean isCompleted() { return isCompleted; }
        public void setIsCompleted(boolean completed) { isCompleted = completed; }

        public LocalDate getResetDate() { return resetDate; }
        public void setResetDate(LocalDate resetDate) { this.resetDate = resetDate; }
    }

    public static class SpendAnalysis {
        private String merchantCategoryCode;
        private int transactionCount;
        private BigDecimal totalAmount;
        private BigDecimal averageTransactionAmount;

        // Getters and setters
        public String getMerchantCategoryCode() { return merchantCategoryCode; }
        public void setMerchantCategoryCode(String merchantCategoryCode) { this.merchantCategoryCode = merchantCategoryCode; }

        public int getTransactionCount() { return transactionCount; }
        public void setTransactionCount(int transactionCount) { this.transactionCount = transactionCount; }

        public BigDecimal getTotalAmount() { return totalAmount; }
        public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

        public BigDecimal getAverageTransactionAmount() { return averageTransactionAmount; }
        public void setAverageTransactionAmount(BigDecimal averageTransactionAmount) { this.averageTransactionAmount = averageTransactionAmount; }
    }

    public static class SpendVelocity {
        private BigDecimal last30DaysSpend;
        private BigDecimal previous30DaysSpend;
        private BigDecimal changePercentage;
        private BigDecimal dailyAverageSpend;

        // Getters and setters
        public BigDecimal getLast30DaysSpend() { return last30DaysSpend; }
        public void setLast30DaysSpend(BigDecimal last30DaysSpend) { this.last30DaysSpend = last30DaysSpend; }

        public BigDecimal getPrevious30DaysSpend() { return previous30DaysSpend; }
        public void setPrevious30DaysSpend(BigDecimal previous30DaysSpend) { this.previous30DaysSpend = previous30DaysSpend; }

        public BigDecimal getChangePercentage() { return changePercentage; }
        public void setChangePercentage(BigDecimal changePercentage) { this.changePercentage = changePercentage; }

        public BigDecimal getDailyAverageSpend() { return dailyAverageSpend; }
        public void setDailyAverageSpend(BigDecimal dailyAverageSpend) { this.dailyAverageSpend = dailyAverageSpend; }
    }
}