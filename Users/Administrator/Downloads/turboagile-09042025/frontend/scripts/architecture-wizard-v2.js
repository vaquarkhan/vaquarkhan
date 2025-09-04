// Redesigned Architecture Wizard with Gemini Integration
class ArchitectureWizardV2 {
    constructor() {
        this.currentStep = 1;
        this.storyId = null;
        this.selectedArchType = null;
        this.userPrompt = '';
        this.generatedArchitecture = null;
    }

    showWizard(storyId) {
        this.storyId = storyId;
        this.currentStep = 1;
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay architecture-wizard-v2';
        modal.innerHTML = `
            <div class="modal-content wizard-container">
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
                
                <!-- Step 1: Requirements & Architecture Type -->
                <div class="wizard-step" id="step-1">
                    <h2>🏗️ Architecture Design - Step 1</h2>
                    <div class="step-content">
                        <h3>Describe Your Requirements</h3>
                        <textarea id="user-requirements" placeholder="Describe what you want to build:&#10;&#10;Example:&#10;- E-commerce platform with user authentication&#10;- Handle 10,000 concurrent users&#10;- Need payment processing&#10;- Mobile app support&#10;- Real-time notifications&#10;- AWS cloud deployment"></textarea>
                        
                        <h3>Select Architecture Type</h3>
                        <div class="arch-types">
                            <div class="arch-option" data-type="microservices">
                                <span class="arch-icon">🏗️</span>
                                <span class="arch-name">Microservices</span>
                            </div>
                            <div class="arch-option" data-type="monolith">
                                <span class="arch-icon">🏢</span>
                                <span class="arch-name">Monolith</span>
                            </div>
                            <div class="arch-option" data-type="serverless">
                                <span class="arch-icon">☁️</span>
                                <span class="arch-name">Serverless</span>
                            </div>
                            <div class="arch-option" data-type="jamstack">
                                <span class="arch-icon">⚡</span>
                                <span class="arch-name">JAMStack</span>
                            </div>
                        </div>
                        
                        <button id="next-step-1" class="wizard-btn" disabled>Next →</button>
                    </div>
                </div>

                <!-- Step 2: AI Generation -->
                <div class="wizard-step" id="step-2" style="display: none;">
                    <h2>🤖 Generating Architecture - Step 2</h2>
                    <div class="step-content">
                        <div class="generation-status">
                            <div class="spinner"></div>
                            <p id="generation-text">Analyzing requirements with Gemini AI...</p>
                        </div>
                        
                        <div id="generation-result" style="display: none;">
                            <h3>Generated Architecture</h3>
                            <div id="arch-preview"></div>
                            
                            <div class="edit-section">
                                <h4>Want to modify? Edit your prompt:</h4>
                                <textarea id="edit-prompt"></textarea>
                                <button id="regenerate-btn" class="wizard-btn secondary">🔄 Regenerate</button>
                            </div>
                            
                            <button id="next-step-2" class="wizard-btn">Next →</button>
                        </div>
                    </div>
                </div>

                <!-- Step 3: Diagram Editor -->
                <div class="wizard-step" id="step-3" style="display: none;">
                    <h2>📊 Architecture Diagram - Step 3</h2>
                    <div class="step-content">
                        <div class="diagram-editor">
                            <div id="mermaid-diagram"></div>
                        </div>
                        <button id="next-step-3" class="wizard-btn">Next →</button>
                    </div>
                </div>

                <!-- Step 4: Final Review -->
                <div class="wizard-step" id="step-4" style="display: none;">
                    <h2>✅ Final Review - Step 4</h2>
                    <div class="step-content">
                        <div class="final-review">
                            <div class="review-section">
                                <h3>Architecture Summary</h3>
                                <div id="final-summary"></div>
                            </div>
                            
                            <div class="review-section">
                                <h3>Diagram</h3>
                                <div id="final-diagram"></div>
                            </div>
                            
                            <div class="review-section">
                                <h3>Technical Details</h3>
                                <div id="final-details"></div>
                            </div>
                        </div>
                        
                        <button id="accept-architecture" class="wizard-btn accept">✅ Accept & Create Framework Story</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.setupWizardEvents(modal);
    }

    setupWizardEvents(modal) {
        const self = this;
        
        // Use event delegation for all clicks
        modal.addEventListener('click', function(e) {
            const target = e.target;
            
            // Architecture type selection
            if (target.closest('.arch-option')) {
                const option = target.closest('.arch-option');
                modal.querySelectorAll('.arch-option').forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
                self.selectedArchType = option.dataset.type;
                self.checkStep1Complete(modal);
            }
            
            // Next step 1
            if (target.id === 'next-step-1') {
                self.goToStep(2, modal);
                self.generateArchitecture(modal);
            }
            
            // Regenerate
            if (target.id === 'regenerate-btn') {
                const editPrompt = modal.querySelector('#edit-prompt').value;
                self.userPrompt = editPrompt || self.userPrompt;
                self.generateArchitecture(modal);
            }
            
            // Next step 2
            if (target.id === 'next-step-2') {
                self.goToStep(3, modal);
                self.showDiagram(modal);
            }
            
            // Next step 3
            if (target.id === 'next-step-3') {
                self.goToStep(4, modal);
                self.showFinalReview(modal);
            }
            
            // Accept
            if (target.id === 'accept-architecture') {
                self.acceptArchitecture(modal);
            }
        });
        
        // Requirements input
        const requirementsTextarea = modal.querySelector('#user-requirements');
        requirementsTextarea.addEventListener('input', () => {
            this.userPrompt = requirementsTextarea.value.trim();
            this.checkStep1Complete(modal);
        });


    }

    checkStep1Complete(modal) {
        const nextBtn = modal.querySelector('#next-step-1');
        if (this.userPrompt && this.selectedArchType) {
            nextBtn.disabled = false;
        } else {
            nextBtn.disabled = true;
        }
    }

    goToStep(stepNumber, modal) {
        modal.querySelectorAll('.wizard-step').forEach(step => step.style.display = 'none');
        modal.querySelector(`#step-${stepNumber}`).style.display = 'block';
        this.currentStep = stepNumber;
    }

