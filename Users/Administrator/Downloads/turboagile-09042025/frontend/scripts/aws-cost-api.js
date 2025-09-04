// AWS Cost API Integration
class AWSCostAnalyzer {
    constructor(config) {
        this.config = config;
        this.baseURL = 'https://ce.amazonaws.com';
        this.supportURL = 'https://support.amazonaws.com';
    }

    async getCostAndUsage() {
        const params = {
            TimePeriod: {
                Start: this.getDateMonthsAgo(6),
                End: this.getTodayDate()
            },
            Granularity: 'MONTHLY',
            Metrics: ['BlendedCost', 'UsageQuantity'],
            GroupBy: [
                { Type: 'DIMENSION', Key: 'SERVICE' },
                { Type: 'DIMENSION', Key: 'LINKED_ACCOUNT' }
            ]
        };

        // Simulate real AWS Cost Explorer API response
        return {
            ResultsByTime: [
                {
                    TimePeriod: { Start: '2024-03-01', End: '2024-03-31' },
                    Total: { BlendedCost: { Amount: '617.47', Unit: 'USD' } },
                    Groups: [
                        { Keys: ['Amazon Elastic Compute Cloud - Compute'], Metrics: { BlendedCost: { Amount: '225.34' } } },
                        { Keys: ['Amazon QuickSight'], Metrics: { BlendedCost: { Amount: '142.67' } } },
                        { Keys: ['Amazon Relational Database Service'], Metrics: { BlendedCost: { Amount: '89.23' } } }
                    ]
                },
                {
                    TimePeriod: { Start: '2024-08-01', End: '2024-08-31' },
                    Total: { BlendedCost: { Amount: '672.97', Unit: 'USD' } },
                    Groups: [
                        { Keys: ['Amazon Elastic Compute Cloud - Compute'], Metrics: { BlendedCost: { Amount: '245.32' } } },
                        { Keys: ['Amazon QuickSight'], Metrics: { BlendedCost: { Amount: '156.78' } } },
                        { Keys: ['Elastic Load Balancing'], Metrics: { BlendedCost: { Amount: '89.45' } } }
                    ]
                }
            ]
        };
    }

    async getRightsizingRecommendations() {
        // Simulate AWS Cost Explorer Rightsizing API
        return {
            RightsizingRecommendations: [
                {
                    AccountId: '123456789012',
                    CurrentInstance: {
                        ResourceId: 'i-1234567890abcdef0',
                        InstanceName: 'web-server-prod',
                        Tags: { Environment: 'Production', Team: 'DevOps' },
                        ResourceDetails: {
                            EC2ResourceDetails: {
                                InstanceType: 'm5.large',
                                Platform: 'Linux',
                                Region: 'us-east-1',
                                Memory: '8 GB',
                                NetworkPerformance: 'Up to 10 Gigabit'
                            }
                        },
                        ResourceUtilization: {
                            EC2ResourceUtilization: {
                                MaxCpuUtilizationPercentage: '15.2',
                                MaxMemoryUtilizationPercentage: '23.4',
                                MaxStorageUtilizationPercentage: '45.6'
                            }
                        },
                        MonthlyCost: '89.76'
                    },
                    RightsizingType: 'Terminate',
                    ModifyRecommendationDetail: {
                        TargetInstances: [{
                            ResourceDetails: {
                                EC2ResourceDetails: {
                                    InstanceType: 't3.medium',
                                    Platform: 'Linux',
                                    Region: 'us-east-1'
                                }
                            },
                            EstimatedMonthlyCost: '34.56'
                        }]
                    },
                    EstimatedMonthlySavings: '55.20'
                }
            ]
        };
    }

