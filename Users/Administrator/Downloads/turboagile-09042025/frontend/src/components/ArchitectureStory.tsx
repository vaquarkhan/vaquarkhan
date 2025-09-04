import React, { useState, useEffect } from 'react';

interface ArchitectureStoryProps {
  projectId: string;
  onComplete: (result: any) => void;
}

interface ArchitecturePattern {
  id: string;
  name: string;
  description: string;
  referenceLink: string;
  estimatedCost: number;
  pros: string[];
  cons: string[];
}

interface DiagramData {
  architectureDiagram: string;
  sequenceDiagram: string;
  erDiagram: string;
}

interface CodeGeneration {
  language: string;
  framework: string;
  files: { [key: string]: string };
}

const ArchitectureStory: React.FC<ArchitectureStoryProps> = ({ projectId, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  
  // Step 1 data
  const [cloudChoice, setCloudChoice] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [useCustomPrompt, setUseCustomPrompt] = useState(false);
  
  // Step 2 data
  const [architecturePatterns, setArchitecturePatterns] = useState<ArchitecturePattern[]>([]);
  const [selectedPattern, setSelectedPattern] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Step 3 data
  const [diagrams, setDiagrams] = useState<DiagramData>({
    architectureDiagram: '',
    sequenceDiagram: '',
    erDiagram: ''
  });
  
  // Step 4 data
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedFramework, setSelectedFramework] = useState('');
  
  // Step 5 data
  const [generatedCode, setGeneratedCode] = useState<CodeGeneration>({
    language: '',
    framework: '',
    files: {}
  });

  const cloudOptions = [
    { value: 'aws', label: 'Amazon Web Services (AWS)' },
    { value: 'azure', label: 'Microsoft Azure' },
    { value: 'gcp', label: 'Google Cloud Platform' },
    { value: 'on-premise', label: 'On-Premise' },
    { value: 'cloud-agnostic', label: 'Cloud Agnostic' }
  ];

  const languageFrameworks = {
    'java': ['Spring Boot', 'Spring MVC', 'Quarkus', 'Micronaut'],
    'javascript': ['Node.js + Express', 'Next.js', 'Nest.js', 'React'],
    'python': ['Django', 'Flask', 'FastAPI', 'Pyramid'],
    'csharp': ['.NET Core', 'ASP.NET', '.NET Framework', 'Blazor'],
    'go': ['Gin', 'Echo', 'Fiber', 'Chi'],
    'rust': ['Actix', 'Rocket', 'Warp', 'Axum']
  };

  const handleStep1Next = () => {
    if (cloudChoice) {
      setCurrentStep(2);
      generateArchitecturePatterns();
    }
  };

  const generateArchitecturePatterns = async () => {
    setIsGenerating(true);
    try {
      const brdContext = await fetchBRDContext();
      const prompt = useCustomPrompt ? customPrompt : '';
      
      const response = await fetch('/api/architecture/generate-patterns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          cloudChoice,
          customPrompt: prompt,
          brdContext
        })
      });
      
      const patterns = await response.json();
      setArchitecturePatterns(patterns);
    } catch (error) {
      console.error('Failed to generate patterns:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const fetchBRDContext = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/brd`);
      return await response.text();
    } catch (error) {
      console.error('Failed to fetch BRD:', error);
      return '';
    }
  };

  const handlePatternSelect = (patternId: string) => {
    setSelectedPattern(patternId);
  };

  const handleAcceptPattern = () => {
    if (selectedPattern) {
      setCurrentStep(3);
      generateDiagrams();
    }
  };

  const handleRegeneratePattern = async () => {
    const newPrompt = prompt('Enter custom requirements for regeneration:');
    if (newPrompt) {
      setCustomPrompt(newPrompt);
      setUseCustomPrompt(true);
      await generateArchitecturePatterns();
    }
  };

  const generateDiagrams = async () => {
    try {
      const selectedPatternData = architecturePatterns.find(p => p.id === selectedPattern);
      
      const response = await fetch('/api/architecture/generate-diagrams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          pattern: selectedPatternData,
          cloudChoice
        })
      });
      
      const diagramData = await response.json();
      setDiagrams(diagramData);
    } catch (error) {
      console.error('Failed to generate diagrams:', error);
    }
  };

  const handleDiagramNext = () => {
    setCurrentStep(4);
  };

  const handleLanguageFrameworkNext = () => {
    if (selectedLanguage && selectedFramework) {
      setCurrentStep(5);
      generateCode();
    }
  };

  const generateCode = async () => {
    try {
      const response = await fetch('/api/architecture/generate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          language: selectedLanguage,
          framework: selectedFramework,
          pattern: architecturePatterns.find(p => p.id === selectedPattern),
          diagrams
        })
      });
      
      const codeData = await response.json();
      setGeneratedCode(codeData);
    } catch (error) {
      console.error('Failed to generate code:', error);
    }
  };

  const handleFinalNext = () => {
    setCurrentStep(6);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Architecture Story - Step 1</h2>
      <p className="text-gray-600">Choose your deployment preference and add custom requirements if needed.</p>
      
      <div>
        <label className="block text-sm font-medium mb-2">Choose Cloud or Deployment Option:</label>
        <select 
          value={cloudChoice} 
          onChange={(e) => setCloudChoice(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="">Select deployment option...</option>
          {cloudOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            checked={useCustomPrompt}
            onChange={(e) => setUseCustomPrompt(e.target.checked)}
          />
          <span>Add custom requirements (optional)</span>
        </label>
        
        {useCustomPrompt && (
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Enter your custom requirements..."
            className="w-full mt-2 border border-gray-300 rounded-lg px-3 py-2"
            rows={4}
          />
        )}
      </div>

      <button 
        onClick={handleStep1Next}
        disabled={!cloudChoice}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
      >
        Next
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Architecture Story - Step 2</h2>
      <p className="text-gray-600">Select an architecture pattern for your application.</p>
      
      {isGenerating ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4">Generating architecture patterns...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {architecturePatterns.map(pattern => (
            <div key={pattern.id} className="border rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <input
                  type="radio"
                  name="pattern"
                  value={pattern.id}
                  checked={selectedPattern === pattern.id}
                  onChange={() => handlePatternSelect(pattern.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{pattern.name}</h3>
                  <p className="text-gray-600 mb-2">{pattern.description}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <a 
                      href={pattern.referenceLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      📖 Reference Link
                    </a>
                    <span className="text-green-600 font-medium">
                      💰 Est. Cost: ${pattern.estimatedCost}/month
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Pros:</strong>
                      <ul className="list-disc list-inside text-gray-600">
                        {pattern.pros.map((pro, idx) => <li key={idx}>{pro}</li>)}
                      </ul>
                    </div>
                    <div>
                      <strong>Cons:</strong>
                      <ul className="list-disc list-inside text-gray-600">
                        {pattern.cons.map((con, idx) => <li key={idx}>{con}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex space-x-4">
        <button 
          onClick={handleAcceptPattern}
          disabled={!selectedPattern}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-300"
        >
          Accept & Continue
        </button>
        <button 
          onClick={handleRegeneratePattern}
          className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700"
        >
          Regenerate
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Architecture Story - Step 3</h2>
      <p className="text-gray-600">Review and edit your architecture diagrams.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Architecture Diagram</h3>
          <div className="bg-gray-100 h-64 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
            {diagrams.architectureDiagram ? (
              <div dangerouslySetInnerHTML={{ __html: diagrams.architectureDiagram }} />
            ) : (
              <span className="text-gray-500">Architecture diagram will appear here</span>
            )}
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Sequence Diagram</h3>
          <div className="bg-gray-100 h-64 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
            {diagrams.sequenceDiagram ? (
              <div dangerouslySetInnerHTML={{ __html: diagrams.sequenceDiagram }} />
            ) : (
              <span className="text-gray-500">Sequence diagram will appear here</span>
            )}
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">ER Diagram</h3>
          <div className="bg-gray-100 h-64 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
            {diagrams.erDiagram ? (
              <div dangerouslySetInnerHTML={{ __html: diagrams.erDiagram }} />
            ) : (
              <span className="text-gray-500">ER diagram will appear here</span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-blue-800">💡 You can edit these diagrams using the integrated diagram editor. Click on any diagram to modify it.</p>
      </div>

      <button 
        onClick={handleDiagramNext}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
      >
        Next
      </button>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Architecture Story - Step 4</h2>
      <p className="text-gray-600">Choose your programming language and framework.</p>
      
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Programming Language:</label>
          <select 
            value={selectedLanguage} 
            onChange={(e) => {
              setSelectedLanguage(e.target.value);
              setSelectedFramework('');
            }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">Select language...</option>
            <option value="java">Java</option>
            <option value="javascript">JavaScript/TypeScript</option>
            <option value="python">Python</option>
            <option value="csharp">C#</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Framework:</label>
          <select 
            value={selectedFramework} 
            onChange={(e) => setSelectedFramework(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            disabled={!selectedLanguage}
          >
            <option value="">Select framework...</option>
            {selectedLanguage && languageFrameworks[selectedLanguage as keyof typeof languageFrameworks]?.map(framework => (
              <option key={framework} value={framework}>{framework}</option>
            ))}
          </select>
        </div>
      </div>

      <button 
        onClick={handleLanguageFrameworkNext}
        disabled={!selectedLanguage || !selectedFramework}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
      >
        Generate Code
      </button>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Architecture Story - Step 5</h2>
      <p className="text-gray-600">Generated code based on your architecture and technology choices.</p>
      
      <div className="bg-gray-900 text-white rounded-lg p-4 max-h-96 overflow-y-auto">
        <div className="flex space-x-4 mb-4">
          {Object.keys(generatedCode.files).map(filename => (
            <button 
              key={filename}
              className="px-3 py-1 bg-gray-700 rounded text-sm hover:bg-gray-600"
            >
              {filename}
            </button>
          ))}
        </div>
        <pre className="text-sm">
          {Object.entries(generatedCode.files).map(([filename, content]) => (
            <div key={filename}>
              <div className="text-green-400 mb-2">// {filename}</div>
              <code>{content}</code>
            </div>
          ))}
        </pre>
      </div>

      <div className="flex space-x-4">
        <button 
          onClick={handleFinalNext}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Next: Test Generation
        </button>
        <button className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700">
          Download Code
        </button>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Architecture Story - Final Steps</h2>
      <p className="text-gray-600">Complete your architecture story with testing, Git workflow, and deployment.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border rounded-lg p-4 text-center">
          <div className="text-4xl mb-2">🧪</div>
          <h3 className="font-semibold mb-2">Test Generation</h3>
          <p className="text-sm text-gray-600 mb-4">Generate unit and integration tests</p>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Generate Tests
          </button>
        </div>
        
        <div className="border rounded-lg p-4 text-center">
          <div className="text-4xl mb-2">🔄</div>
          <h3 className="font-semibold mb-2">Git Workflow</h3>
          <p className="text-sm text-gray-600 mb-4">Setup CI/CD pipeline</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Setup Git
          </button>
        </div>
        
        <div className="border rounded-lg p-4 text-center">
          <div className="text-4xl mb-2">☁️</div>
          <h3 className="font-semibold mb-2">Cloud Deployment</h3>
          <p className="text-sm text-gray-600 mb-4">Deploy to selected cloud</p>
          <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
            Deploy
          </button>
        </div>
      </div>

      <button 
        onClick={() => onComplete({ 
          cloudChoice, 
          selectedPattern, 
          diagrams, 
          generatedCode,
          language: selectedLanguage,
          framework: selectedFramework
        })}
        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
      >
        Complete Architecture Story
      </button>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      case 6: return renderStep6();
      default: return renderStep1();
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsVisible(true)}
        className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 text-lg font-medium"
      >
        🏗️ Create Architecture Story
      </button>

      {isVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold">Architecture Story Workflow</h1>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Step {currentStep} of 6
                </span>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / 6) * 100}%` }}
                ></div>
              </div>
            </div>

            {renderCurrentStep()}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchitectureStory;