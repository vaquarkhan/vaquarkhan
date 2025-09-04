import React, { useState, useEffect } from 'react';

interface ArchitectureWizardProps {
  projectId: string;
  onDiagramCreated: (diagram: any) => void;
}

interface WizardStep {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

interface Question {
  id: string;
  text: string;
  type: 'text' | 'select' | 'multiselect' | 'textarea';
  options?: string[];
  required: boolean;
  placeholder?: string;
}

interface ArchitectureData {
  name: string;
  type: string;
  description: string;
  [key: string]: any;
}

const ArchitectureWizard: React.FC<ArchitectureWizardProps> = ({ projectId, onDiagramCreated }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showWizard, setShowWizard] = useState(false);
  const [architectureData, setArchitectureData] = useState<ArchitectureData>({
    name: '',
    type: '',
    description: ''
  });
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const wizardSteps: WizardStep[] = [
    {
      id: 'project-info',
      title: 'Project Information',
      description: 'Let\'s start with some basic information about your project.',
      questions: [
        {
          id: 'projectName',
          text: 'What is the name of your project?',
          type: 'text',
          required: true,
          placeholder: 'e.g., E-commerce Platform, Banking System'
        },
        {
          id: 'projectType',
          text: 'What type of system are you building?',
          type: 'select',
          options: [
            'Web Application',
            'Mobile Application',
            'Microservices Architecture',
            'Monolithic Application',
            'Data Pipeline',
            'IoT System',
            'AI/ML Platform',
            'Other'
          ],
          required: true
        },
        {
          id: 'projectDescription',
          text: 'Briefly describe your project:',
          type: 'textarea',
          required: true,
          placeholder: 'Describe the main purpose and key features of your system'
        }
      ]
    },
    {
      id: 'architecture-type',
      title: 'Architecture Type',
      description: 'Choose the type of architecture diagram you want to create.',
      questions: [
        {
          id: 'diagramType',
          text: 'What type of diagram do you need?',
          type: 'select',
          options: [
            'System Architecture',
            'Component Diagram',
            'Sequence Diagram',
            'Entity Relationship (ER)',
            'Data Flow Diagram',
            'Network Topology',
            'Deployment Diagram',
            'Class Diagram'
          ],
          required: true
        },
        {
          id: 'diagramPurpose',
          text: 'What is the main purpose of this diagram?',
          type: 'select',
          options: [
            'System Design Documentation',
            'Development Planning',
            'Stakeholder Communication',
            'Technical Review',
            'Compliance Requirements',
            'Other'
          ],
          required: true
        }
      ]
    },
    {
      id: 'technical-details',
      title: 'Technical Details',
      description: 'Provide technical details about your system architecture.',
      questions: [
        {
          id: 'technologyStack',
          text: 'What technologies are you using?',
          type: 'multiselect',
          options: [
            'React/Angular/Vue.js',
            'Node.js/Express',
            'Java/Spring Boot',
            'Python/Django/Flask',
            'C#/.NET',
            'PHP/Laravel',
            'Ruby on Rails',
            'Go',
            'Rust',
            'Database (PostgreSQL, MySQL, MongoDB)',
            'Message Queues (RabbitMQ, Kafka)',
            'Cloud Services (AWS, Azure, GCP)',
            'Docker/Kubernetes',
            'Other'
          ],
          required: true
        },
        {
          id: 'deploymentModel',
          text: 'How do you plan to deploy your system?',
          type: 'select',
          options: [
            'On-premises',
            'Cloud (Public)',
            'Cloud (Private)',
            'Hybrid',
            'Edge Computing',
            'Serverless',
            'Not sure yet'
          ],
          required: true
        },
        {
          id: 'scalability',
          text: 'What are your scalability requirements?',
          type: 'select',
          options: [
            'Single user/application',
            'Small team (2-10 users)',
            'Medium organization (10-100 users)',
            'Large enterprise (100+ users)',
            'Public internet scale',
            'Not sure yet'
          ],
          required: true
        }
      ]
    },
    {
      id: 'security-requirements',
      title: 'Security & Compliance',
      description: 'Define your security and compliance requirements.',
      questions: [
        {
          id: 'securityLevel',
          text: 'What security level do you need?',
          type: 'select',
          options: [
            'Basic (internal use only)',
            'Standard (public internet)',
            'High (financial/healthcare)',
            'Critical (government/military)',
            'Not sure yet'
          ],
          required: true
        },
        {
          id: 'compliance',
          text: 'Do you need to comply with any standards?',
          type: 'multiselect',
          options: [
            'GDPR',
            'HIPAA',
            'SOX',
            'PCI DSS',
            'ISO 27001',
            'SOC 2',
            'None',
            'Other'
          ],
          required: false
        },
        {
          id: 'authentication',
          text: 'What authentication methods do you need?',
          type: 'multiselect',
          options: [
            'Username/Password',
            'Multi-factor Authentication (MFA)',
            'Single Sign-On (SSO)',
            'OAuth/OpenID Connect',
            'Biometric',
            'Certificate-based',
            'Not sure yet'
          ],
          required: true
        }
      ]
    },
    {
      id: 'integration-requirements',
      title: 'Integration & APIs',
      description: 'Define your integration and API requirements.',
      questions: [
        {
          id: 'externalSystems',
          text: 'Do you need to integrate with external systems?',
          type: 'select',
          options: [
            'No external integrations',
            'A few third-party services',
            'Multiple external systems',
            'Enterprise system integration',
            'Not sure yet'
          ],
          required: true
        },
        {
          id: 'apiType',
          text: 'What type of APIs do you need?',
          type: 'multiselect',
          options: [
            'REST APIs',
            'GraphQL',
            'SOAP/XML',
            'gRPC',
            'WebSocket',
            'Message queues',
            'File-based integration',
            'Not sure yet'
          ],
          required: true
        },
        {
          id: 'dataExchange',
          text: 'How will you exchange data?',
          type: 'select',
          options: [
            'Synchronous (request/response)',
            'Asynchronous (event-driven)',
            'Batch processing',
            'Real-time streaming',
            'Mixed approach',
            'Not sure yet'
          ],
          required: true
        }
      ]
    }
  ];

  useEffect(() => {
    if (showWizard) {
      setCurrentStep(0);
      setAnswers({});
      setArchitectureData({
        name: '',
        type: '',
        description: ''
      });
    }
  }, [showWizard]);

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));

    // Update architecture data based on answers
    if (questionId === 'projectName') {
      setArchitectureData(prev => ({ ...prev, name: value }));
    } else if (questionId === 'projectDescription') {
      setArchitectureData(prev => ({ ...prev, description: value }));
    } else if (questionId === 'diagramType') {
      setArchitectureData(prev => ({ ...prev, type: value }));
    }
  };

  const handleNext = () => {
    if (currentStep < wizardSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Generate architecture diagram based on answers
      const diagram = await generateArchitectureDiagram();
      
      // Save to backend
      const response = await fetch(`/api/projects/${projectId}/architecture-diagrams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...architectureData,
          content: JSON.stringify(diagram),
          projectId
        }),
      });

      if (response.ok) {
        const savedDiagram = await response.json();
        onDiagramCreated(savedDiagram);
        setShowWizard(false);
      }
    } catch (error) {
      console.error('Failed to create architecture diagram:', error);
    }
  };

  const generateArchitectureDiagram = async (): Promise<any> => {
    // This would integrate with AI to generate the actual diagram
    // For now, we'll create a template based on the answers
    
    const diagram = {
      type: architectureData.type,
      components: [],
      connections: [],
      metadata: {
        projectName: architectureData.name,
        description: architectureData.description,
        technologyStack: answers.technologyStack || [],
        deploymentModel: answers.deploymentModel || '',
        securityLevel: answers.securityLevel || '',
        compliance: answers.compliance || [],
        authentication: answers.authentication || [],
        apiType: answers.apiType || [],
        dataExchange: answers.dataExchange || ''
      }
    };

    // Add components based on technology stack
    if (answers.technologyStack) {
      if (answers.technologyStack.includes('React/Angular/Vue.js')) {
        diagram.components.push({
          id: 'frontend',
          name: 'Frontend Application',
          type: 'component',
          technology: 'React/Angular/Vue.js',
          description: 'User interface layer'
        });
      }

      if (answers.technologyStack.includes('Java/Spring Boot')) {
        diagram.components.push({
          id: 'backend',
          name: 'Backend Service',
          type: 'component',
          technology: 'Java/Spring Boot',
          description: 'Business logic and API layer'
        });
      }

      if (answers.technologyStack.includes('Database (PostgreSQL, MySQL, MongoDB)')) {
        diagram.components.push({
          id: 'database',
          name: 'Database',
          type: 'component',
          technology: 'PostgreSQL/MySQL/MongoDB',
          description: 'Data storage layer'
        });
      }
    }

    // Add security components
    if (answers.securityLevel && answers.securityLevel !== 'Basic (internal use only)') {
      diagram.components.push({
        id: 'security',
        name: 'Security Layer',
        type: 'component',
        technology: 'Security Framework',
        description: 'Authentication, authorization, and security controls'
      });
    }

    // Add deployment components
    if (answers.deploymentModel) {
      diagram.components.push({
        id: 'deployment',
        name: 'Deployment Platform',
        type: 'infrastructure',
        technology: answers.deploymentModel,
        description: 'Infrastructure and deployment platform'
      });
    }

    return diagram;
  };

  const renderQuestion = (question: Question) => {
    const value = answers[question.id] || '';

    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            required={question.required}
          />
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            required={question.required}
          >
            <option value="">Select an option...</option>
            {question.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );

      case 'multiselect':
        return (
          <div className="space-y-2">
            {question.options?.map(option => {
              const isSelected = Array.isArray(value) && value.includes(option);
              return (
                <label key={option} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      const currentValues = Array.isArray(value) ? value : [];
                      if (e.target.checked) {
                        handleAnswerChange(question.id, [...currentValues, option]);
                      } else {
                        handleAnswerChange(question.id, currentValues.filter(v => v !== option));
                      }
                    }}
                    className="rounded"
                  />
                  <span>{option}</span>
                </label>
              );
            })}
          </div>
        );

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            required={question.required}
          />
        );

      default:
        return null;
    }
  };

  const currentStepData = wizardSteps[currentStep];
  const isLastStep = currentStep === wizardSteps.length - 1;
  const canProceed = currentStepData.questions.every(q => {
    if (!q.required) return true;
    const answer = answers[q.id];
    if (q.type === 'multiselect') {
      return Array.isArray(answer) && answer.length > 0;
    }
    return answer && answer.toString().trim() !== '';
  });

  return (
    <div className="architecture-wizard">
      <button
        onClick={() => setShowWizard(true)}
        className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 text-lg font-medium"
      >
        🏗️ Architecture Wizard
      </button>

      {showWizard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Architecture Wizard</h2>
              <button
                onClick={() => setShowWizard(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                {wizardSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex-1 text-center ${
                      index <= currentStep ? 'text-blue-600' : 'text-gray-400'
                    }`}
                  >
                    {step.title}
                  </div>
                ))}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / wizardSteps.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Current Step */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">{currentStepData.title}</h3>
              <p className="text-gray-600 mb-6">{currentStepData.description}</p>

              <div className="space-y-6">
                {currentStepData.questions.map(question => (
                  <div key={question.id}>
                    <label className="block text-sm font-medium mb-2">
                      {question.text}
                      {question.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {renderQuestion(question)}
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className={`px-6 py-2 rounded-lg ${
                  currentStep === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-500 text-white hover:bg-gray-600'
                }`}
              >
                Previous
              </button>

              {isLastStep ? (
                <button
                  onClick={handleSubmit}
                  disabled={!canProceed}
                  className={`px-6 py-2 rounded-lg ${
                    canProceed
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Generate Architecture
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={!canProceed}
                  className={`px-6 py-2 rounded-lg ${
                    canProceed
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchitectureWizard;