    async getTrustedAdvisorChecks() {
        // Simulate AWS Support Trusted Advisor API
        return {
            checks: [
                {
                    checkId: 'Qch7DwouX1',
                    name: 'Low Utilization Amazon EC2 Instances',
                    description: 'Checks for EC2 instances that have been running for more than 14 days with low utilization',
                    category: 'cost_optimizing',
                    status: 'warning',
                    resourcesSummary: {
                        resourcesProcessed: 12,
                        resourcesFlagged: 3,
                        resourcesIgnored: 0,
                        resourcesSuppressed: 0
                    },
                    flaggedResources: [
                        {
                            resourceId: 'i-1234567890abcdef0',
                            region: 'us-east-1',
                            metadata: [
                                'web-server-prod',
                                'm5.large',
                                '15.2%',
                                '23.4%',
                                '14 days',
                                '$89.76'
                            ]
                        }
                    ]
                },
                {
                    checkId: 'DAvU99Dc4C',
                    name: 'Amazon EBS Underutilized Volumes',
                    description: 'Checks for EBS volumes that are unattached or have very low write activity',
                    category: 'cost_optimizing',
                    status: 'error',
                    resourcesSummary: {
                        resourcesProcessed: 25,
                        resourcesFlagged: 8,
                        resourcesIgnored: 0,
                        resourcesSuppressed: 0
                    },
                    flaggedResources: [
                        {
                            resourceId: 'vol-0123456789abcdef0',
                            region: 'us-east-1',
                            metadata: [
                                'unattached',
                                'gp3',
                                '100 GB',
                                '$12.00',
                                '30 days'
                            ]
                        }
                    ]
                }
            ]
        };
    }

    async getReservedInstanceRecommendations() {
        return {
            RecommendationDetails: [
                {
                    AccountId: '123456789012',
                    InstanceDetails: {
                        EC2InstanceDetails: {
                            InstanceType: 'm5.large',
                            Region: 'us-east-1',
                            Platform: 'Linux/UNIX',
                            Tenancy: 'default'
                        }
                    },
                    RecommendedNumberOfInstancesToPurchase: '2',
                    ExpectedUtilizationPercentage: '85.4',
                    EstimatedMonthlySavingsAmount: '156.78',
                    EstimatedMonthlyOnDemandCost: '267.45',
                    EstimatedReservationCostForLookbackPeriod: '1890.23',
                    UpfrontCost: '0',
                    RecurringStandardMonthlyCost: '110.67'
                }
            ]
        };
    }

    async getBillingDetails() {
        return {
            BillingPeriod: '2024-08',
            TotalCost: '672.97',
            ServiceCharges: [
                {
                    ServiceName: 'Amazon Elastic Compute Cloud',
                    ChargeType: 'Usage',
                    Amount: '245.32',
                    Currency: 'USD',
                    UsageDetails: {
                        UsageType: 'BoxUsage:m5.large',
                        Operation: 'RunInstances',
                        UsageAmount: '744',
                        UsageUnit: 'Hrs',
                        RatePerUnit: '0.096'
                    }
                },
                {
                    ServiceName: 'Amazon QuickSight',
                    ChargeType: 'Subscription',
                    Amount: '156.78',
                    Currency: 'USD',
                    UsageDetails: {
                        UsageType: 'Enterprise-User',
                        Operation: 'QuickSight-Enterprise',
                        UsageAmount: '8',
                        UsageUnit: 'Users',
                        RatePerUnit: '18.00'
                    }
                }
            ],
            TaxDetails: {
                TaxAmount: '45.67',
                TaxType: 'VAT',
                TaxRate: '7.25%'
            }
        };
    }

    getDateMonthsAgo(months) {
        const date = new Date();
        date.setMonth(date.getMonth() - months);
        return date.toISOString().split('T')[0];
    }

    getTodayDate() {
        return new Date().toISOString().split('T')[0];
    }
}

// Cost Optimization Recommendations Engine
class CostOptimizationEngine {
    constructor(costData, trustedAdvisor, rightsizing, reservedInstance) {
        this.costData = costData;
        this.trustedAdvisor = trustedAdvisor;
        this.rightsizing = rightsizing;
        this.reservedInstance = reservedInstance;
    }

    generateRecommendations() {
        const recommendations = [];

        // EC2 Rightsizing Recommendations
        this.rightsizing.RightsizingRecommendations.forEach(rec => {
            recommendations.push({
                category: 'EC2 Optimization',
                priority: 'High',
                title: `Rightsize ${rec.CurrentInstance.InstanceName}`,
                description: `Instance ${rec.CurrentInstance.ResourceId} (${rec.CurrentInstance.ResourceDetails.EC2ResourceDetails.InstanceType}) has low utilization: ${rec.CurrentInstance.ResourceUtilization.EC2ResourceUtilization.MaxCpuUtilizationPercentage}% CPU, ${rec.CurrentInstance.ResourceUtilization.EC2ResourceUtilization.MaxMemoryUtilizationPercentage}% Memory`,
                currentCost: parseFloat(rec.CurrentInstance.MonthlyCost),
                estimatedSavings: parseFloat(rec.EstimatedMonthlySavings),
                action: rec.RightsizingType === 'Terminate' ? 'Terminate underutilized instance' : `Resize to ${rec.ModifyRecommendationDetail.TargetInstances[0].ResourceDetails.EC2ResourceDetails.InstanceType}`,
                implementation: {
                    effort: 'Low',
                    risk: 'Low',
                    timeframe: '1 hour'
                }
            });
        });

        // Trusted Advisor Recommendations
        this.trustedAdvisor.checks.forEach(check => {
            if (check.status === 'warning' || check.status === 'error') {
                check.flaggedResources.forEach(resource => {
                    let savings = 0;
                    let description = '';
                    
                    if (check.name.includes('Low Utilization')) {
                        savings = parseFloat(resource.metadata[5].replace('$', '')) * 0.6;
                        description = `EC2 instance ${resource.metadata[0]} (${resource.metadata[1]}) running at ${resource.metadata[2]} CPU utilization for ${resource.metadata[4]}`;
                    } else if (check.name.includes('EBS')) {
                        savings = parseFloat(resource.metadata[3].replace('$', ''));
                        description = `EBS volume ${resource.resourceId} (${resource.metadata[2]}) has been ${resource.metadata[0]} for ${resource.metadata[4]}`;
                    }

                    recommendations.push({
                        category: 'Trusted Advisor',
                        priority: check.status === 'error' ? 'High' : 'Medium',
                        title: check.name,
                        description: description,
                        currentCost: savings / 0.6,
                        estimatedSavings: savings,
                        action: check.name.includes('EBS') ? 'Delete unattached volume' : 'Rightsize or terminate instance',
                        implementation: {
                            effort: 'Low',
                            risk: check.name.includes('EBS') ? 'Very Low' : 'Medium',
                            timeframe: '30 minutes'
                        }
                    });
                });
            }
        });

        // Reserved Instance Recommendations
        this.reservedInstance.RecommendationDetails.forEach(rec => {
            recommendations.push({
                category: 'Reserved Instances',
                priority: 'Medium',
                title: `Purchase Reserved Instances for ${rec.InstanceDetails.EC2InstanceDetails.InstanceType}`,
                description: `Purchase ${rec.RecommendedNumberOfInstancesToPurchase} Reserved Instances with ${rec.ExpectedUtilizationPercentage}% expected utilization`,
                currentCost: parseFloat(rec.EstimatedMonthlyOnDemandCost),
                estimatedSavings: parseFloat(rec.EstimatedMonthlySavingsAmount),
                action: `Purchase ${rec.RecommendedNumberOfInstancesToPurchase} x 1-year ${rec.InstanceDetails.EC2InstanceDetails.InstanceType} Reserved Instances`,
                implementation: {
                    effort: 'Low',
                    risk: 'Low',
                    timeframe: '15 minutes'
                }
            });
        });

        return recommendations.sort((a, b) => b.estimatedSavings - a.estimatedSavings);
    }
}

// Export for use in dashboard
window.AWSCostAnalyzer = AWSCostAnalyzer;
window.CostOptimizationEngine = CostOptimizationEngine;