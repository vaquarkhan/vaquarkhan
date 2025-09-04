// Enhanced Story Workflow Management
class StoryWorkflow {
    constructor() {
        this.initializeWorkflow();
    }

    initializeWorkflow() {
        // Override existing story card click handler
        document.addEventListener('click', (e) => {
            const storyCard = e.target.closest('.story-card');
            if (storyCard && !e.target.closest('.architecture-link')) {
                const storyId = storyCard.getAttribute('data-story-id');
                this.openEnhancedStoryModal(storyId);
            }
        });

        // Initialize Mermaid for diagrams
        if (window.mermaid) {
            window.mermaid.initialize({ startOnLoad: true });
        }
    }

    openEnhancedStoryModal(storyId) {
        const story = this.getStoryById(storyId);
        if (!story) return;

        const modal = document.createElement('div');
        modal.className = 'modal-overlay enhanced-story-modal';
        modal.dataset.storyId = storyId;
        
        modal.innerHTML = `
            <div class="modal-content enhanced-story-content">
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
                
                <div class="story-header">
                    <h2>${story.title}</h2>
                    <div class="story-meta">
                        <span class="story-points">${story.points} points</span>
                        <span class="story-type">${story.type}</span>
                    </div>
                </div>

                <div class="story-details">
                    <div class="story-description">
                        <h3>Description</h3>
                        <p>${story.description}</p>
                    </div>
                    
                    <div class="story-criteria">
                        <h3>Acceptance Criteria</h3>
                        <ul>
                            ${story.acceptanceCriteria.map(criteria => `<li>${criteria}</li>`).join('')}
                        </ul>
                    </div>
                </div>

                <div class="workflow-progress">
                    <div class="progress-steps">
                        <div class="step ${this.hasArchitecture(storyId) ? 'completed' : 'active'}" data-step="architecture">
                            <div class="step-icon">🏗️</div>
                            <div class="step-label">Architecture</div>
                        </div>
                        <div class="step ${this.hasCode(storyId) ? 'completed' : this.hasArchitecture(storyId) ? 'active' : 'disabled'}" data-step="framework">
                            <div class="step-icon">💻</div>
                            <div class="step-label">Framework</div>
                        </div>
                    </div>
                </div>

                <div class="workflow-actions">
                    ${this.generateWorkflowActions(storyId)}
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.updateWorkflowStatus(storyId);
    }

    generateWorkflowActions(storyId) {
        const hasArch = this.hasArchitecture(storyId);
        const hasCode = this.hasCode(storyId);
        
        return `
            <div class="action-cards">
                <div class="action-card ${hasArch ? 'completed' : 'active'}">
                    <div class="card-header">
                        <h4>🏗️ System Architecture</h4>
                        <div class="card-status">${hasArch ? 'Completed' : 'Required'}</div>
                    </div>
                    <p>Design comprehensive system architecture with detailed diagrams, infrastructure code, and technology stack.</p>
                    
                    ${hasArch ? `
                        <div class="architecture-summary">
                            <div class="arch-type">Type: ${this.getArchitectureType(storyId)}</div>
                            <button class="action-button secondary" onclick="window.architectureManager?.showArchitectureViewer()">
                                📋 View Architecture
                            </button>
                        </div>
                    ` : `
                        <button class="action-button" onclick="window.architectureManager?.showArchitectureModal('${storyId}')">
                            🏗️ Design Architecture
                        </button>
                    `}
                </div>

                <div class="action-card ${!hasArch ? 'disabled' : hasCode ? 'completed' : 'active'}">
                    <div class="card-header">
                        <h4>💻 Code Implementation</h4>
                        <div class="card-status">${!hasArch ? 'Blocked' : hasCode ? 'Completed' : 'Ready'}</div>
                    </div>
                    <p>Generate production-ready code with visual editor, file management, and testing framework.</p>
                    
                    ${hasCode ? `
                        <div class="code-summary">
                            <div class="code-lang">Language: ${this.getCodeLanguage(storyId)}</div>
                            <button class="action-button secondary" onclick="window.codeGenerator?.showCodeGeneratorModal('${storyId}')">
                                📝 Edit Code
                            </button>
                        </div>
                    ` : `
                        <button class="action-button ${!hasArch ? 'disabled' : ''}" 
                                ${hasArch ? `onclick="window.codeGenerator?.showCodeGeneratorModal('${storyId}')"` : 'disabled'}>
                            💻 Generate Code
                        </button>
                    `}
                </div>

                <div class="action-card ${!hasCode ? 'disabled' : 'active'}">
                    <div class="card-header">
                        <h4>🚀 Deployment</h4>
                        <div class="card-status">${!hasCode ? 'Blocked' : 'Ready'}</div>
                    </div>
                    <p>Automated deployment pipeline with CI/CD, testing, and monitoring setup.</p>
                    
                    <button class="action-button ${!hasCode ? 'disabled' : ''}" 
                            ${hasCode ? `onclick="this.deployStory('${storyId}')"` : 'disabled'}>
                        🚀 Deploy to Production
                    </button>
                </div>
            </div>
        `;
    }

    hasArchitecture(storyId) {
        const architecture = window.architectureManager?.currentArchitecture;
        return architecture && architecture.storyId === storyId;
    }

    hasCode(storyId) {
        const code = window.codeGenerator?.generatedCode[storyId];
        return code && Object.keys(code.files || {}).length > 0;
    }

    hasDeployment(storyId) {
        const deployments = JSON.parse(localStorage.getItem('storyDeployments') || '{}');
        return deployments[storyId];
    }

    getArchitectureType(storyId) {
        const architecture = window.architectureManager?.currentArchitecture;
        return architecture?.type || 'Unknown';
    }

    getCodeLanguage(storyId) {
        const code = window.codeGenerator?.generatedCode[storyId];
        return code?.language || 'Unknown';
    }

    updateWorkflowStatus(storyId) {
        // Update progress indicators
        const modal = document.querySelector(`[data-story-id="${storyId}"]`);
        if (!modal) return;

        const steps = modal.querySelectorAll('.step');
        const hasArch = this.hasArchitecture(storyId);
        const hasCode = this.hasCode(storyId);
        const hasDeploy = this.hasDeployment(storyId);

        // Update step states
        steps[0].className = `step ${hasArch ? 'completed' : 'active'}`;
        steps[1].className = `step ${hasCode ? 'completed' : hasArch ? 'active' : 'disabled'}`;
    }

    deployStory(storyId) {
        // Mock deployment process
        const modal = document.createElement('div');
        modal.className = 'modal-overlay deployment-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>🚀 Deploying Story</h2>
                <div class="deployment-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" id="deploy-progress"></div>
                    </div>
                    <div class="progress-text" id="deploy-status">Initializing deployment...</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.simulateDeployment(storyId, modal);
    }

    async simulateDeployment(storyId, modal) {
        const steps = [
            { progress: 20, text: 'Building application...' },
            { progress: 40, text: 'Running tests...' },
            { progress: 60, text: 'Creating Docker image...' },
            { progress: 80, text: 'Deploying to cloud...' },
            { progress: 100, text: 'Deployment complete!' }
        ];

        for (const step of steps) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            modal.querySelector('#deploy-progress').style.width = step.progress + '%';
            modal.querySelector('#deploy-status').textContent = step.text;
        }

        // Save deployment info
        const deployments = JSON.parse(localStorage.getItem('storyDeployments') || '{}');
        deployments[storyId] = {
            url: `https://app-${storyId}.turboagile.dev`,
            timestamp: new Date().toISOString(),
            status: 'deployed'
        };
        localStorage.setItem('storyDeployments', JSON.stringify(deployments));

        setTimeout(() => {
            modal.remove();
            this.updateWorkflowStatus(storyId);
        }, 2000);
    }

    getStoryById(storyId) {
        const stories = JSON.parse(localStorage.getItem('projectStories') || '[]');
        return stories.find(s => s.id === storyId);
    }
}

// Initialize Enhanced Story Workflow
window.storyWorkflow = new StoryWorkflow();