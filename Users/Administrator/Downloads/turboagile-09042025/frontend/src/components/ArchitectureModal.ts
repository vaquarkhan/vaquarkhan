// Architecture Modal with Gemini AI and Rich UI
import { CONFIG } from '../../config.js';

export class ArchitectureModal {
    private modal: HTMLElement | null = null;
    private storyId: string = '';
    private requirements: string = '';

    show(storyId: string, requirements: string) {
        this.storyId = storyId;
        this.requirements = requirements;
        this.createModal();
    }

    private createModal() {
        // Remove existing modal
        document.querySelector('.architecture-modal')?.remove();

        this.modal = document.createElement('div');
        this.modal.className = 'modal-overlay architecture-modal';
        this.modal.innerHTML = `
            <div class="modal-content architecture-content">
                <div class="modal-header">
                    <h2>🏗️ AI Architecture Generator</h2>
                    <button class="modal-close">&times;</button>
                </div>
                
                <div class="architecture-tabs">
                    <button class="arch-tab active" data-tab="generator">AI Generator</button>
                    <button class="arch-tab" data-tab="diagram">Architecture Diagram</button>
                    <button class="arch-tab" data-tab="export">Export & Share</button>
                </div>
                
                <div class="architecture-panels">
                    <div id="generator-panel" class="arch-panel active">
                        <div class="requirements-section">
                            <h3>📋 Project Requirements</h3>
                            <textarea id="arch-requirements" placeholder="Describe your project requirements...">${this.requirements}</textarea>
                        </div>
                        
                        <div class="suggestions-section">
                            <h3>💡 AI Suggestions</h3>
                            <div class="suggestion-chips">
                                <button class="suggestion-chip" data-type="microservices">Microservices</button>
                                <button class="suggestion-chip" data-type="monolith">Monolithic</button>
                                <button class="suggestion-chip" data-type="serverless">Serverless</button>
                                <button class="suggestion-chip" data-type="spa">Single Page App</button>
                                <button class="suggestion-chip" data-type="api">REST API</button>
                                <button class="suggestion-chip" data-type="realtime">Real-time</button>
                            </div>
                        </div>
                        
                        <div class="custom-prompt-section">
                            <h3>✏️ Custom Architecture Prompt</h3>
                            <textarea id="custom-arch-prompt" placeholder="Add specific architecture requirements, constraints, or preferences...\n\nExample: Use React frontend with Node.js backend, PostgreSQL database, deploy on AWS with Docker containers, include Redis caching..."></textarea>
                        </div>
                        
                        <div class="generation-controls">
                            <button id="create-arch-btn" class="generate-button">
                                <span class="btn-icon">🏗️</span>
                                Create Architecture
                            </button>
                        </div>
                        
                        <div id="architecture-output" class="architecture-output" style="display: none;">
                            <div class="output-header">
                                <h3>🏗️ Generated Architecture</h3>
                                <div class="output-actions">
                                    <button id="regenerate-btn" class="action-btn secondary">🔄 Regenerate</button>
                                    <button id="approve-arch-btn" class="action-btn primary">✅ Approve & Continue</button>
                                </div>
                            </div>
                            <div id="architecture-content" class="arch-content"></div>
                        </div>
                    </div>
                    
                    <div id="diagram-panel" class="arch-panel">
                        <div class="diagram-editor-container">
                            <div class="diagram-toolbar">
                                <button id="auto-diagram-btn" class="toolbar-btn">🤖 Auto Generate</button>
                                <button id="refresh-diagram-btn" class="toolbar-btn">🔄 Refresh</button>
                                <button id="download-diagram-btn" class="toolbar-btn">💾 Download</button>
                            </div>
                            
                            <div class="diagram-workspace">
                                <div class="diagram-editor">
                                    <h4>Mermaid Code Editor</h4>
                                    <textarea id="mermaid-code" placeholder="graph TB\n    A[Frontend] --> B[API Gateway]\n    B --> C[Database]">
graph TB
    A[Frontend React App] --> B[API Gateway]
    B --> C[Auth Service]
    B --> D[Business Logic]
    D --> E[PostgreSQL]
    D --> F[Redis Cache]
    B --> G[File Storage]
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style D fill:#e8f5e8
    style E fill:#fff3e0</textarea>
                                </div>
                                
                                <div class="diagram-preview">
                                    <h4>Live Preview</h4>
                                    <div id="mermaid-diagram" class="mermaid-container"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div id="export-panel" class="arch-panel">
                        <div class="export-options">
                            <div class="export-card">
                                <h3>📄 Export as PDF</h3>
                                <p>Complete architecture documentation</p>
                                <button id="export-pdf-btn" class="export-btn">Download PDF</button>
                            </div>
                            <div class="export-card">
                                <h3>📋 Copy to Clipboard</h3>
                                <p>Share architecture details</p>
                                <button id="copy-arch-btn" class="export-btn">Copy Text</button>
                            </div>
                            <div class="export-card">
                                <h3>🔗 Share Link</h3>
                                <p>Shareable architecture link</p>
                                <button id="share-link-btn" class="export-btn">Generate Link</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.setupEventListeners();
        document.body.appendChild(this.modal);
        document.body.style.overflow = 'hidden';
    }

    private setupEventListeners() {
        if (!this.modal) return;

        // Close modal
        this.modal.querySelector('.modal-close')?.addEventListener('click', () => this.close());
        
        // Tab switching
        this.modal.querySelectorAll('.arch-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                const tabName = target.dataset.tab;
                this.switchTab(tabName || 'generator');
            });
        });

        // Suggestion chips
        this.modal.querySelectorAll('.suggestion-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                target.classList.toggle('selected');
            });
        });

        // Create architecture
        this.modal.querySelector('#create-arch-btn')?.addEventListener('click', () => {
            this.generateArchitecture();
        });

        // Other buttons
        this.modal.querySelector('#regenerate-btn')?.addEventListener('click', () => this.generateArchitecture());
        this.modal.querySelector('#approve-arch-btn')?.addEventListener('click', () => this.approveArchitecture());
        this.modal.querySelector('#export-pdf-btn')?.addEventListener('click', () => this.exportPDF());
        this.modal.querySelector('#auto-diagram-btn')?.addEventListener('click', () => this.generateDiagram());
        this.modal.querySelector('#refresh-diagram-btn')?.addEventListener('click', () => this.refreshDiagram());
        
        // Live diagram editing
        const mermaidCode = this.modal.querySelector('#mermaid-code') as HTMLTextAreaElement;
        if (mermaidCode) {
            mermaidCode.addEventListener('input', () => {
                this.updateDiagramPreview();
            });
            // Initial render
            setTimeout(() => this.updateDiagramPreview(), 500);
        }
    }

    private switchTab(tabName: string) {
        if (!this.modal) return;

        // Update tab buttons
        this.modal.querySelectorAll('.arch-tab').forEach(tab => tab.classList.remove('active'));
        this.modal.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');

        // Update panels
        this.modal.querySelectorAll('.arch-panel').forEach(panel => panel.classList.remove('active'));
        this.modal.querySelector(`#${tabName}-panel`)?.classList.add('active');
    }

    private async generateArchitecture() {
        const generateBtn = this.modal?.querySelector('#create-arch-btn') as HTMLButtonElement;
        const output = this.modal?.querySelector('#architecture-output') as HTMLElement;
        const content = this.modal?.querySelector('#architecture-content') as HTMLElement;
        
        if (!generateBtn || !output || !content) return;

        generateBtn.disabled = true;
        generateBtn.innerHTML = '<span class="loading-spinner"></span> Creating...';
        
        try {
            const requirements = (this.modal?.querySelector('#arch-requirements') as HTMLTextAreaElement)?.value || this.requirements;
            const customPrompt = (this.modal?.querySelector('#custom-arch-prompt') as HTMLTextAreaElement)?.value || '';
            const selectedTypes = Array.from(this.modal?.querySelectorAll('.suggestion-chip.selected') || [])
                .map(chip => (chip as HTMLElement).dataset.type).join(', ');

            const architecture = await this.callGeminiAPI(requirements, selectedTypes, customPrompt);
            
            content.innerHTML = this.formatArchitecture(architecture);
            output.style.display = 'block';
            
            // Auto-generate diagram
            this.generateDiagram();
            
        } catch (error) {
            content.innerHTML = `<div class="error-message">Failed to generate architecture: ${error}</div>`;
            output.style.display = 'block';
        } finally {
            generateBtn.disabled = false;
            generateBtn.innerHTML = '<span class="btn-icon">🏗️</span> Create Architecture';
        }
    }
    
    private updateDiagramPreview() {
        const mermaidCode = (this.modal?.querySelector('#mermaid-code') as HTMLTextAreaElement)?.value;
        const diagramContainer = this.modal?.querySelector('#mermaid-diagram') as HTMLElement;
        
        if (!mermaidCode || !diagramContainer) return;
        
        try {
            diagramContainer.innerHTML = `<div class="mermaid">${mermaidCode}</div>`;
            
            // Initialize mermaid if available
            if (typeof (window as any).mermaid !== 'undefined') {
                (window as any).mermaid.init(undefined, diagramContainer.querySelector('.mermaid'));
            }
        } catch (error) {
            diagramContainer.innerHTML = `<div class="error-message">Invalid Mermaid syntax</div>`;
        }
    }
    
    private refreshDiagram() {
        this.updateDiagramPreview();
    }

    private async callGeminiAPI(requirements: string, types: string, customPrompt: string = ''): Promise<string> {
        const prompt = `You are a senior software architect. Generate a comprehensive software architecture for the following requirements:

REQUIREMENTS:
${requirements}

PREFERRED ARCHITECTURE TYPES: ${types}

${customPrompt ? `CUSTOM REQUIREMENTS:
${customPrompt}

` : ''}Please provide a detailed architecture document including:

1. **Architecture Overview**
   - High-level architecture pattern
   - Key architectural decisions and rationale

2. **System Components**
   - Frontend components and technologies
   - Backend services and APIs
   - Database design and data flow
   - External integrations

3. **Technology Stack**
   - Programming languages and frameworks
   - Databases and storage solutions
   - Infrastructure and deployment

4. **Security Architecture**
   - Authentication and authorization
   - Data protection measures
   - Security best practices

5. **Scalability & Performance**
   - Scaling strategies
   - Performance optimization
   - Monitoring and observability

6. **Deployment Architecture**
   - Environment setup
   - CI/CD pipeline
   - Infrastructure as Code

Format the response in clean markdown with proper headings and bullet points.`;

        // Try Gemini API
        try {
            const response = await fetch(`${CONFIG.ENDPOINTS.GEMINI}?key=${CONFIG.GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });

            if (response.ok) {
                const data = await response.json();
                return data.candidates[0].content.parts[0].text;
            }
        } catch (error) {
            console.error('Gemini API error:', error);
        }

        // Fallback architecture
        return this.generateFallbackArchitecture(requirements, types);
    }

    private generateFallbackArchitecture(requirements: string, types: string): string {
        return `# Software Architecture Document

## 🏗️ Architecture Overview
Based on your requirements, we recommend a **${types.includes('microservices') ? 'Microservices' : 'Modular Monolithic'}** architecture pattern.

### Key Architectural Decisions
- **Scalability**: Horizontal scaling with load balancers
- **Reliability**: Circuit breaker pattern for fault tolerance
- **Security**: Zero-trust security model with JWT authentication
- **Performance**: Caching layers and CDN integration

## 🔧 System Components

### Frontend Layer
- **Technology**: React 18 with TypeScript
- **State Management**: Redux Toolkit for complex state
- **UI Framework**: Material-UI or Tailwind CSS
- **Build Tool**: Vite for fast development

### Backend Services
- **API Gateway**: Express.js with rate limiting
- **Authentication Service**: JWT with refresh tokens
- **Business Logic**: Node.js microservices
- **File Storage**: AWS S3 or equivalent

### Database Layer
- **Primary Database**: PostgreSQL for ACID compliance
- **Cache Layer**: Redis for session and data caching
- **Search Engine**: Elasticsearch for full-text search
- **Analytics**: ClickHouse for real-time analytics

## 🛡️ Security Architecture
- **Authentication**: OAuth 2.0 + JWT tokens
- **Authorization**: Role-based access control (RBAC)
- **Data Encryption**: AES-256 at rest, TLS 1.3 in transit
- **API Security**: Rate limiting, input validation, CORS

## 📈 Scalability & Performance
- **Load Balancing**: Application Load Balancer (ALB)
- **Auto Scaling**: Container orchestration with Kubernetes
- **Caching Strategy**: Multi-level caching (CDN, Redis, Application)
- **Database Optimization**: Read replicas and connection pooling

## 🚀 Deployment Architecture
- **Containerization**: Docker containers
- **Orchestration**: Kubernetes or AWS ECS
- **CI/CD**: GitHub Actions with automated testing
- **Infrastructure**: Terraform for Infrastructure as Code
- **Monitoring**: Prometheus + Grafana stack

## 📊 Monitoring & Observability
- **Logging**: Centralized logging with ELK stack
- **Metrics**: Custom business metrics and system metrics
- **Tracing**: Distributed tracing with Jaeger
- **Alerting**: PagerDuty integration for critical alerts

This architecture provides a solid foundation for scalable, secure, and maintainable software development.`;
    }

    private formatArchitecture(architecture: string): string {
        // Convert markdown to HTML with syntax highlighting
        const lines = architecture.split('\n');
        let html = '';
        let inCodeBlock = false;
        
        for (const line of lines) {
            if (line.startsWith('```')) {
                inCodeBlock = !inCodeBlock;
                html += inCodeBlock ? '<pre><code>' : '</code></pre>';
            } else if (line.startsWith('# ')) {
                html += `<h1>${line.substring(2)}</h1>`;
            } else if (line.startsWith('## ')) {
                html += `<h2>${line.substring(3)}</h2>`;
            } else if (line.startsWith('### ')) {
                html += `<h3>${line.substring(4)}</h3>`;
            } else if (line.startsWith('- ')) {
                html += `<li>${line.substring(2)}</li>`;
            } else if (line.startsWith('**') && line.endsWith('**')) {
                html += `<strong>${line.slice(2, -2)}</strong><br>`;
            } else if (line.trim()) {
                html += `<p>${line}</p>`;
            }
        }
        
        return html;
    }

    private async generateDiagram() {
        const diagramContainer = this.modal?.querySelector('#mermaid-diagram') as HTMLElement;
        if (!diagramContainer) return;

        const mermaidCode = `
graph TB
    A[Frontend React App] --> B[API Gateway]
    B --> C[Authentication Service]
    B --> D[Business Logic Services]
    D --> E[PostgreSQL Database]
    D --> F[Redis Cache]
    B --> G[File Storage S3]
    
    H[Load Balancer] --> A
    I[CDN] --> A
    
    J[Monitoring] --> B
    J --> D
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style D fill:#e8f5e8
    style E fill:#fff3e0
`;

        diagramContainer.innerHTML = `<div class="mermaid">${mermaidCode}</div>`;
        
        // Initialize mermaid if available
        if (typeof (window as any).mermaid !== 'undefined') {
            (window as any).mermaid.init();
        }
    }

    private approveArchitecture() {
        // Save architecture and close modal
        const event = new CustomEvent('architectureApproved', {
            detail: { storyId: this.storyId }
        });
        document.dispatchEvent(event);
        this.close();
    }

    private exportPDF() {
        const content = this.modal?.querySelector('#architecture-content')?.innerHTML;
        if (!content) return;

        // Create PDF using jsPDF
        const { jsPDF } = (window as any).jspdf;
        const doc = new jsPDF();
        
        doc.setFontSize(20);
        doc.text('Software Architecture Document', 20, 20);
        
        doc.setFontSize(12);
        const splitText = doc.splitTextToSize(content.replace(/<[^>]*>/g, ''), 170);
        doc.text(splitText, 20, 40);
        
        doc.save('architecture-document.pdf');
    }

    private close() {
        this.modal?.remove();
        document.body.style.overflow = 'auto';
    }
}

// Global instance
export const architectureModal = new ArchitectureModal();