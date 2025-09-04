// Advanced Incident Analysis Engine
class IncidentAnalyzer {
    constructor() {
        this.errorPatterns = {
            'TypeError': {
                category: 'Runtime Error',
                severity: 'High',
                commonCauses: ['Null/undefined reference', 'Type mismatch', 'Missing property access']
            },
            'ReferenceError': {
                category: 'Runtime Error', 
                severity: 'High',
                commonCauses: ['Undefined variable', 'Scope issues', 'Missing imports']
            },
            'SyntaxError': {
                category: 'Code Error',
                severity: 'Critical',
                commonCauses: ['Invalid syntax', 'Missing brackets', 'Malformed expressions']
            },
            '500': {
                category: 'Server Error',
                severity: 'Critical',
                commonCauses: ['Internal server error', 'Database connection', 'Unhandled exceptions']
            },
            '404': {
                category: 'Client Error',
                severity: 'Medium',
                commonCauses: ['Resource not found', 'Routing issues', 'Missing endpoints']
            },
            'Database': {
                category: 'Infrastructure',
                severity: 'High',
                commonCauses: ['Connection timeout', 'Query errors', 'Schema issues']
            }
        };
    }

    analyzeIncident(logText) {
        const analysis = {
            incidentId: this.generateIncidentId(),
            timestamp: new Date().toISOString(),
            originalLog: logText,
            parsedData: this.parseLogEntry(logText),
            rootCauseAnalysis: this.performRootCauseAnalysis(logText),
            impactAssessment: this.assessImpact(logText),
            resolutionSteps: this.generateResolutionSteps(logText),
            preventionMeasures: this.suggestPreventionMeasures(logText),
            relatedIncidents: this.findRelatedIncidents(logText),
            monitoringRecommendations: this.getMonitoringRecommendations(logText)
        };

        return analysis;
    }

