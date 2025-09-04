// Quick fix for wizard navigation issues
document.addEventListener('DOMContentLoaded', function() {
    console.log('Wizard fix loaded');
    
    // Fix architecture wizard button clicks
    document.addEventListener('click', function(e) {
        const target = e.target;
        
        // Fix pattern selection
        if (target.closest('.pattern-card')) {
            const card = target.closest('.pattern-card');
            const modal = card.closest('.architecture-wizard');
            
            // Remove selected from all cards
            modal.querySelectorAll('.pattern-card').forEach(c => c.classList.remove('selected'));
            
            // Add selected to clicked card
            card.classList.add('selected');
            
            // Enable continue button
            const continueBtn = modal.querySelector('#select-pattern');
            if (continueBtn) {
                continueBtn.disabled = false;
                continueBtn.textContent = 'Select Pattern & Continue →';
            }
            
            console.log('Pattern selected:', card.dataset.type);
        }
        
        // Fix step navigation
        if (target.id === 'select-pattern') {
            e.preventDefault();
            const modal = target.closest('.architecture-wizard');
            showStep(modal, 'step-requirements');
            console.log('Moving to requirements step');
        }
        
        if (target.id === 'back-to-theory') {
            e.preventDefault();
            const modal = target.closest('.architecture-wizard');
            showStep(modal, 'step-theory');
            console.log('Back to theory step');
        }
        
        if (target.id === 'generate-architecture') {
            e.preventDefault();
            generateArchitectureQuick(target);
            console.log('Generating architecture');
        }
        
        // Fix tab switching
        if (target.classList.contains('tab-btn')) {
            e.preventDefault();
            const modal = target.closest('.architecture-wizard');
            const tabId = target.dataset.tab;
            
            // Update tab buttons
            modal.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            target.classList.add('active');
            
            // Update tab panels
            modal.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
            const targetPanel = modal.querySelector(`#${tabId}-tab`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
            
            console.log('Tab switched to:', tabId);
        }
        
        // Fix final actions
        if (target.id === 'approve-architecture') {
            e.preventDefault();
            const modal = target.closest('.modal-overlay');
            const storyId = modal.dataset.storyId;
            
            alert('Architecture approved and saved!');
            modal.remove();
            
            // Update story status
            if (storyId && window.projectStories) {
                window.projectStories.updateStoryStatus(storyId, 'in-progress');
            }
            
            console.log('Architecture approved for story:', storyId);
        }
        
        if (target.id === 'restart-wizard') {
            e.preventDefault();
            const modal = target.closest('.architecture-wizard');
            showStep(modal, 'step-theory');
            
            // Reset selections
            modal.querySelectorAll('.pattern-card').forEach(c => c.classList.remove('selected'));
            const continueBtn = modal.querySelector('#select-pattern');
            if (continueBtn) {
                continueBtn.disabled = true;
                continueBtn.textContent = 'Select Pattern & Continue →';
            }
            
            console.log('Wizard restarted');
        }
        
        // Test architecture wizard button
        if (target.id === 'test-architecture-wizard') {
            e.preventDefault();
            console.log('Testing new architecture wizard');
            
            // Create a mock story ID for testing
            const testStoryId = 'test-story-' + Date.now();
            
            if (window.architectureWizardV2) {
                window.architectureWizardV2.showWizard(testStoryId);
            } else {
                alert('Architecture wizard not loaded. Please refresh the page.');
            }
        }
    });
    
    function showStep(modal, stepId) {
        // Hide all steps
        modal.querySelectorAll('.wizard-step').forEach(step => {
            step.style.display = 'none';
        });
        
        // Show target step
        const targetStep = modal.querySelector(`#${stepId}`);
        if (targetStep) {
            targetStep.style.display = 'block';
        }
    }
    
    function generateArchitectureQuick(button) {
        const modal = button.closest('.architecture-wizard');
        const requirements = modal.querySelector('#architecture-prompt').value;
        const selectedCard = modal.querySelector('.pattern-card.selected');
        
        if (!selectedCard) {
            alert('Please select an architecture pattern first');
            return;
        }
        
        const patternType = selectedCard.dataset.type;
        
        // Show loading state
        button.textContent = '🔄 Generating Architecture...';
        button.disabled = true;
        
        // Simulate architecture generation
        setTimeout(() => {
            // Create mock architecture result
            const mockArchitecture = createMockArchitecture(patternType, requirements);
            
            // Display results
            displayArchitectureResults(modal, mockArchitecture);
            
            // Show final step
            showStep(modal, 'step-final');
            
            // Reset button
            button.textContent = 'Generate Architecture →';
            button.disabled = false;
            
            console.log('Architecture generated for pattern:', patternType);
        }, 2000);
    }
    
    function createMockArchitecture(patternType, requirements) {
        const architectures = {
            'microservices': {
                diagram: `graph TB
    subgraph "Frontend"
        UI[React App]
    end
    subgraph "Services"
        API[API Gateway]
        Auth[Auth Service]
        User[User Service]
        Product[Product Service]
    end
    subgraph "Data"
        DB[(Database)]
        Cache[(Redis)]
    end
    
    UI --> API
    API --> Auth
    API --> User
    API --> Product
    User --> DB
    Product --> DB
    Auth --> Cache`,
                theory: `<h3>Microservices Architecture</h3>
                <p>This architecture breaks down the application into small, independent services that can be developed, deployed, and scaled independently.</p>
                <h4>Key Benefits:</h4>
                <ul>
                    <li>Independent deployment and scaling</li>
                    <li>Technology diversity</li>
                    <li>Fault isolation</li>
                    <li>Team autonomy</li>
                </ul>
                <h4>Components:</h4>
                <ul>
                    <li><strong>API Gateway:</strong> Single entry point for all client requests</li>
                    <li><strong>Auth Service:</strong> Handles authentication and authorization</li>
                    <li><strong>User Service:</strong> Manages user profiles and preferences</li>
                    <li><strong>Product Service:</strong> Handles product catalog and inventory</li>
                </ul>`,
                cost: `<div class="cost-breakdown">
                    <h4>Monthly Cost Estimate</h4>
                    <div class="cost-item">
                        <span>Compute (4 services)</span>
                        <span>$400/month</span>
                    </div>
                    <div class="cost-item">
                        <span>Database</span>
                        <span>$200/month</span>
                    </div>
                    <div class="cost-item">
                        <span>Load Balancer</span>
                        <span>$25/month</span>
                    </div>
                    <div class="cost-item">
                        <span>Monitoring</span>
                        <span>$50/month</span>
                    </div>
                    <div class="cost-total">
                        <strong>Total: $675/month</strong>
                    </div>
                </div>`
            },
            'monolith': {
                diagram: `graph TB
    subgraph "Client"
        Browser[Web Browser]
    end
    subgraph "Application"
        LB[Load Balancer]
        App1[App Server 1]
        App2[App Server 2]
    end
    subgraph "Data"
        DB[(Primary DB)]
        Cache[(Redis Cache)]
    end
    
    Browser --> LB
    LB --> App1
    LB --> App2
    App1 --> DB
    App2 --> DB
    App1 --> Cache
    App2 --> Cache`,
                theory: `<h3>Monolithic Architecture</h3>
                <p>A single deployable unit containing all application functionality, suitable for smaller teams and simpler requirements.</p>
                <h4>Key Benefits:</h4>
                <ul>
                    <li>Simple deployment and testing</li>
                    <li>Easy debugging</li>
                    <li>Consistent technology stack</li>
                    <li>Lower operational complexity</li>
                </ul>
                <h4>Components:</h4>
                <ul>
                    <li><strong>Load Balancer:</strong> Distributes traffic across app servers</li>
                    <li><strong>Application Servers:</strong> Handle all business logic</li>
                    <li><strong>Database:</strong> Centralized data storage</li>
                    <li><strong>Cache:</strong> Improves performance</li>
                </ul>`,
                cost: `<div class="cost-breakdown">
                    <h4>Monthly Cost Estimate</h4>
                    <div class="cost-item">
                        <span>Compute (2 servers)</span>
                        <span>$200/month</span>
                    </div>
                    <div class="cost-item">
                        <span>Database</span>
                        <span>$150/month</span>
                    </div>
                    <div class="cost-item">
                        <span>Load Balancer</span>
                        <span>$25/month</span>
                    </div>
                    <div class="cost-item">
                        <span>Monitoring</span>
                        <span>$25/month</span>
                    </div>
                    <div class="cost-total">
                        <strong>Total: $400/month</strong>
                    </div>
                </div>`
            },
            'serverless': {
                diagram: `graph TB
    subgraph "Client"
        Web[Web App]
        Mobile[Mobile App]
    end
    subgraph "AWS Services"
        API[API Gateway]
        Lambda1[Auth Function]
        Lambda2[User Function]
        Lambda3[Product Function]
    end
    subgraph "Data"
        DDB[(DynamoDB)]
        S3[(S3 Storage)]
    end
    
    Web --> API
    Mobile --> API
    API --> Lambda1
    API --> Lambda2
    API --> Lambda3
    Lambda1 --> DDB
    Lambda2 --> DDB
    Lambda3 --> S3`,
                theory: `<h3>Serverless Architecture</h3>
                <p>Event-driven compute model where you run code without provisioning or managing servers.</p>
                <h4>Key Benefits:</h4>
                <ul>
                    <li>Zero server management</li>
                    <li>Automatic scaling</li>
                    <li>Pay-per-use pricing</li>
                    <li>Built-in high availability</li>
                </ul>
                <h4>Components:</h4>
                <ul>
                    <li><strong>API Gateway:</strong> Manages API requests and responses</li>
                    <li><strong>Lambda Functions:</strong> Execute business logic</li>
                    <li><strong>DynamoDB:</strong> NoSQL database for fast access</li>
                    <li><strong>S3:</strong> Object storage for files and static content</li>
                </ul>`,
                cost: `<div class="cost-breakdown">
                    <h4>Monthly Cost Estimate</h4>
                    <div class="cost-item">
                        <span>Lambda Functions</span>
                        <span>$150/month</span>
                    </div>
                    <div class="cost-item">
                        <span>API Gateway</span>
                        <span>$60/month</span>
                    </div>
                    <div class="cost-item">
                        <span>DynamoDB</span>
                        <span>$100/month</span>
                    </div>
                    <div class="cost-item">
                        <span>S3 Storage</span>
                        <span>$30/month</span>
                    </div>
                    <div class="cost-total">
                        <strong>Total: $340/month</strong>
                    </div>
                </div>`
            }
        };
        
        return architectures[patternType] || architectures['monolith'];
    }
    
    function displayArchitectureResults(modal, architecture) {
        // Update diagram tab
        const diagramTab = modal.querySelector('#diagram-tab');
        if (diagramTab) {
            diagramTab.innerHTML = `
                <div class="diagram-editor">
                    <div class="diagram-toolbar">
                        <button class="btn-small">🔍 Zoom In</button>
                        <button class="btn-small">🔍 Zoom Out</button>
                        <button class="btn-small">💾 Export PNG</button>
                    </div>
                    <div class="diagram-canvas">
                        <div class="mermaid">${architecture.diagram}</div>
                    </div>
                </div>
            `;
        }
        
        // Update theory tab
        const theoryTab = modal.querySelector('#theory-tab');
        if (theoryTab) {
            theoryTab.innerHTML = architecture.theory;
        }
        
        // Update cost tab
        const costTab = modal.querySelector('#cost-tab');
        if (costTab) {
            costTab.innerHTML = architecture.cost;
        }
        
        // Initialize Mermaid if available
        if (window.mermaid) {
            window.mermaid.init();
        }
    }
});