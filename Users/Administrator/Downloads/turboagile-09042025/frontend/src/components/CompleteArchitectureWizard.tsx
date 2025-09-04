import React, { useState, useEffect } from 'react';

interface ValidationResult {
  id: string;
  name: string;
  category: string;
  severity: string;
  status: string;
  message: string;
  suggestion?: string;
}

interface ArchitecturePattern {
  id: string;
  name: string;
  description: string;
  cost: number;
  score: number;
  pros: string[];
  cons: string[];
}

const CompleteArchitectureWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [cloudChoice, setCloudChoice] = useState('');
  const [selectedPattern, setSelectedPattern] = useState('');
  const [architecturePatterns, setArchitecturePatterns] = useState<ArchitecturePattern[]>([]);
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [sectionStates, setSectionStates] = useState<Record<string, any>>({});

  const steps = [
    { id: 1, title: 'Cloud', icon: '☁️' },
    { id: 2, title: 'Patterns', icon: '🏗️' },
    { id: 3, title: 'Validate', icon: '🛡️' },
    { id: 4, title: 'Generate', icon: '⚡' },
    { id: 5, title: 'Deploy', icon: '🚀' }
  ];

  const cloudOptions = [
    { value: 'aws', label: 'AWS', color: 'bg-orange-500' },
    { value: 'azure', label: 'Azure', color: 'bg-blue-500' },
    { value: 'gcp', label: 'GCP', color: 'bg-red-500' },
    { value: 'on-premise', label: 'On-Premise', color: 'bg-gray-500' }
  ];

  // API calls
  const generatePatterns = async () => {
    try {
      const response = await fetch('/api/architecture/generate-patterns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: 'sample-project',
          cloudChoice,
          customPrompt: '',
          brdContext: 'Sample BRD context'
        })
      });
      
      if (response.ok) {
        const patterns = await response.json();
        setArchitecturePatterns(patterns);
      }
    } catch (error) {
      console.error('Error generating patterns:', error);
      // Fallback to mock data
      setArchitecturePatterns([
        {
          id: 'microservices',
          name: 'Microservices Architecture',
          description: 'Scalable, distributed services with API gateway',
          cost: 450,
          score: 92,
          pros: ['High scalability', 'Technology diversity', 'Fault isolation'],
          cons: ['Complex deployment', 'Network overhead', 'Data consistency']
        },
        {
          id: 'serverless',
          name: 'Serverless Architecture',
          description: 'Event-driven, auto-scaling serverless functions',
          cost: 180,
          score: 88,
          pros: ['No server management', 'Auto-scaling', 'Pay-per-use'],
          cons: ['Cold starts', 'Vendor lock-in', 'Limited runtime']
        }
      ]);
    }
  };

  const runValidation = async () => {
    setIsValidating(true);
    
    try {
      const response = await fetch('/api/architecture/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: 'sample-project',
          architecturePattern: selectedPattern,
          cloudProvider: cloudChoice,
          categories: ['security', 'performance', 'scalability', 'reliability']
        })
      });
      
      if (response.ok) {
        const results = await response.json();
        setValidationResults(results);
      }
    } catch (error) {
      console.error('Error running validation:', error);
    } finally {
      setIsValidating(false);
    }
  };

  // Control Panel Component
  const ControlPanel: React.FC<{
    section: string;
    onAccept: () => void;
    onReject: () => void;
    onRegenerate: () => void;
  }> = ({ section, onAccept, onReject, onRegenerate }) => {
    const [customPrompt, setCustomPrompt] = useState('');
    const status = sectionStates[section]?.state || 'pending';

    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mt-6 border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            status === 'accepted' ? 'bg-green-100 text-green-800' :
            status === 'rejected' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={onAccept}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
              disabled={status === 'accepted'}
            >
              ✓ Accept
            </button>
            <button 
              onClick={onReject}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
            >
              ✗ Reject
            </button>
            <button 
              onClick={onRegenerate}
              className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
            >
              ↻ Regenerate
            </button>
          </div>
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Custom requirements..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => {
              onRegenerate();
              setCustomPrompt('');
            }}
            disabled={!customPrompt.trim()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
          >
            Apply
          </button>
        </div>
      </div>
    );
  };

  // Step Components
  const CloudSelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Choose Cloud Platform</h2>
        <p className="text-gray-600">Select your deployment target</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cloudOptions.map(option => (
          <div
            key={option.value}
            onClick={() => setCloudChoice(option.value)}
            className={`p-6 rounded-xl cursor-pointer transition-all border-2 ${
              cloudChoice === option.value 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className={`w-12 h-12 ${option.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
              <span className="text-white font-bold">{option.label[0]}</span>
            </div>
            <h3 className="font-semibold text-center">{option.label}</h3>
          </div>
        ))}
      </div>

      <ControlPanel
        section="cloud"
        onAccept={() => {
          setSectionStates(prev => ({ ...prev, cloud: { state: 'accepted' } }));
          setCurrentStep(2);
          generatePatterns();
        }}
        onReject={() => setSectionStates(prev => ({ ...prev, cloud: { state: 'rejected' } }))}
        onRegenerate={() => setCloudChoice('')}
      />
    </div>
  );

  const PatternSelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Architecture Patterns</h2>
        <p className="text-gray-600">AI-generated patterns for {cloudChoice}</p>
      </div>

      <div className="space-y-4">
        {architecturePatterns.map(pattern => (
          <div
            key={pattern.id}
            onClick={() => setSelectedPattern(pattern.id)}
            className={`p-6 rounded-xl cursor-pointer transition-all border-2 ${
              selectedPattern === pattern.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="pattern"
                  checked={selectedPattern === pattern.id}
                  onChange={() => setSelectedPattern(pattern.id)}
                />
                <h3 className="text-xl font-bold">{pattern.name}</h3>
              </div>
              <div className="flex space-x-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                  Score: {pattern.score}%
                </span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                  ${pattern.cost}/mo
                </span>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">{pattern.description}</p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-green-700 mb-2">Pros</h4>
                <ul className="space-y-1">
                  {pattern.pros.map((pro, idx) => (
                    <li key={idx} className="flex items-center text-green-600">
                      <span className="mr-2">✓</span>{pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-red-700 mb-2">Cons</h4>
                <ul className="space-y-1">
                  {pattern.cons.map((con, idx) => (
                    <li key={idx} className="flex items-center text-red-600">
                      <span className="mr-2">✗</span>{con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ControlPanel
        section="patterns"
        onAccept={() => {
          setSectionStates(prev => ({ ...prev, patterns: { state: 'accepted' } }));
          setCurrentStep(3);
        }}
        onReject={() => setSectionStates(prev => ({ ...prev, patterns: { state: 'rejected' } }))}
        onRegenerate={() => generatePatterns()}
      />
    </div>
  );

  const ValidationStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Architecture Validation</h2>
        <p className="text-gray-600">Validate against best practices</p>
      </div>

      <div className="bg-white rounded-xl p-6 border">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Validation Results</h3>
          <button
            onClick={runValidation}
            disabled={isValidating}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {isValidating ? 'Validating...' : 'Run Validation'}
          </button>
        </div>

        {validationResults.length > 0 && (
          <>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {validationResults.filter(r => r.status === 'pass').length}
                </div>
                <div className="text-sm text-green-700">Passed</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {validationResults.filter(r => r.status === 'warning').length}
                </div>
                <div className="text-sm text-yellow-700">Warnings</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {validationResults.filter(r => r.status === 'error').length}
                </div>
                <div className="text-sm text-red-700">Errors</div>
              </div>
            </div>

            <div className="space-y-3">
              {validationResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    result.status === 'pass' ? 'bg-green-50 border-green-200' :
                    result.status === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{result.name}</h4>
                      <p className="text-sm mt-1">{result.message}</p>
                      {result.suggestion && (
                        <div className="mt-2 p-2 bg-white bg-opacity-50 rounded text-sm">
                          💡 {result.suggestion}
                        </div>
                      )}
                    </div>
                    <span className="text-xs px-2 py-1 bg-white bg-opacity-50 rounded">
                      {result.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <ControlPanel
        section="validation"
        onAccept={() => {
          setSectionStates(prev => ({ ...prev, validation: { state: 'accepted' } }));
          setCurrentStep(4);
        }}
        onReject={() => setSectionStates(prev => ({ ...prev, validation: { state: 'rejected' } }))}
        onRegenerate={() => runValidation()}
      />
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return <CloudSelection />;
      case 2: return <PatternSelection />;
      case 3: return <ValidationStep />;
      default: return <CloudSelection />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Architecture Wizard
          </h1>
          <p className="text-xl text-gray-600">
            Create, validate, and deploy enterprise architectures
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-center items-center space-x-4 mb-12">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                currentStep > step.id ? 'bg-green-500' :
                currentStep === step.id ? 'bg-blue-500' :
                'bg-gray-300'
              }`}>
                {step.icon}
              </div>
              <div className="ml-2 hidden md:block">
                <div className="font-medium text-gray-800">{step.title}</div>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-4 ${
                  currentStep > step.id ? 'bg-green-400' : 'bg-gray-300'
                }`}></div>
              )}
            </div>
          ))}
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            {renderCurrentStep()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteArchitectureWizard;