package com.cardlinked.benefits.rules.service;

import com.cardlinked.benefits.rules.entity.Rule;
import com.cardlinked.benefits.rules.repository.RuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class RulesEngineService {

    private final RuleRepository ruleRepository;

    @Autowired
    public RulesEngineService(RuleRepository ruleRepository) {
        this.ruleRepository = ruleRepository;
    }

    /**
     * Execute rules for a given context
     */
    public RuleExecutionResult executeRules(Rule.RuleType ruleType, Map<String, Object> context) {
        List<Rule> applicableRules = ruleRepository.findByRuleTypeAndStatusOrderByPriorityDesc(
            ruleType, Rule.RuleStatus.ACTIVE);

        RuleExecutionResult result = new RuleExecutionResult();
        result.setExecutionTime(LocalDateTime.now());
        result.setContext(context);

        List<RuleExecution> executions = new ArrayList<>();

        for (Rule rule : applicableRules) {
            RuleExecution execution = executeRule(rule, context);
            executions.add(execution);

            // If rule matched and has stop-on-match flag, break
            if (execution.isMatched() && isStopOnMatch(rule)) {
                break;
            }
        }

        result.setRuleExecutions(executions);
        result.setSuccess(true);

        return result;
    }

    /**
     * Create a new rule with validation
     */
    public Rule createRule(Rule rule) {
        validateRule(rule);
        
        if (rule.getRuleId() == null) {
            rule.setRuleId(UUID.randomUUID().toString());
        }

        return ruleRepository.save(rule);
    }

    /**
     * Update existing rule
     */
    public Rule updateRule(String ruleId, Rule updatedRule) {
        Rule existingRule = ruleRepository.findById(ruleId)
                .orElseThrow(() -> new RuntimeException("Rule not found: " + ruleId));

        validateRule(updatedRule);

        existingRule.setName(updatedRule.getName());
        existingRule.setDescription(updatedRule.getDescription());
        existingRule.setConditions(updatedRule.getConditions());
        existingRule.setActions(updatedRule.getActions());
        existingRule.setPriority(updatedRule.getPriority());
        existingRule.setCategory(updatedRule.getCategory());

        return ruleRepository.save(existingRule);
    }

    /**
     * Activate rule
     */
    public Rule activateRule(String ruleId) {
        Rule rule = ruleRepository.findById(ruleId)
                .orElseThrow(() -> new RuntimeException("Rule not found: " + ruleId));

        validateRuleForActivation(rule);
        rule.setStatus(Rule.RuleStatus.ACTIVE);

        return ruleRepository.save(rule);
    }

    /**
     * Deactivate rule
     */
    public Rule deactivateRule(String ruleId) {
        Rule rule = ruleRepository.findById(ruleId)
                .orElseThrow(() -> new RuntimeException("Rule not found: " + ruleId));

        rule.setStatus(Rule.RuleStatus.INACTIVE);
        return ruleRepository.save(rule);
    }

    /**
     * Test rule against context without executing actions
     */
    public RuleTestResult testRule(String ruleId, Map<String, Object> testContext) {
        Rule rule = ruleRepository.findById(ruleId)
                .orElseThrow(() -> new RuntimeException("Rule not found: " + ruleId));

        RuleExecution execution = executeRule(rule, testContext);
        
        RuleTestResult testResult = new RuleTestResult();
        testResult.setRule(rule);
        testResult.setTestContext(testContext);
        testResult.setMatched(execution.isMatched());
        testResult.setEvaluationDetails(execution.getEvaluationDetails());
        testResult.setExecutionTime(LocalDateTime.now());

        return testResult;
    }

    /**
     * Get rules by category
     */
    public List<Rule> getRulesByCategory(String category) {
        return ruleRepository.findByCategoryAndStatus(category, Rule.RuleStatus.ACTIVE);
    }

    /**
     * Analyze rule conflicts
     */
    public List<RuleConflict> analyzeRuleConflicts(Rule.RuleType ruleType) {
        List<Rule> rules = ruleRepository.findByRuleTypeAndStatusOrderByPriorityDesc(
            ruleType, Rule.RuleStatus.ACTIVE);

        List<RuleConflict> conflicts = new ArrayList<>();

        for (int i = 0; i < rules.size(); i++) {
            for (int j = i + 1; j < rules.size(); j++) {
                Rule rule1 = rules.get(i);
                Rule rule2 = rules.get(j);

                RuleConflict conflict = detectConflict(rule1, rule2);
                if (conflict != null) {
                    conflicts.add(conflict);
                }
            }
        }

        return conflicts;
    }

    // Private helper methods
    private RuleExecution executeRule(Rule rule, Map<String, Object> context) {
        RuleExecution execution = new RuleExecution();
        execution.setRule(rule);
        execution.setExecutionTime(LocalDateTime.now());

        try {
            // Evaluate conditions
            boolean conditionsMatch = evaluateConditions(rule.getConditions(), context);
            execution.setMatched(conditionsMatch);

            Map<String, Object> evaluationDetails = new HashMap<>();
            evaluationDetails.put("conditionsEvaluated", rule.getConditions());
            evaluationDetails.put("contextUsed", context);
            execution.setEvaluationDetails(evaluationDetails);

            if (conditionsMatch) {
                // Execute actions
                Map<String, Object> actionResults = executeActions(rule.getActions(), context);
                execution.setActionResults(actionResults);
            }

            execution.setSuccess(true);

        } catch (Exception e) {
            execution.setSuccess(false);
            execution.setErrorMessage(e.getMessage());
        }

        return execution;
    }

    private boolean evaluateConditions(Map<String, Object> conditions, Map<String, Object> context) {
        if (conditions == null || conditions.isEmpty()) {
            return true; // No conditions means always match
        }

        // Handle logical operators
        if (conditions.containsKey("AND")) {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> andConditions = (List<Map<String, Object>>) conditions.get("AND");
            return andConditions.stream().allMatch(condition -> evaluateConditions(condition, context));
        }

        if (conditions.containsKey("OR")) {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> orConditions = (List<Map<String, Object>>) conditions.get("OR");
            return orConditions.stream().anyMatch(condition -> evaluateConditions(condition, context));
        }

        // Evaluate individual conditions
        for (Map.Entry<String, Object> condition : conditions.entrySet()) {
            String field = condition.getKey();
            Object expectedValue = condition.getValue();

            if (!evaluateFieldCondition(field, expectedValue, context)) {
                return false;
            }
        }

        return true;
    }

    private boolean evaluateFieldCondition(String field, Object expectedValue, Map<String, Object> context) {
        Object actualValue = getNestedValue(context, field);

        if (expectedValue instanceof Map) {
            @SuppressWarnings("unchecked")
            Map<String, Object> operatorMap = (Map<String, Object>) expectedValue;

            for (Map.Entry<String, Object> operator : operatorMap.entrySet()) {
                String op = operator.getKey();
                Object opValue = operator.getValue();

                switch (op) {
                    case "equals":
                        return Objects.equals(actualValue, opValue);
                    case "greaterThan":
                        return compareValues(actualValue, opValue) > 0;
                    case "lessThan":
                        return compareValues(actualValue, opValue) < 0;
                    case "greaterThanOrEqual":
                        return compareValues(actualValue, opValue) >= 0;
                    case "lessThanOrEqual":
                        return compareValues(actualValue, opValue) <= 0;
                    case "in":
                        @SuppressWarnings("unchecked")
                        List<Object> values = (List<Object>) opValue;
                        return values.contains(actualValue);
                    case "contains":
                        return actualValue != null && actualValue.toString().contains(opValue.toString());
                    case "startsWith":
                        return actualValue != null && actualValue.toString().startsWith(opValue.toString());
                    case "endsWith":
                        return actualValue != null && actualValue.toString().endsWith(opValue.toString());
                }
            }
        } else {
            return Objects.equals(actualValue, expectedValue);
        }

        return false;
    }

    private Object getNestedValue(Map<String, Object> context, String field) {
        String[] parts = field.split("\\.");
        Object current = context;

        for (String part : parts) {
            if (current instanceof Map) {
                @SuppressWarnings("unchecked")
                Map<String, Object> map = (Map<String, Object>) current;
                current = map.get(part);
            } else {
                return null;
            }
        }

        return current;
    }

    private int compareValues(Object actual, Object expected) {
        if (actual instanceof Number && expected instanceof Number) {
            BigDecimal actualDecimal = new BigDecimal(actual.toString());
            BigDecimal expectedDecimal = new BigDecimal(expected.toString());
            return actualDecimal.compareTo(expectedDecimal);
        }

        if (actual instanceof Comparable && expected instanceof Comparable) {
            @SuppressWarnings("unchecked")
            Comparable<Object> comparableActual = (Comparable<Object>) actual;
            return comparableActual.compareTo(expected);
        }

        return 0;
    }

    private Map<String, Object> executeActions(Map<String, Object> actions, Map<String, Object> context) {
        Map<String, Object> results = new HashMap<>();

        if (actions == null || actions.isEmpty()) {
            return results;
        }

        for (Map.Entry<String, Object> action : actions.entrySet()) {
            String actionType = action.getKey();
            Object actionConfig = action.getValue();

            Object result = executeAction(actionType, actionConfig, context);
            results.put(actionType, result);
        }

        return results;
    }

    private Object executeAction(String actionType, Object actionConfig, Map<String, Object> context) {
        switch (actionType) {
            case "setField":
                @SuppressWarnings("unchecked")
                Map<String, Object> setConfig = (Map<String, Object>) actionConfig;
                String field = (String) setConfig.get("field");
                Object value = setConfig.get("value");
                context.put(field, value);
                return value;

            case "calculate":
                @SuppressWarnings("unchecked")
                Map<String, Object> calcConfig = (Map<String, Object>) actionConfig;
                return performCalculation(calcConfig, context);

            case "log":
                String message = actionConfig.toString();
                System.out.println("Rule Action Log: " + message);
                return message;

            default:
                return "Unknown action: " + actionType;
        }
    }

    private Object performCalculation(Map<String, Object> calcConfig, Map<String, Object> context) {
        String operation = (String) calcConfig.get("operation");
        String field1 = (String) calcConfig.get("field1");
        String field2 = (String) calcConfig.get("field2");
        Object value1 = calcConfig.containsKey("value1") ? calcConfig.get("value1") : getNestedValue(context, field1);
        Object value2 = calcConfig.containsKey("value2") ? calcConfig.get("value2") : getNestedValue(context, field2);

        if (value1 instanceof Number && value2 instanceof Number) {
            BigDecimal num1 = new BigDecimal(value1.toString());
            BigDecimal num2 = new BigDecimal(value2.toString());

            switch (operation) {
                case "add":
                    return num1.add(num2);
                case "subtract":
                    return num1.subtract(num2);
                case "multiply":
                    return num1.multiply(num2);
                case "divide":
                    return num2.compareTo(BigDecimal.ZERO) != 0 ? num1.divide(num2, 2, BigDecimal.ROUND_HALF_UP) : BigDecimal.ZERO;
                case "percentage":
                    return num1.multiply(num2).divide(BigDecimal.valueOf(100), 2, BigDecimal.ROUND_HALF_UP);
            }
        }

        return null;
    }

    private void validateRule(Rule rule) {
        if (rule.getName() == null || rule.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Rule name is required");
        }

        if (rule.getRuleType() == null) {
            throw new IllegalArgumentException("Rule type is required");
        }

        // Validate conditions structure
        if (rule.getConditions() != null) {
            validateConditionsStructure(rule.getConditions());
        }

        // Validate actions structure
        if (rule.getActions() != null) {
            validateActionsStructure(rule.getActions());
        }
    }

    private void validateConditionsStructure(Map<String, Object> conditions) {
        // Basic validation - can be extended
        if (conditions.containsKey("AND") && conditions.containsKey("OR")) {
            throw new IllegalArgumentException("Cannot have both AND and OR at the same level");
        }
    }

    private void validateActionsStructure(Map<String, Object> actions) {
        // Basic validation - can be extended
        for (String actionType : actions.keySet()) {
            if (!Arrays.asList("setField", "calculate", "log", "notify").contains(actionType)) {
                throw new IllegalArgumentException("Unknown action type: " + actionType);
            }
        }
    }

    private void validateRuleForActivation(Rule rule) {
        validateRule(rule);
        
        if (rule.getConditions() == null || rule.getConditions().isEmpty()) {
            throw new IllegalArgumentException("Rule must have conditions to be activated");
        }
    }

    private boolean isStopOnMatch(Rule rule) {
        Map<String, Object> actions = rule.getActions();
        if (actions != null && actions.containsKey("stopOnMatch")) {
            return Boolean.TRUE.equals(actions.get("stopOnMatch"));
        }
        return false;
    }

    private RuleConflict detectConflict(Rule rule1, Rule rule2) {
        // Simple conflict detection - can be enhanced
        if (rule1.getPriority().equals(rule2.getPriority()) && 
            rule1.getRuleType() == rule2.getRuleType()) {
            
            RuleConflict conflict = new RuleConflict();
            conflict.setRule1(rule1);
            conflict.setRule2(rule2);
            conflict.setConflictType("PRIORITY_CONFLICT");
            conflict.setDescription("Rules have the same priority and type");
            return conflict;
        }
        
        return null;
    }

    // Inner classes for results
    public static class RuleExecutionResult {
        private LocalDateTime executionTime;
        private Map<String, Object> context;
        private List<RuleExecution> ruleExecutions;
        private boolean success;

        // Getters and setters
        public LocalDateTime getExecutionTime() { return executionTime; }
        public void setExecutionTime(LocalDateTime executionTime) { this.executionTime = executionTime; }

        public Map<String, Object> getContext() { return context; }
        public void setContext(Map<String, Object> context) { this.context = context; }

        public List<RuleExecution> getRuleExecutions() { return ruleExecutions; }
        public void setRuleExecutions(List<RuleExecution> ruleExecutions) { this.ruleExecutions = ruleExecutions; }

        public boolean isSuccess() { return success; }
        public void setSuccess(boolean success) { this.success = success; }
    }

    public static class RuleExecution {
        private Rule rule;
        private LocalDateTime executionTime;
        private boolean matched;
        private boolean success;
        private Map<String, Object> evaluationDetails;
        private Map<String, Object> actionResults;
        private String errorMessage;

        // Getters and setters
        public Rule getRule() { return rule; }
        public void setRule(Rule rule) { this.rule = rule; }

        public LocalDateTime getExecutionTime() { return executionTime; }
        public void setExecutionTime(LocalDateTime executionTime) { this.executionTime = executionTime; }

        public boolean isMatched() { return matched; }
        public void setMatched(boolean matched) { this.matched = matched; }

        public boolean isSuccess() { return success; }
        public void setSuccess(boolean success) { this.success = success; }

        public Map<String, Object> getEvaluationDetails() { return evaluationDetails; }
        public void setEvaluationDetails(Map<String, Object> evaluationDetails) { this.evaluationDetails = evaluationDetails; }

        public Map<String, Object> getActionResults() { return actionResults; }
        public void setActionResults(Map<String, Object> actionResults) { this.actionResults = actionResults; }

        public String getErrorMessage() { return errorMessage; }
        public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
    }

    public static class RuleTestResult {
        private Rule rule;
        private Map<String, Object> testContext;
        private boolean matched;
        private Map<String, Object> evaluationDetails;
        private LocalDateTime executionTime;

        // Getters and setters
        public Rule getRule() { return rule; }
        public void setRule(Rule rule) { this.rule = rule; }

        public Map<String, Object> getTestContext() { return testContext; }
        public void setTestContext(Map<String, Object> testContext) { this.testContext = testContext; }

        public boolean isMatched() { return matched; }
        public void setMatched(boolean matched) { this.matched = matched; }

        public Map<String, Object> getEvaluationDetails() { return evaluationDetails; }
        public void setEvaluationDetails(Map<String, Object> evaluationDetails) { this.evaluationDetails = evaluationDetails; }

        public LocalDateTime getExecutionTime() { return executionTime; }
        public void setExecutionTime(LocalDateTime executionTime) { this.executionTime = executionTime; }
    }

    public static class RuleConflict {
        private Rule rule1;
        private Rule rule2;
        private String conflictType;
        private String description;

        // Getters and setters
        public Rule getRule1() { return rule1; }
        public void setRule1(Rule rule1) { this.rule1 = rule1; }

        public Rule getRule2() { return rule2; }
        public void setRule2(Rule rule2) { this.rule2 = rule2; }

        public String getConflictType() { return conflictType; }
        public void setConflictType(String conflictType) { this.conflictType = conflictType; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }
}