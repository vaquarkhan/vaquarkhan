// AWS Cost API Backend Integration
const AWS = require('aws-sdk');

class AWSCostAPIBackend {
    constructor() {
        this.costExplorer = new AWS.CostExplorer({ region: 'us-east-1' });
        this.support = new AWS.Support({ region: 'us-east-1' });
    }

    async getCostAndUsageData() {
        try {
            const endDate = new Date().toISOString().split('T')[0];
            const startDate = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

            const params = {
                TimePeriod: {
                    Start: startDate,
                    End: endDate
                },
                Granularity: 'MONTHLY',
                Metrics: ['BlendedCost'],
                GroupBy: [
                    {
                        Type: 'DIMENSION',
                        Key: 'SERVICE'
                    }
                ]
            };

            const result = await this.costExplorer.getCostAndUsage(params).promise();
            
            return this.formatCostData(result);
        } catch (error) {
            console.error('Error fetching AWS cost data:', error);
            throw error;
        }
    }

    formatCostData(rawData) {
        const monthlyTrend = [];
        const services = {};

        rawData.ResultsByTime.forEach(timeResult => {
            const month = new Date(timeResult.TimePeriod.Start).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short' 
            });
            
            const totalCost = parseFloat(timeResult.Total.BlendedCost.Amount);
            monthlyTrend.push({
                month: month,
                cost: totalCost.toFixed(2)
            });

            // Aggregate services for the latest month
            if (timeResult === rawData.ResultsByTime[rawData.ResultsByTime.length - 1]) {
                timeResult.Groups.forEach(group => {
                    const serviceName = group.Keys[0];
                    const cost = parseFloat(group.Metrics.BlendedCost.Amount);
                    
                    if (cost > 1) { // Only include services with cost > $1
                        services[serviceName] = cost.toFixed(2);
                    }
                });
            }
        });

        return {
            monthlyTrend: monthlyTrend,
            services: services,
            totalCurrentCost: monthlyTrend[monthlyTrend.length - 1]?.cost || '0.00'
        };
    }

    async getTrustedAdvisorData() {
        try {
            const checks = await this.support.describeTrustedAdvisorChecks({
                language: 'en'
            }).promise();

            const costOptimizationChecks = checks.checks.filter(
                check => check.category === 'cost_optimizing'
            );

            const checkResults = [];
            for (const check of costOptimizationChecks) {
                try {
                    const result = await this.support.describeTrustedAdvisorCheckResult({
                        checkId: check.id,
                        language: 'en'
                    }).promise();
                    
                    checkResults.push({
                        name: check.name,
                        description: check.description,
                        status: result.result.status,
                        resourcesSummary: result.result.resourcesSummary,
                        flaggedResources: result.result.flaggedResources || []
                    });
                } catch (checkError) {
                    console.warn(`Could not fetch check ${check.name}:`, checkError.message);
                }
            }

            return checkResults;
        } catch (error) {
            console.error('Error fetching Trusted Advisor data:', error);
            return [];
        }
    }
}

// Express.js API endpoint
const express = require('express');
const app = express();

app.get('/api/aws-cost-data', async (req, res) => {
    try {
        const awsAPI = new AWSCostAPIBackend();
        const costData = await awsAPI.getCostAndUsageData();
        const trustedAdvisorData = await awsAPI.getTrustedAdvisorData();
        
        res.json({
            ...costData,
            trustedAdvisor: trustedAdvisorData,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({
            error: 'Failed to fetch AWS cost data',
            message: error.message
        });
    }
});

module.exports = { AWSCostAPIBackend, app };