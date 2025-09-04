import React, { useState, useEffect } from 'react';

interface ValidationRule {
  id: string;
  name: string;
  category: 'security' | 'performance' | 'scalability' | 'compliance';
  severity: 'error' | 'warning' | 'info';
  description: string;
}

interface ValidationResult {
  rule: ValidationRule;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  suggestion?: string;
}

interface ArchitectureValidatorProps {
  architecture: any;
  onValidationComplete: (results: ValidationResult[]) => void;
}

const ArchitectureValidator: React.FC<ArchitectureValidatorProps> = ({ 
  architecture, 
  onValidationComplete 
}) => {
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const validationRules: ValidationRule[] = [
    {
      id: 'single-point-failure',
      name: 'Single Point of Failure',
      category: 'scalability',
      severity: 'error',
      description: 'Check for components that could cause system-wide failure'
    },
    {
      id: 'security-encryption',
      name: 'Data Encryption',
      category: 'security',
      severity: 'error',
      description: 'Ensure data is encrypted in transit and at rest'
    },
    {
      id: 'performance-caching',
      name: 'Caching Strategy',
      category: 'performance',
      severity: 'warning',
      description: 'Validate caching implementation for performance optimization'
    },
    {
      id: 'compliance-audit-logs',
      name: 'Audit Logging',
      category: 'compliance',
      severity: 'error',
      description: 'Ensure comprehensive audit logging is implemented'
    },
    {
      id: 'scalability-load-balancing',
      name: 'Load Balancing',
      category: 'scalability',
      severity: 'warning',
      description: 'Check for proper load balancing configuration'
    }
  ];

  const runValidation = async () => {
    setIsValidating(true);
    
    try {
      // Simulate validation process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const results: ValidationResult[] = validationRules.map(rule => {
        const mockResult = generateMockValidationResult(rule, architecture);
        return mockResult;
      });
      
      setValidationResults(results);
      onValidationComplete(results);
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const generateMockValidationResult = (rule: ValidationRule, arch: any): ValidationResult => {
    // Mock validation logic based on architecture
    const randomStatus = Math.random();
    let status: 'pass' | 'fail' | 'warning';
    let message: string;
    let suggestion: string | undefined;

    if (randomStatus > 0.7) {
      status = 'pass';
      message = `${rule.name} validation passed successfully`;
    } else if (randomStatus > 0.4) {
      status = 'warning';
      message = `${rule.name} has potential issues that should be addressed`;
      suggestion = `Consider implementing ${rule.name.toLowerCase()} best practices`;
    } else {
      status = 'fail';
      message = `${rule.name} validation failed - critical issue detected`;
      suggestion = `Immediate action required to fix ${rule.name.toLowerCase()} issues`;
    }

    return { rule, status, message, suggestion };
  };

  const filteredResults = selectedCategory === 'all' 
    ? validationResults 
    : validationResults.filter(result => result.rule.category === selectedCategory);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return '✅';
      case 'fail': return '❌';
      case 'warning': return '⚠️';
      default: return '❓';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'text-green-600 bg-green-50 border-green-200';
      case 'fail': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security': return '🔒';
      case 'performance': return '⚡';
      case 'scalability': return '📈';
      case 'compliance': return '📋';
      default: return '🔧';
    }
  };

  useEffect(() => {
    if (architecture) {
      runValidation();
    }
  }, [architecture]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">
          🔍 Architecture Validation
        </h3>
        <button
          onClick={runValidation}
          disabled={isValidating}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {isValidating ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i>
              Validating...
            </>
          ) : (
            <>
              <i className="fas fa-play mr-2"></i>
              Run Validation
            </>
          )}
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-2 mb-6">
        {['all', 'security', 'performance', 'scalability', 'compliance'].map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category === 'all' ? '🔧 All' : `${getCategoryIcon(category)} ${category.charAt(0).toUpperCase() + category.slice(1)}`}
          </button>
        ))}
      </div>

      {/* Validation Results */}
      <div className="space-y-4">
        {filteredResults.length === 0 && !isValidating ? (
          <div className="text-center py-8 text-gray-500">
            <i className="fas fa-clipboard-check text-4xl mb-4"></i>
            <p>No validation results yet. Run validation to see results.</p>
          </div>
        ) : (
          filteredResults.map((result, index) => (
            <div
              key={index}
              className={`border rounded-lg p-4 ${getStatusColor(result.status)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{getStatusIcon(result.status)}</span>
                  <div>
                    <h4 className="font-semibold flex items-center">
                      {getCategoryIcon(result.rule.category)} {result.rule.name}
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        result.rule.severity === 'error' ? 'bg-red-100 text-red-800' :
                        result.rule.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {result.rule.severity}
                      </span>
                    </h4>
                    <p className="text-sm mt-1">{result.message}</p>
                    {result.suggestion && (
                      <div className="mt-2 p-2 bg-white bg-opacity-50 rounded border-l-4 border-blue-400">
                        <p className="text-sm">
                          <i className="fas fa-lightbulb mr-1"></i>
                          <strong>Suggestion:</strong> {result.suggestion}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {result.rule.category}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      {validationResults.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">Validation Summary</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-green-100 p-3 rounded">
              <div className="text-2xl font-bold text-green-600">
                {validationResults.filter(r => r.status === 'pass').length}
              </div>
              <div className="text-sm text-green-700">Passed</div>
            </div>
            <div className="bg-yellow-100 p-3 rounded">
              <div className="text-2xl font-bold text-yellow-600">
                {validationResults.filter(r => r.status === 'warning').length}
              </div>
              <div className="text-sm text-yellow-700">Warnings</div>
            </div>
            <div className="bg-red-100 p-3 rounded">
              <div className="text-2xl font-bold text-red-600">
                {validationResults.filter(r => r.status === 'fail').length}
              </div>
              <div className="text-sm text-red-700">Failed</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchitectureValidator;