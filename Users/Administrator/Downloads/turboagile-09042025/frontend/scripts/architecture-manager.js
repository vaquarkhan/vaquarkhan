// Architecture Management System
class ArchitectureManager {
    constructor() {
        this.currentArchitecture = null;
        this.architectureTypes = [
            { id: 'microservices', name: 'Microservices', icon: '🏗️' },
            { id: 'monolith', name: 'Monolithic', icon: '🏢' },
            { id: 'serverless', name: 'Serverless', icon: '☁️' },
            { id: 'jamstack', name: 'JAMStack', icon: '⚡' },
            { id: 'event-driven', name: 'Event-Driven', icon: '🔄' },
            { id: 'layered', name: 'Layered', icon: '📚' }
        ];
    }

    async generateArchitecture(storyId, architectureType, customPrompt = '') {
        const story = this.getStoryById(storyId);
        if (!story) return null;

        const prompt = this.buildArchitecturePrompt(story, architectureType, customPrompt);
        
        try {
            const architecture = await this.callAIService(prompt);
            this.currentArchitecture = {
                id: Date.now().toString(),
                storyId,
                type: architectureType,
                content: architecture,
                diagram: await this.generateDiagram(architecture),
                terraform: architectureType.includes('cloud') ? await this.generateTerraform(architecture) : null,
                timestamp: new Date().toISOString()
            };
            
            this.saveArchitecture();
            this.updateUI();
            return this.currentArchitecture;
        } catch (error) {
            console.error('Architecture generation failed:', error);
            return null;
        }
    }

    buildArchitecturePrompt(story, type, customPrompt) {
        return `
Generate detailed ${type} architecture for: ${story.title}

Story Description: ${story.description}
Acceptance Criteria: ${story.acceptanceCriteria.join(', ')}

${customPrompt ? `Additional Requirements: ${customPrompt}` : ''}

Provide:
1. High-level architecture overview
2. Component breakdown
3. Data flow
4. Technology stack recommendations
5. Security considerations
6. Scalability patterns
7. Deployment strategy
${type.includes('cloud') ? '8. Cloud infrastructure requirements' : ''}
        `;
    }

    async generateDiagram(architecture) {
        // Generate Mermaid diagram
        return `
graph TB
    A[Frontend] --> B[API Gateway]
    B --> C[Microservice 1]
    B --> D[Microservice 2]
    C --> E[Database 1]
    D --> F[Database 2]
        `;
    }

    async generateTerraform(architecture) {
        return `
# Terraform Infrastructure
provider "aws" {
  region = "us-west-2"
}

resource "aws_ecs_cluster" "main" {
  name = "turbo-agile-cluster"
}

resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  
  tags = {
    Name = "turbo-agile-vpc"
  }
}
        `;
    }

    showArchitectureModal(storyId) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay architecture-modal';
        modal.innerHTML = `
            <div class="modal-content architecture-content">
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
                <h2>🏗️ Architecture Design</h2>
                
                <div class="architecture-selector">
                    <h3>Choose Architecture Type</h3>
                    <div class="architecture-grid">
                        ${this.architectureTypes.map(type => `
                            <div class="architecture-card" data-type="${type.id}">
                                <div class="arch-icon">${type.icon}</div>
                                <h4>${type.name}</h4>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="custom-prompt-section">
                    <h3>Custom Requirements (Optional)</h3>
                    <textarea id="architecture-prompt" placeholder="e.g., Use AWS services, implement caching, ensure high availability..."></textarea>
                </div>

                <div class="architecture-actions">
                    <button id="generate-architecture" class="action-button">Generate Architecture</button>
                </div>

                <div id="architecture-result" class="architecture-result" style="display: none;">
                    <div class="architecture-tabs">
                        <button class="tab-btn active" data-tab="overview">📝 Design Document</button>
                        <button class="tab-btn" data-tab="diagram">📊 Architecture Diagram</button>
                        <button class="tab-btn" data-tab="terraform">🏗️ Infrastructure Code</button>
                    </div>
                    
                    <div class="tab-content">
                        <div id="overview-tab" class="tab-panel active">
                            <div id="architecture-overview"></div>
                        </div>
                        <div id="diagram-tab" class="tab-panel">
                            <div id="architecture-diagram"></div>
                        </div>
                        <div id="terraform-tab" class="tab-panel">
                            <pre><code id="terraform-code"></code></pre>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.setupArchitectureEvents(storyId, modal);
    }

    setupArchitectureEvents(storyId, modal) {
        let selectedType = null;

        // Architecture type selection
        modal.querySelectorAll('.architecture-card').forEach(card => {
            card.addEventListener('click', () => {
                modal.querySelectorAll('.architecture-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                selectedType = card.dataset.type;
            });
        });

        // Generate architecture
        modal.querySelector('#generate-architecture').addEventListener('click', async () => {
            if (!selectedType) {
                alert('Please select an architecture type');
                return;
            }

            const customPrompt = modal.querySelector('#architecture-prompt').value;
            const button = modal.querySelector('#generate-architecture');
            
            button.textContent = 'Generating...';
            button.disabled = true;

            const architecture = await this.generateArchitecture(storyId, selectedType, customPrompt);
            
            if (architecture) {
                this.displayArchitectureResult(modal, architecture);
                modal.querySelector('#architecture-result').style.display = 'flex';
                
                // Mark architecture story as complete
                const stories = JSON.parse(localStorage.getItem('projectStories') || '[]');
                const archStory = stories.find(s => s.id === storyId);
                if (archStory) {
                    archStory.status = 'done';
                    localStorage.setItem('projectStories', JSON.stringify(stories));
                    window.projectStories?.checkAndUnblockStories();
                }
            }

            button.textContent = 'Generate Architecture';
            button.disabled = false;
        });

        // Tab switching
        modal.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;
                modal.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                modal.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
                
                btn.classList.add('active');
                modal.querySelector(`#${tabId}-tab`).classList.add('active');
            });
        });
    }

    displayArchitectureResult(modal, architecture) {
        // Overview
        modal.querySelector('#architecture-overview').innerHTML = `
            <div class="architecture-details">
                <h4>Architecture: ${architecture.type}</h4>
                <div class="architecture-content">${architecture.content}</div>
            </div>
        `;

        // Diagram
        if (architecture.diagram) {
            modal.querySelector('#architecture-diagram').innerHTML = `
                <div class="mermaid">${architecture.diagram}</div>
            `;
            // Initialize Mermaid if available
            if (window.mermaid) {
                window.mermaid.init();
            }
        }

        // Terraform
        if (architecture.terraform) {
            modal.querySelector('#terraform-code').textContent = architecture.terraform;
        }
    }

    getStoryById(storyId) {
        const stories = JSON.parse(localStorage.getItem('projectStories') || '[]');
        return stories.find(s => s.id === storyId);
    }

    saveArchitecture() {
        localStorage.setItem('projectArchitecture', JSON.stringify(this.currentArchitecture));
    }

    loadArchitecture() {
        const saved = localStorage.getItem('projectArchitecture');
        if (saved) {
            this.currentArchitecture = JSON.parse(saved);
        }
    }

    async callAIService(prompt) {
        // Mock AI response for now
        return `
## ${prompt.includes('microservices') ? 'Microservices' : 'Monolithic'} Architecture

### Overview
This architecture provides a scalable, maintainable solution for the application requirements.

### Components
1. **Frontend Layer**: React/TypeScript SPA
2. **API Gateway**: Route management and authentication
3. **Business Logic**: Core application services
4. **Data Layer**: Database and caching
5. **Infrastructure**: Cloud deployment and monitoring

### Technology Stack
- Frontend: React, TypeScript, Vite
- Backend: Node.js, Express
- Database: PostgreSQL
- Cache: Redis
- Deployment: Docker, Kubernetes

### Security
- JWT authentication
- HTTPS encryption
- Input validation
- Rate limiting

### Scalability
- Horizontal scaling
- Load balancing
- Database sharding
- CDN integration
        `;
    }

    updateUI() {
        // Update all story cards to show architecture link
        document.querySelectorAll('.story-card').forEach(card => {
            if (!card.querySelector('.architecture-link')) {
                const link = document.createElement('div');
                link.className = 'architecture-link';
                link.innerHTML = '🏗️ View Architecture';
                link.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.showArchitectureViewer();
                });
                card.appendChild(link);
            }
        });
    }

    showArchitectureViewer() {
        if (!this.currentArchitecture) return;

        const modal = document.createElement('div');
        modal.className = 'modal-overlay architecture-viewer';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
                <h2>🏗️ Project Architecture</h2>
                <div class="architecture-display">
                    <div class="arch-type">Type: ${this.currentArchitecture.type}</div>
                    <div class="arch-content">${this.currentArchitecture.content}</div>
                    ${this.currentArchitecture.diagram ? `<div class="mermaid">${this.currentArchitecture.diagram}</div>` : ''}
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
}

// Initialize Architecture Manager
window.architectureManager = new ArchitectureManager();
window.architectureManager.loadArchitecture();