    generateIncidentId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `INC-${timestamp}-${random}`.toUpperCase();
    }

    parseLogEntry(logText) {
        const parsed = {
            timestamp: null,
            level: null,
            statusCode: null,
            errorType: null,
            message: null,
            stackTrace: null,
            requestId: null,
            userId: null,
            sessionId: null,
            service: null,
            file: null,
            line: null,
            method: null
        };

        // Extract timestamp
        const timestampMatch = logText.match(/\[([\d-T:.Z]+)\]/);
        if (timestampMatch) parsed.timestamp = timestampMatch[1];

        // Extract log level
        const levelMatch = logText.match(/(ERROR|WARN|INFO|DEBUG|FATAL)/i);
        if (levelMatch) parsed.level = levelMatch[1].toUpperCase();

        // Extract status code
        const statusMatch = logText.match(/(\d{3})\s*-/);
        if (statusMatch) parsed.statusCode = statusMatch[1];

        // Extract error type
        const errorTypeMatch = logText.match(/(TypeError|ReferenceError|SyntaxError|Error)/);
        if (errorTypeMatch) parsed.errorType = errorTypeMatch[1];

        // Extract message
        const messageMatch = logText.match(/ERROR:\s*\d*\s*-\s*(.+?)(?:\n|Trace:)/);
        if (messageMatch) parsed.message = messageMatch[1].trim();

        // Extract stack trace
        const traceMatch = logText.match(/Trace:\s*(.+?)(?:\n|Request ID:)/);
        if (traceMatch) parsed.stackTrace = traceMatch[1].trim();

        // Extract request/user/session IDs
        const requestIdMatch = logText.match(/Request ID:\s*([^\s|]+)/);
        if (requestIdMatch) parsed.requestId = requestIdMatch[1];

        const userIdMatch = logText.match(/User ID:\s*([^\s|]+)/);
        if (userIdMatch) parsed.userId = userIdMatch[1];

        const sessionIdMatch = logText.match(/Session ID:\s*([^\s|]+)/);
        if (sessionIdMatch) parsed.sessionId = sessionIdMatch[1];

        // Extract file and line info
        const fileMatch = logText.match(/at\s+\w+\s*\(\s*([^:]+):(\d+):(\d+)/);
        if (fileMatch) {
            parsed.file = fileMatch[1];
            parsed.line = fileMatch[2];
        }

        // Extract method name
        const methodMatch = logText.match(/at\s+(\w+)\s*\(/);
        if (methodMatch) parsed.method = methodMatch[1];

        return parsed;
    }

    performRootCauseAnalysis(logText) {
        const analysis = {
            primaryCause: null,
            contributingFactors: [],
            technicalDetails: {},
            businessImpact: null,
            affectedComponents: []
        };

        // Analyze for null pointer errors
        if (logText.includes('Cannot read properties of null')) {
            analysis.primaryCause = 'Null Pointer Exception';
            analysis.contributingFactors = [
                'User profile data not properly initialized',
                'Database query returned null result',
                'Missing null checks in payment processing logic'
            ];
            analysis.technicalDetails = {
                errorLocation: 'processPayment function',
                failedOperation: 'Reading userProfile property',
                dataState: 'userProfile object is null/undefined'
            };
            analysis.businessImpact = 'Payment processing failures affecting customer transactions';
            analysis.affectedComponents = ['Payment Service', 'User Management', 'Database Layer'];
        }

        // Analyze for 500 errors
        if (logText.includes('500') && logText.includes('Internal Server Error')) {
            analysis.primaryCause = 'Unhandled Server Exception';
            analysis.contributingFactors.push(
                'Exception not properly caught and handled',
                'Missing error boundaries in application code',
                'Insufficient input validation'
            );
        }

        // Analyze for database issues
        if (logText.toLowerCase().includes('database') || logText.includes('connection')) {
            analysis.contributingFactors.push(
                'Database connection pool exhaustion',
                'Network connectivity issues',
                'Database server overload'
            );
            analysis.affectedComponents.push('Database Connection Pool');
        }

        return analysis;
    }

    assessImpact(logText) {
        return {
            severity: this.determineSeverity(logText),
            userImpact: this.assessUserImpact(logText),
            systemImpact: this.assessSystemImpact(logText),
            businessImpact: this.assessBusinessImpact(logText),
            estimatedAffectedUsers: this.estimateAffectedUsers(logText),
            downtime: this.estimateDowntime(logText)
        };
    }

    determineSeverity(logText) {
        if (logText.includes('500') || logText.includes('FATAL') || logText.includes('CRITICAL')) {
            return 'Critical';
        } else if (logText.includes('ERROR') || logText.includes('TypeError')) {
            return 'High';
        } else if (logText.includes('WARN')) {
            return 'Medium';
        }
        return 'Low';
    }

    assessUserImpact(logText) {
        if (logText.includes('payment') || logText.includes('processPayment')) {
            return 'Users unable to complete payment transactions';
        }
        return 'Potential service degradation for affected users';
    }

    assessSystemImpact(logText) {
        return 'Payment processing service experiencing failures, potential cascade to dependent services';
    }

    assessBusinessImpact(logText) {
        if (logText.includes('payment')) {
            return 'Revenue loss due to failed payment transactions, potential customer churn';
        }
        return 'Service reliability concerns, potential SLA violations';
    }

    estimateAffectedUsers(logText) {
        // Simple estimation based on error type
        if (logText.includes('payment')) {
            return 'Estimated 15-25% of users attempting payments';
        }
        return 'Estimated 5-10% of active users';
    }

    estimateDowntime(logText) {
        if (logText.includes('500')) {
            return 'Partial service outage - 15-30 minutes estimated resolution';
        }
        return 'Service degradation - 5-15 minutes estimated resolution';
    }

    generateResolutionSteps(logText) {
        const steps = [];

        if (logText.includes('Cannot read properties of null')) {
            steps.push({
                step: 1,
                action: 'Immediate Hotfix',
                description: 'Add null check before accessing userProfile properties',
                code: `if (userProfile && userProfile.id) {\n    // Process payment\n} else {\n    throw new Error('User profile not found');\n}`,
                priority: 'Critical',
                estimatedTime: '15 minutes'
            });

            steps.push({
                step: 2,
                action: 'Data Validation',
                description: 'Verify user profile data retrieval from database',
                code: `const userProfile = await getUserProfile(userId);\nif (!userProfile) {\n    logger.error('User profile not found', { userId });\n    return res.status(404).json({ error: 'User not found' });\n}`,
                priority: 'High',
                estimatedTime: '30 minutes'
            });

            steps.push({
                step: 3,
                action: 'Error Handling Enhancement',
                description: 'Implement comprehensive error handling in payment flow',
                code: `try {\n    const result = await processPayment(userProfile, paymentData);\n    return result;\n} catch (error) {\n    logger.error('Payment processing failed', { error, userId });\n    throw new PaymentProcessingError('Payment failed', error);\n}`,
                priority: 'Medium',
                estimatedTime: '45 minutes'
            });
        }

        steps.push({
            step: steps.length + 1,
            action: 'Monitoring Setup',
            description: 'Add monitoring alerts for similar errors',
            code: `// CloudWatch alarm for payment errors\nconst alarm = new cloudwatch.Alarm({\n    metricName: 'PaymentErrors',\n    threshold: 5,\n    comparisonOperator: 'GreaterThanThreshold'\n});`,
            priority: 'Low',
            estimatedTime: '20 minutes'
        });

        return steps;
    }

    suggestPreventionMeasures(logText) {
        const measures = [];

        if (logText.includes('null') || logText.includes('undefined')) {
            measures.push({
                category: 'Code Quality',
                measure: 'Implement strict null checks',
                description: 'Use TypeScript strict null checks and optional chaining',
                implementation: 'Enable strictNullChecks in tsconfig.json, use obj?.property syntax'
            });

            measures.push({
                category: 'Testing',
                measure: 'Add null/undefined test cases',
                description: 'Create unit tests that verify behavior with null/undefined inputs',
                implementation: 'Write Jest tests covering edge cases with missing data'
            });
        }

        measures.push({
            category: 'Monitoring',
            measure: 'Enhanced error tracking',
            description: 'Implement comprehensive error logging and alerting',
            implementation: 'Use structured logging with correlation IDs, set up real-time alerts'
        });

        measures.push({
            category: 'Architecture',
            measure: 'Circuit breaker pattern',
            description: 'Implement circuit breakers for external service calls',
            implementation: 'Use libraries like Hystrix or implement custom circuit breaker logic'
        });

        return measures;
    }

    findRelatedIncidents(logText) {
        // Simulate finding related incidents
        return [
            {
                incidentId: 'INC-2024-0728-001',
                timestamp: '2024-07-28T14:23:15Z',
                similarity: 'High',
                description: 'Similar null pointer exception in user profile service',
                status: 'Resolved'
            },
            {
                incidentId: 'INC-2024-0725-003',
                timestamp: '2024-07-25T09:15:42Z',
                similarity: 'Medium',
                description: 'Payment processing timeout errors',
                status: 'Resolved'
            }
        ];
    }

    getMonitoringRecommendations(logText) {
        return [
            {
                type: 'Application Metrics',
                metric: 'Payment Success Rate',
                threshold: '< 95%',
                action: 'Alert DevOps team immediately'
            },
            {
                type: 'Error Rate',
                metric: 'TypeError Occurrences',
                threshold: '> 5 per minute',
                action: 'Trigger automated rollback'
            },
            {
                type: 'Performance',
                metric: 'Payment Processing Latency',
                threshold: '> 5 seconds',
                action: 'Scale payment service instances'
            },
            {
                type: 'Infrastructure',
                metric: 'Database Connection Pool',
                threshold: '> 80% utilization',
                action: 'Increase connection pool size'
            }
        ];
    }
}

// Export for use in main application
window.IncidentAnalyzer = IncidentAnalyzer;