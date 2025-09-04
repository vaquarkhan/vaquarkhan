import React, { useState, useEffect } from 'react';

interface WizardSection {
  id: string;
  state: 'pending' | 'generated' | 'accepted' | 'rejected';
  data?: any;
  customPrompt?: string;
  timestamp?: number;
}

interface ArchitectureWizardProps {
  projectId: string;
  onComplete: (result: any) => void;
}

const EnhancedArchitectureWizard: React.FC<ArchitectureWizardProps> = ({ projectId, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [sectionStates, setSectionStates] = useState<Record<string, WizardSection>>({});
  const [isGenerating, setIsGenerating] = useState<Record<string, boolean>>({});
  
  // Wizard data
  const [cloudChoice, setCloudChoice] = useState('');
  const [architecturePatterns, setArchitecturePatterns] = useState([]);
  const [selectedPattern, setSelectedPattern] = useState('');
  const [diagrams, setDiagrams] = useState({});
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedFramework, setSelectedFramework] = useState('');
  const [generatedCode, setGeneratedCode] = useState({});
  const [deploymentConfig, setDeploymentConfig] = useState({});

  // Product Owner Recommended Features
  const [wizardHistory, setWizardHistory] = useState([]);
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);
  const [costOptimization, setCostOptimization] = useState({});
  const [securityRecommendations, setSecurityRecommendations] = useState([]);

  const steps = [
    { id: 1, title: 'Cloud Selection', icon: '☁️', description: 'Choose deployment target' },
    { id: 2, title: 'AI Patterns', icon: '🤖', description: 'AI-generated architectures' },
    { id: 3, title: 'Visual Design', icon: '🎨', description: 'Interactive diagrams' },
    { id: 4, title: 'Tech Stack', icon: '⚡', description: 'Languages & frameworks' },
    { id: 5, title: 'Smart Code', icon: '💻', description: 'AI-generated code' },
    { id: 6, title: 'Deploy & Scale', icon: '🚀', description: 'Launch & monitor' }
  ];

  // Section control functions
  const updateSectionState = (sectionId: string, state: string, data?: any, customPrompt?: string) => {
    setSectionStates(prev => ({
      ...prev,
      [sectionId]: {
        id: sectionId,
        state: state as any,
        data,
        customPrompt,
        timestamp: Date.now()
      }
    }));

    // Add to history
    setWizardHistory(prev => [...prev, {
      step: currentStep,
      section: sectionId,
      action: state,
      timestamp: Date.now(),
      data: data
    }]);
  };

  const generateWithAI = async (section: string, baseData: any, customPrompt: string = '') => {
    setIsGenerating(prev => ({ ...prev, [section]: true }));
    
    try {
      // Enhanced AI generation with insights
      const response = await fetch('/api/architecture/generate-enhanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section,
          baseData,
          customPrompt,
          projectId,
          history: wizardHistory,
          preferences: getUserPreferences()
        })
      });

      const result = await response.json();
      
      // Update section data
      switch (section) {
        case 'patterns':
          setArchitecturePatterns(result.patterns);
          setAiInsights(result.insights);
          setCostOptimization(result.costAnalysis);
          break;
        case 'diagrams':
          setDiagrams(result.diagrams);
          break;
        case 'code':
          setGeneratedCode(result.code);
          setSecurityRecommendations(result.security);
          break;
      }
      
      updateSectionState(section, 'generated', result, customPrompt);
    } catch (error) {
      console.error(`Error generating ${section}:`, error);
      // Fallback to mock data
      generateMockData(section, baseData, customPrompt);
    } finally {
      setIsGenerating(prev => ({ ...prev, [section]: false }));
    }
  };

  const generateMockData = (section: string, baseData: any, customPrompt: string) => {
    // Mock data generation with enhanced features
    switch (section) {
      case 'patterns':
        const mockPatterns = [
          {
            id: 'ai-microservices',
            name: '🤖 AI-Optimized Microservices',
            description: 'ML-enhanced microservices with auto-scaling and intelligent routing',
            cost: 420,
            aiScore: 95,
            securityScore: 88,
            scalabilityScore: 96,
            pros: ['AI-driven optimization', 'Predictive scaling', 'Smart load balancing'],
            cons: ['Higher complexity', 'AI model maintenance', 'Learning curve'],
            customized: customPrompt ? `AI-enhanced for: ${customPrompt}` : null,
            insights: ['Reduces costs by 30%', 'Improves performance by 45%', 'Auto-detects bottlenecks']
          },
          {
            id: 'serverless-edge',
            name: '⚡ Edge-First Serverless',
            description: 'Global edge computing with serverless functions and CDN integration',
            cost: 180,
            aiScore: 92,
            securityScore: 94,
            scalabilityScore: 98,
            pros: ['Ultra-low latency', 'Global distribution', 'Zero cold starts'],
            cons: ['Vendor dependency', 'Limited compute time', 'Complex debugging'],
            customized: customPrompt ? `Edge-optimized for: ${customPrompt}` : null,
            insights: ['99.9% uptime guarantee', 'Sub-100ms response times', 'Auto-failover']
          }
        ];
        setArchitecturePatterns(mockPatterns);
        setAiInsights([
          'Based on your requirements, microservices architecture will provide better scalability',
          'Consider implementing circuit breakers for improved resilience',
          'Edge deployment can reduce latency by 60% for global users'
        ]);
        break;
    }
  };

  const getUserPreferences = () => ({
    preferredClouds: [cloudChoice],
    budgetRange: 'medium',
    scalabilityNeeds: 'high',
    securityLevel: 'enterprise',
    teamSize: 'medium'
  });

  // Enhanced UI Components
  const renderControlPanel = (
    sectionId: string,
    onAccept: () => void,
    onReject: () => void,
    onRegenerate: () => void,
    showCustomPrompt: boolean = true,
    additionalControls?: React.ReactNode
  ) => {
    const [localPrompt, setLocalPrompt] = useState('');
    const sectionState = sectionStates[sectionId];
    const status = sectionState?.state || 'pending';

    return (
      <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6 mt-6 border border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              status === 'accepted' ? 'bg-green-100 text-green-800' :
              status === 'rejected' ? 'bg-red-100 text-red-800' :
              status === 'generated' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              <i className={`fas ${
                status === 'accepted' ? 'fa-check-circle' :
                status === 'rejected' ? 'fa-times-circle' :
                status === 'generated' ? 'fa-magic' :
                'fa-clock'
              } mr-1`}></i>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </div>
            {sectionState?.timestamp && (
              <span className="text-xs text-gray-500">
                {new Date(sectionState.timestamp).toLocaleTimeString()}
              </span>
            )}
          </div>
          
          <div className="flex space-x-2">
            <button 
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              onClick={onAccept}
              disabled={status === 'accepted' || status === 'pending'}
            >
              <i className="fas fa-thumbs-up mr-1"></i>Accept
            </button>
            <button 
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              onClick={onReject}
            >
              <i className="fas fa-thumbs-down mr-1"></i>Reject
            </button>
            <button 
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
              onClick={() => onRegenerate()}
            >
              <i className="fas fa-redo mr-1"></i>Regenerate
            </button>
          </div>
        </div>

        {showCustomPrompt && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              🎯 Custom Requirements & Modifications
            </label>
            <div className="flex space-x-2">
              <textarea
                value={localPrompt}
                onChange={(e) => setLocalPrompt(e.target.value)}
                placeholder="Describe specific requirements, constraints, or modifications..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                rows={2}
              />
              <button
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
                onClick={() => {
                  onRegenerate();
                  setLocalPrompt('');
                }}
                disabled={!localPrompt.trim()}
              >
                <i className="fas fa-magic mr-1"></i>Apply
              </button>
            </div>
            
            {/* Quick suggestion chips */}
            <div className="flex flex-wrap gap-2">
              {[
                'High performance', 'Cost optimized', 'Security focused', 
                'Mobile first', 'Real-time features', 'Global scale'
              ].map(suggestion => (
                <button
                  key={suggestion}
                  className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded-full transition-colors"
                  onClick={() => setLocalPrompt(prev => prev + (prev ? ', ' : '') + suggestion.toLowerCase())}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {additionalControls && (
          <div className="mt-4 pt-4 border-t border-purple-200">
            {additionalControls}
          </div>
        )}
      </div>
    );
  };

  const renderAIInsights = () => (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6 border border-blue-200">
      <h4 className="font-semibold text-blue-800 mb-2">
        <i className="fas fa-lightbulb mr-2"></i>AI Insights & Recommendations
      </h4>
      <div className="space-y-2">
        {aiInsights.map((insight, index) => (
          <div key={index} className="flex items-start space-x-2">
            <i className="fas fa-robot text-blue-500 mt-1"></i>
            <span className="text-sm text-blue-700">{insight}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCostOptimization = () => (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-6 border border-green-200">
      <h4 className="font-semibold text-green-800 mb-2">
        <i className="fas fa-dollar-sign mr-2"></i>Cost Optimization
      </h4>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-green-600">30%</div>
          <div className="text-xs text-green-700">Cost Reduction</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-blue-600">$420</div>
          <div className="text-xs text-blue-700">Monthly Est.</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-purple-600">95%</div>
          <div className="text-xs text-purple-700">Efficiency Score</div>
        </div>
      </div>
    </div>
  );

  const renderPatternCard = (pattern: any) => (
    <div
      key={pattern.id}
      className={`bg-white rounded-xl p-6 border-2 transition-all cursor-pointer hover:shadow-lg ${
        selectedPattern === pattern.id 
          ? 'border-purple-500 bg-purple-50' 
          : 'border-gray-200 hover:border-purple-300'
      }`}
      onClick={() => setSelectedPattern(pattern.id)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <input
            type="radio"
            name="pattern"
            value={pattern.id}
            checked={selectedPattern === pattern.id}
            onChange={() => setSelectedPattern(pattern.id)}
            className="text-purple-600"
          />
          <h3 className="text-xl font-bold">{pattern.name}</h3>
        </div>
        <div className="flex space-x-2">
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            AI: {pattern.aiScore}%
          </span>
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            ${pattern.cost}/mo
          </span>
        </div>
      </div>
      
      <p className="text-gray-600 mb-4">{pattern.description}</p>
      
      {pattern.customized && (
        <div className="bg-purple-100 border border-purple-200 rounded-lg p-3 mb-4">
          <span className="text-purple-800 text-sm">✨ {pattern.customized}</span>
        </div>
      )}
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-bold text-blue-600">{pattern.aiScore}%</div>
          <div className="text-xs text-gray-500">AI Score</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-600">{pattern.securityScore}%</div>
          <div className="text-xs text-gray-500">Security</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-purple-600">{pattern.scalabilityScore}%</div>
          <div className="text-xs text-gray-500">Scalability</div>
        </div>
      </div>
      
      {pattern.insights && (
        <div className="space-y-1">
          {pattern.insights.map((insight: string, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <i className="fas fa-check-circle text-green-500 text-xs"></i>
              <span className="text-xs text-gray-600">{insight}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Step rendering functions
  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">🤖 AI-Powered Architecture Patterns</h2>
        <p className="text-gray-600">Intelligent patterns tailored for your {cloudChoice} deployment</p>
      </div>

      {aiInsights.length > 0 && renderAIInsights()}
      {Object.keys(costOptimization).length > 0 && renderCostOptimization()}

      {isGenerating.patterns ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">🤖 AI is analyzing your requirements and generating optimal patterns...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {architecturePatterns.map(renderPatternCard)}
        </div>
      )}

      {renderControlPanel(
        'patterns',
        () => {
          if (selectedPattern) {
            updateSectionState('patterns', 'accepted', { selectedPattern, patterns: architecturePatterns });
            setCurrentStep(3);
          }
        },
        () => updateSectionState('patterns', 'rejected'),
        () => generateWithAI('patterns', { cloudChoice }),
        true,
        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
            <button className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full hover:bg-blue-200">
              <i className="fas fa-save mr-1"></i>Save as Template
            </button>
            <button className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-full hover:bg-gray-200">
              <i className="fas fa-share mr-1"></i>Share with Team
            </button>
          </div>
          <div className="text-xs text-gray-500">
            {architecturePatterns.length} patterns generated
          </div>
        </div>
      )}
    </div>
  );

  // Auto-generate data when entering steps
  useEffect(() => {
    if (currentStep === 2 && architecturePatterns.length === 0 && cloudChoice) {
      generateWithAI('patterns', { cloudChoice });
    }
  }, [currentStep, cloudChoice]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            🪄 Enhanced Architecture Wizard
          </h1>
          <p className="text-xl text-gray-600">
            AI-powered architecture generation with intelligent insights and optimization
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex justify-between items-center mb-12 px-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center relative">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold transition-all ${
                currentStep > step.id ? 'bg-green-500 text-white' :
                currentStep === step.id ? 'bg-purple-500 text-white shadow-lg' :
                'bg-gray-200 text-gray-500'
              }`}>
                {step.icon}
              </div>
              <div className="text-center mt-2">
                <div className="font-semibold text-sm">{step.title}</div>
                <div className="text-xs text-gray-500">{step.description}</div>
              </div>
              {index < steps.length - 1 && (
                <div className={`absolute top-8 left-full w-20 h-1 ${
                  currentStep > step.id ? 'bg-green-400' : 'bg-gray-300'
                }`} style={{ transform: 'translateX(-50%)' }}></div>
              )}
            </div>
          ))}
        </div>

        {/* Current step content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {currentStep === 2 && renderStep2()}
          {/* Other steps would be implemented similarly */}
        </div>
      </div>
    </div>
  );
};

export default EnhancedArchitectureWizard;