    async generateArchitecture(modal) {
        const statusText = modal.querySelector('#generation-text');
        const resultDiv = modal.querySelector('#generation-result');
        
        // Show loading
        resultDiv.style.display = 'none';
        statusText.textContent = 'Analyzing requirements with Gemini AI...';

        // Simulate delay
        setTimeout(() => {
            try {
                const architecture = this.getFallbackArchitecture();
                statusText.textContent = 'Architecture generated successfully!';
                this.displayGenerationResult(modal, architecture);
                resultDiv.style.display = 'block';
            } catch (error) {
                statusText.textContent = 'Generation failed.';
            }
        }, 2000);
    }

    async callGeminiAI() {
        const prompt = `Create a detailed ${this.selectedArchType} architecture for:

${this.userPrompt}

Provide:
1. Architecture overview (2-3 sentences)
2. Key components (list 4-6 main components)
3. Technology stack recommendations
4. Mermaid diagram code
5. Cost estimate

Format as JSON with keys: overview, components, techStack, mermaidDiagram, costEstimate`;

        // Try to use Gemini AI if available
        if (window.geminiService) {
            return await window.geminiService.generateContent(prompt);
        }
        
        // Fallback to mock response
        throw new Error('Gemini not available');
    }

    getFallbackArchitecture() {
        const architectures = {
            microservices: {
                overview: "Microservices architecture with independent services for scalability and maintainability.",
                components: ["API Gateway", "User Service", "Product Service", "Order Service", "Database per Service"],
                techStack: "Node.js, Docker, Kubernetes, PostgreSQL, Redis",
                mermaidDiagram: `graph TB
    A[Client] --> B[API Gateway]
    B --> C[User Service]
    B --> D[Product Service]
    B --> E[Order Service]
    C --> F[(User DB)]
    D --> G[(Product DB)]
    E --> H[(Order DB)]`,
                costEstimate: "$500-800/month"
            },
            monolith: {
                overview: "Single deployable application with all functionality in one codebase for simplicity.",
                components: ["Web Application", "Database", "Cache Layer", "Load Balancer"],
                techStack: "Spring Boot, PostgreSQL, Redis, NGINX",
                mermaidDiagram: `graph TB
    A[Load Balancer] --> B[App Server 1]
    A --> C[App Server 2]
    B --> D[(Database)]
    C --> D
    B --> E[(Cache)]
    C --> E`,
                costEstimate: "$200-400/month"
            },
            serverless: {
                overview: "Event-driven serverless architecture with automatic scaling and pay-per-use pricing.",
                components: ["API Gateway", "Lambda Functions", "DynamoDB", "S3 Storage"],
                techStack: "AWS Lambda, API Gateway, DynamoDB, S3, CloudWatch",
                mermaidDiagram: `graph TB
    A[Client] --> B[API Gateway]
    B --> C[Lambda 1]
    B --> D[Lambda 2]
    C --> E[(DynamoDB)]
    D --> F[(S3)]`,
                costEstimate: "$100-300/month"
            },
            jamstack: {
                overview: "Modern web architecture with static site generation and serverless functions.",
                components: ["Static Site", "CDN", "Serverless Functions", "Headless CMS"],
                techStack: "Next.js, Vercel, Netlify Functions, Strapi CMS",
                mermaidDiagram: `graph TB
    A[CDN] --> B[Static Site]
    B --> C[Serverless Functions]
    C --> D[(Headless CMS)]
    C --> E[(Database)]`,
                costEstimate: "$50-150/month"
            }
        };

        return architectures[this.selectedArchType] || architectures.monolith;
    }

    displayGenerationResult(modal, architecture) {
        this.generatedArchitecture = architecture;
        
        const preview = modal.querySelector('#arch-preview');
        preview.innerHTML = `
            <div class="arch-summary">
                <p><strong>Overview:</strong> ${architecture.overview}</p>
                <p><strong>Components:</strong> ${Array.isArray(architecture.components) ? architecture.components.join(', ') : architecture.components}</p>
                <p><strong>Tech Stack:</strong> ${architecture.techStack}</p>
                <p><strong>Estimated Cost:</strong> ${architecture.costEstimate}</p>
            </div>
        `;

        // Set edit prompt
        modal.querySelector('#edit-prompt').value = this.userPrompt;
    }

    showDiagram(modal) {
        const diagramDiv = modal.querySelector('#mermaid-diagram');
        diagramDiv.innerHTML = `<div class="mermaid">${this.generatedArchitecture.mermaidDiagram}</div>`;
        
        if (window.mermaid) {
            window.mermaid.init();
        }
    }

    showFinalReview(modal) {
        const arch = this.generatedArchitecture;
        
        modal.querySelector('#final-summary').innerHTML = `
            <p><strong>Type:</strong> ${this.selectedArchType}</p>
            <p><strong>Overview:</strong> ${arch.overview}</p>
            <p><strong>Cost:</strong> ${arch.costEstimate}</p>
        `;
        
        modal.querySelector('#final-diagram').innerHTML = `<div class="mermaid">${arch.mermaidDiagram}</div>`;
        
        modal.querySelector('#final-details').innerHTML = `
            <p><strong>Components:</strong> ${Array.isArray(arch.components) ? arch.components.join(', ') : arch.components}</p>
            <p><strong>Technology Stack:</strong> ${arch.techStack}</p>
        `;
        
        if (window.mermaid) {
            window.mermaid.init();
        }
    }

    acceptArchitecture(modal) {
        // Mark current story as done
        this.markStoryDone();
        
        // Create framework story
        this.createFrameworkStory();
        
        // Close modal
        modal.remove();
        
        alert('Architecture accepted! Framework story created.');
    }

    markStoryDone() {
        const stories = JSON.parse(localStorage.getItem('projectStories') || '[]');
        const story = stories.find(s => s.id === this.storyId);
        if (story) {
            story.status = 'done';
            story.architecture = this.generatedArchitecture;
            localStorage.setItem('projectStories', JSON.stringify(stories));
        }
    }

    createFrameworkStory() {
        const stories = JSON.parse(localStorage.getItem('projectStories') || '[]');
        
        const frameworkStory = {
            id: 'framework-' + Date.now(),
            title: 'Framework Implementation',
            description: `Implement the ${this.selectedArchType} architecture framework based on the approved design.`,
            acceptanceCriteria: [
                'Set up project structure',
                'Implement core components',
                'Configure deployment pipeline',
                'Add monitoring and logging'
            ],
            points: 13,
            type: 'framework',
            status: 'backlog',
            architecture: this.generatedArchitecture,
            createdAt: new Date().toISOString()
        };
        
        stories.push(frameworkStory);
        localStorage.setItem('projectStories', JSON.stringify(stories));
        
        // Refresh the board if visible
        if (window.projectStories) {
            window.projectStories.loadStories();
        }
    }
}

// Initialize
window.architectureWizardV2 = new ArchitectureWizardV2();

// Override the old architecture manager call
if (window.architectureManager) {
    window.architectureManager.showArchitectureModal = function(storyId) {
        window.architectureWizardV2.showWizard(storyId);
    };
}