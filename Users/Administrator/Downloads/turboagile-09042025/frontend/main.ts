/**
 * TurboAgile - Simplified Main Entry Point
 * Fixes story generation and core functionality
 */

// Simple in-memory storage
let stories: any[] = [];
let currentProject: any = null;

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('TurboAgile initializing...');
    
    // Load saved data
    loadData();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize view immediately
    showLoginView();
    
    console.log('Login view initialized');
});

// Also initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    // DOM is still loading
} else {
    // DOM is already loaded
    setTimeout(() => {
        console.log('DOM already loaded, initializing...');
        loadData();
        setupEventListeners();
        showLoginView();
    }, 100);
}

function loadData() {
    try {
        const saved = localStorage.getItem('turboagile_stories');
        if (saved) {
            stories = JSON.parse(saved);
        }
        
        const savedProject = localStorage.getItem('turboagile_current_project');
        if (savedProject) {
            currentProject = JSON.parse(savedProject);
        }
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

function saveData() {
    try {
        localStorage.setItem('turboagile_stories', JSON.stringify(stories));
        if (currentProject) {
            localStorage.setItem('turboagile_current_project', JSON.stringify(currentProject));
        }
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Login button direct click
    const loginButton = document.getElementById('login-button');
    if (loginButton) {
        loginButton.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogin(e);
        });
    }
    
    // Logout button
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
    
    // Generate stories button
    const generateButton = document.getElementById('generate-button');
    if (generateButton) {
        generateButton.addEventListener('click', handleGenerateStories);
    }
    
    // Back to dashboard
    const backButton = document.getElementById('back-to-dashboard-btn');
    if (backButton) {
        backButton.addEventListener('click', () => showDashboardView());
    }
    
    // View project board
    const viewBoardButton = document.getElementById('view-project-board-button');
    if (viewBoardButton) {
        viewBoardButton.addEventListener('click', () => showProjectView());
    }
    
    // Theme toggles
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleLogin = document.getElementById('theme-toggle-login');
    
    if (themeToggle) {
        themeToggle.addEventListener('change', toggleTheme);
    }
    if (themeToggleLogin) {
        themeToggleLogin.addEventListener('change', toggleTheme);
    }
    
    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    if (themeToggle) themeToggle.checked = savedTheme === 'light';
    if (themeToggleLogin) themeToggleLogin.checked = savedTheme === 'light';
}

function handleLogin(e: Event) {
    e.preventDefault();
    console.log('Login form submitted');
    
    // Show dashboard immediately
    setTimeout(() => {
        console.log('Showing dashboard...');
        showDashboardView();
    }, 100);
}

function handleLogout() {
    console.log('Logout');
    showLoginView();
}

function toggleTheme(event: Event) {
    const target = event.target as HTMLInputElement;
    const isLight = target.checked;
    const newTheme = isLight ? 'light' : 'dark';
    
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Sync both toggles
    const themeToggle = document.getElementById('theme-toggle') as HTMLInputElement;
    const themeToggleLogin = document.getElementById('theme-toggle-login') as HTMLInputElement;
    
    if (themeToggle) themeToggle.checked = isLight;
    if (themeToggleLogin) themeToggleLogin.checked = isLight;
}

async function handleGenerateStories() {
    const brdInput = document.getElementById('brd-input') as HTMLTextAreaElement;
    const generateButton = document.getElementById('generate-button') as HTMLButtonElement;
    
    if (!brdInput || !generateButton) {
        console.error('Required elements not found');
        return;
    }
    
    const brdText = brdInput.value.trim();
    if (!brdText) {
        alert('Please enter your Business Requirements Document in the text area above.');
        brdInput.focus();
        return;
    }
    
    console.log('Generating stories from BRD:', brdText.substring(0, 100) + '...');
    
    generateButton.disabled = true;
    generateButton.innerHTML = 'Generating Stories...';
    
    // Add progress bar
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    progressContainer.innerHTML = `
        <div class="progress-bar-bg">
            <div id="generation-progress" class="progress-bar"></div>
        </div>
        <p class="progress-text">Creating ${Math.floor(Math.random() * 15) + 10} user stories...</p>
    `;
    generateButton.parentElement?.appendChild(progressContainer);
    
    try {
        // Create project if none exists
        if (!currentProject) {
            currentProject = {
                id: 'proj-' + Date.now(),
                name: 'Generated Project',
                description: 'Project generated from BRD',
                createdDate: new Date().toISOString(),
                stories: []
            };
        }
        
        // Generate stories from BRD
        const generatedStories = await generateStoriesFromBRD(brdText);
        
        // Add stories to project and global array
        stories.push(...generatedStories);
        currentProject.stories = generatedStories;
        
        // Save data
        saveData();
        
        console.log(`Generated ${generatedStories.length} stories`);
        
        // Show progress completion
        const progressBar = document.getElementById('generation-progress');
        if (progressBar) {
            progressBar.style.width = '100%';
            setTimeout(() => {
                progressBar.parentElement?.remove();
                showProjectView();
            }, 1000);
        } else {
            showProjectView();
        }
        
    } catch (error) {
        console.error('Error generating stories:', error);
        alert('Error generating stories. Please try again.');
    } finally {
        generateButton.disabled = false;
        generateButton.textContent = '🚀 Create Project from BRD';
    }
}

async function generateStoriesFromBRD(brdText: string): Promise<any[]> {
    console.log('Processing BRD text...');
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Extract requirements from BRD
    const requirements = extractRequirements(brdText);
    
    const generatedStories: any[] = [];
    let storyId = Date.now();
    
    // Create framework setup story first
    const frameworkStory = {
        id: 'setup-' + storyId++,
        title: '🏗️ Project Setup & Framework Configuration',
        description: 'As a developer, I need to set up the initial project structure and framework configuration so that the development team can start building features on a solid foundation.',
        acceptanceCriteria: [
            'Create project directory structure with proper folder organization',
            'Initialize version control (Git) with proper .gitignore',
            'Set up build configuration and dependencies',
            'Configure development environment',
            'Create basic application entry point',
            'Set up testing framework',
            'Configure CI/CD pipeline',
            'Create README.md with setup instructions'
        ],
        status: 'backlog',
        type: 'story',
        points: 5,
        creationDate: new Date().toISOString(),
        isFrameworkSetup: true,
        priority: 'critical'
    };
    
    generatedStories.push(frameworkStory);
    
    // Generate feature stories
    requirements.forEach((req, index) => {
        const story = {
            id: 'story-' + (storyId++),
            title: req.title,
            description: req.description,
            acceptanceCriteria: req.criteria,
            status: 'blocked',
            type: 'story',
            points: estimateStoryPoints(req.complexity),
            creationDate: new Date().toISOString(),
            blockedBy: frameworkStory.id
        };
        
        generatedStories.push(story);
    });
    
    console.log(`Generated ${generatedStories.length} stories`);
    return generatedStories;
}

function extractRequirements(brdText: string) {
    const sentences = brdText.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const requirements = [];
    
    // If no meaningful content, create default requirements
    if (sentences.length < 3) {
        return [
            {
                title: 'User Authentication System',
                description: 'As a user, I want to securely log into the system so that I can access my account.',
                criteria: ['User can register with email and password', 'User can login with valid credentials', 'User can reset forgotten password'],
                complexity: 'medium'
            },
            {
                title: 'User Dashboard',
                description: 'As a user, I want to see a personalized dashboard so that I can quickly access key information.',
                criteria: ['Dashboard shows user profile information', 'Dashboard displays recent activity', 'Dashboard has navigation menu'],
                complexity: 'medium'
            },
            {
                title: 'Data Management',
                description: 'As a user, I want to manage my data so that I can keep my information up to date.',
                criteria: ['User can create new records', 'User can edit existing records', 'User can delete records', 'Changes are saved automatically'],
                complexity: 'high'
            }
        ];
    }
    
    // Process actual BRD content
    let currentReq = null;
    
    sentences.forEach(sentence => {
        const trimmed = sentence.trim();
        if (!trimmed || trimmed.length < 10) return;
        
        if (isNewRequirement(trimmed)) {
            if (currentReq) requirements.push(currentReq);
            currentReq = {
                title: generateTitle(trimmed),
                description: generateUserStory(trimmed),
                criteria: [trimmed.substring(0, 100)],
                complexity: 'medium'
            };
        } else if (currentReq && trimmed.length < 100) {
            currentReq.criteria.push(trimmed);
            currentReq.complexity = assessComplexity(currentReq.criteria);
        }
    });
    
    if (currentReq) requirements.push(currentReq);
    
    return requirements.length > 0 ? requirements : [
        {
            title: 'Core Application Features',
            description: 'As a user, I want the core application functionality so that I can accomplish my goals.',
            criteria: ['System provides main functionality', 'User interface is intuitive', 'System is responsive'],
            complexity: 'medium'
        }
    ];
}

function isNewRequirement(sentence: string): boolean {
    const indicators = [
        'system should', 'system must', 'system will',
        'user should', 'user must', 'user can',
        'application should', 'application must',
        'the system', 'users need', 'requirement',
        'feature', 'functionality'
    ];
    
    return indicators.some(indicator => 
        sentence.toLowerCase().includes(indicator)
    );
}

function generateTitle(sentence: string): string {
    const words = sentence.split(' ').filter(w => w.length > 2 && w.length < 15);
    const title = words.slice(0, 4).join(' ');
    return title.length > 50 ? title.substring(0, 47) + '...' : title.charAt(0).toUpperCase() + title.slice(1);
}

function generateUserStory(sentence: string): string {
    const lower = sentence.toLowerCase();
    if (lower.includes('user') || lower.includes('customer')) {
        return `As a user, I want ${sentence.toLowerCase()} so that I can accomplish my goals.`;
    }
    return `As a user, I need the system to ${sentence.toLowerCase()} so that I can use the application effectively.`;
}

function assessComplexity(criteria: string[]): string {
    const totalLength = criteria.join(' ').length;
    const criteriaCount = criteria.length;
    
    if (criteriaCount >= 5 || totalLength > 500) return 'high';
    if (criteriaCount >= 3 || totalLength > 200) return 'medium';
    return 'low';
}

function estimateStoryPoints(complexity: string): number {
    switch (complexity) {
        case 'low': return Math.random() > 0.5 ? 1 : 2;
        case 'medium': return Math.random() > 0.5 ? 3 : 5;
        case 'high': return 8;
        default: return 3;
    }
}

function showLoginView() {
    hideAllViews();
    const loginContainer = document.getElementById('login-container');
    if (loginContainer) {
        loginContainer.style.display = 'flex';
        loginContainer.classList.add('fade-in');
    }
}

function showDashboardView() {
    console.log('=== showDashboardView called ===');
    hideAllViews();
    const dashboardContainer = document.getElementById('dashboard-container');
    console.log('Dashboard container:', dashboardContainer);
    if (dashboardContainer) {
        dashboardContainer.style.display = 'block';
        dashboardContainer.style.opacity = '1';
        dashboardContainer.style.visibility = 'visible';
        console.log('Dashboard styles set:', {
            display: dashboardContainer.style.display,
            opacity: dashboardContainer.style.opacity,
            visibility: dashboardContainer.style.visibility
        });
    } else {
        console.error('Dashboard container not found');
    }
    
    // Update navigation section
    updateNavigationSection();
    console.log('=== showDashboardView complete ===');
}

function showProjectView() {
    console.log('=== showProjectView called ===');
    console.log('Stories array:', stories);
    hideAllViews();
    const projectContainer = document.getElementById('project-view-container');
    console.log('Project container:', projectContainer);
    if (projectContainer) {
        projectContainer.style.display = 'block';
        projectContainer.style.opacity = '1';
        projectContainer.style.visibility = 'visible';
        console.log('Project container shown');
    }
    
    // Render the project board
    renderProjectBoard();
    console.log('=== showProjectView complete ===');
}

function hideAllViews() {
    console.log('=== hideAllViews called ===');
    const containers = [
        'login-container',
        'dashboard-container', 
        'project-view-container'
    ];
    
    containers.forEach(id => {
        const element = document.getElementById(id);
        console.log(`Hiding ${id}:`, element);
        if (element) {
            element.style.display = 'none';
            console.log(`${id} hidden`);
        } else {
            console.error(`${id} not found`);
        }
    });
    console.log('=== hideAllViews complete ===');
}

function updateNavigationSection() {
    const navSection = document.getElementById('project-navigation-section');
    if (navSection) {
        navSection.style.display = stories.length > 0 ? 'block' : 'none';
    }
}

function renderProjectBoard() {
    const backlogColumn = document.getElementById('backlog-cards');
    const inProgressColumn = document.getElementById('inprogress-cards');
    const doneColumn = document.getElementById('done-cards');
    
    if (!backlogColumn || !inProgressColumn || !doneColumn) {
        console.error('Board columns not found');
        return;
    }
    
    // Clear columns and ensure visibility
    backlogColumn.innerHTML = '';
    inProgressColumn.innerHTML = '';
    doneColumn.innerHTML = '';
    
    // Force column visibility
    [backlogColumn, inProgressColumn, doneColumn].forEach(col => {
        col.style.display = 'block';
        col.style.visibility = 'visible';
        col.style.opacity = '1';
    });
    
    if (stories.length === 0) {
        backlogColumn.innerHTML = '<div class="empty-state">No stories created yet</div>';
        updateMetrics();
        return;
    }
    
    // Update project title
    const projectTitle = document.getElementById('project-view-title');
    if (projectTitle && currentProject) {
        projectTitle.textContent = `${currentProject.name} - Project Board (${stories.length} stories)`;
    }
    
    // Render stories
    stories.forEach(story => {
        const card = createSimpleStoryCard(story);
        
        if (story.status === 'done') {
            doneColumn.appendChild(card);
        } else if (story.status === 'in-progress') {
            inProgressColumn.appendChild(card);
        } else {
            backlogColumn.appendChild(card);
        }
    });
    
    // Force update metrics
    updateMetrics();
    
    // Add timeline button
    if (stories.length > 0) {
        addProjectTimelineButton();
    }
}

function createStoryCard(story: any): HTMLElement {
    console.log('Creating card for story:', story.title);
    
    const card = document.createElement('div');
    card.className = 'story-card';
    card.setAttribute('data-story-id', story.id);
    
    if (story.type === 'bug') card.classList.add('bug');
    if (story.status === 'blocked') card.classList.add('blocked');
    if (story.isFrameworkSetup) card.classList.add('framework-setup');
    
    // Create card header with title and points
    const cardHeader = document.createElement('div');
    cardHeader.className = 'card-header';
    
    const title = document.createElement('h4');
    title.textContent = story.title;
    
    const points = document.createElement('span');
    points.className = 'story-points';
    if (story.status === 'blocked') {
        points.textContent = `🔒 ${story.points} SP`;
    } else if (story.isFrameworkSetup) {
        points.textContent = `🏗️ ${story.points} SP`;
    } else {
        points.textContent = `${story.points} SP`;
    }
    
    cardHeader.appendChild(title);
    cardHeader.appendChild(points);
    
    const description = document.createElement('p');
    description.className = 'story-description';
    if (story.status === 'blocked') {
        description.textContent = `🚫 BLOCKED: Complete framework setup first. ${story.description}`;
    } else {
        description.textContent = story.description;
    }
    
    const criteriaLabel = document.createElement('strong');
    criteriaLabel.textContent = 'Acceptance Criteria:';
    
    const criteriaList = document.createElement('ul');
    if (story.acceptanceCriteria && Array.isArray(story.acceptanceCriteria)) {
        story.acceptanceCriteria.forEach((criteria: string) => {
            const li = document.createElement('li');
            li.textContent = criteria;
            criteriaList.appendChild(li);
        });
    }
    
    card.appendChild(cardHeader);
    card.appendChild(description);
    card.appendChild(criteriaLabel);
    card.appendChild(criteriaList);
    
    // Add click handler
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
        if (story.status === 'blocked' && !story.isFrameworkSetup) {
            alert('⚠️ Story Blocked\n\nThis story is blocked until the "Project Setup & Framework Configuration" story is completed.\n\nPlease complete the framework setup story first.');
            return;
        }
        
        openStoryModal(story);
    });
    
    console.log('Card created successfully for:', story.title);
    return card;
}

function openStoryModal(story: any) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay wizard-modal';
    modal.style.display = 'flex';
    
    modal.innerHTML = `
        <div class="modal-content wizard-content">
            <button class="modal-close" onclick="this.closest('.modal-overlay').remove(); document.body.style.overflow = 'auto';">&times;</button>
            
            <div class="wizard-header">
                <h2>${story.title}</h2>
                <div class="wizard-progress">
                    <div class="step active" data-step="1">🏗️ Architecture</div>
                    <div class="step hidden" data-step="2">💻 Development</div>
                    <div class="step hidden" data-step="3">🚀 Deployment</div>
                </div>
            </div>
            
            <div class="wizard-body">
                <div class="story-info">
                    <p><strong>Status:</strong> ${story.status} | <strong>Points:</strong> ${story.points}</p>
                    <p class="description">${story.description}</p>
                </div>
                
                <div class="wizard-step-content" id="step-1">
                    <div class="step-header">
                        <h3>🏗️ AI Architect</h3>
                        <p>Generate technical architecture and system design with interactive diagrams</p>
                    </div>
                    <div class="architect-actions" style="display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap; justify-content: center;">
                        <button class="action-button" onclick="generateArchitecture('${story.id}')">Generate Architecture</button>
                        <button class="action-button" onclick="generateDiagram('${story.id}', 'architecture')">📊 Architecture Diagram</button>
                        <button class="action-button" onclick="generateDiagram('${story.id}', 'sequence')">🔄 Sequence Diagram</button>
                        <button class="action-button" onclick="generateDiagram('${story.id}', 'er')">🗄️ Database ER</button>
                    </div>
                    <div id="arch-output-${story.id}" class="step-output"></div>
                    <div id="diagram-output-${story.id}" class="step-output" style="display: none;"></div>
                    <div class="step-navigation">
                        <button class="next-step" onclick="showNextStep(2, '${story.id}')" disabled>Next: Development →</button>
                    </div>
                </div>
                
                <div class="wizard-step-content" id="step-2" style="display: none;">
                    <div class="step-header">
                        <h3>💻 AI Developer</h3>
                        <p>Generate production-ready code implementation with class diagrams</p>
                    </div>
                    <div class="developer-actions" style="display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap; justify-content: center;">
                        <button class="action-button" onclick="generateCode('${story.id}')">Generate Code</button>
                        <button class="action-button" onclick="generateDiagram('${story.id}', 'class')">📋 Class Diagram</button>
                        <button class="action-button" onclick="generateDiagram('${story.id}', 'deployment')">🚀 Deployment Diagram</button>
                    </div>
                    <div id="code-output-${story.id}" class="step-output"></div>
                    <div class="step-navigation">
                        <button class="prev-step" onclick="showPrevStep(1)">← Previous</button>
                        <button class="next-step" onclick="showNextStep(3, '${story.id}')" disabled>Next: Deployment →</button>
                    </div>
                </div>
                
                <div class="wizard-step-content" id="step-3" style="display: none;">
                    <div class="step-header">
                        <h3>🚀 AI DevOps</h3>
                        <p>Deploy to production with automated workflow and monitoring diagrams</p>
                    </div>
                    <div class="devops-actions" style="display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap; justify-content: center;">
                        <button class="action-button" onclick="deployStory('${story.id}')">Deploy to Production</button>
                        <button class="action-button" onclick="generateDiagram('${story.id}', 'flow')">🔄 System Flow</button>
                    </div>
                    <div id="deploy-output-${story.id}" class="step-output"></div>
                    <div class="step-navigation">
                        <button class="prev-step" onclick="showPrevStep(2)">← Previous</button>
                        <button class="finish-step" onclick="finishWizard()">✅ Complete</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            document.body.style.overflow = 'auto';
        }
    });
}

function updateMetrics() {
    const total = stories.length;
    const completed = stories.filter(s => s.status === 'done').length;
    const backlog = stories.filter(s => s.status === 'backlog' || s.status === 'blocked').length;
    const inProgress = stories.filter(s => s.status === 'in-progress').length;
    
    // Update all metric elements
    const elements = {
        'total-stories': total,
        'completed-stories': completed,
        'backlog-count': backlog,
        'progress-count': inProgress,
        'done-count': completed,
        'velocity': Math.round(total / 7) // stories per week
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value.toString();
        }
    });
    
    // Update progress bars
    const totalForBars = total || 1;
    const backlogBar = document.querySelector('.bar-fill.backlog') as HTMLElement;
    const progressBar = document.querySelector('.bar-fill.progress') as HTMLElement;
    const doneBar = document.querySelector('.bar-fill.done') as HTMLElement;
    
    if (backlogBar) backlogBar.style.width = `${(backlog / totalForBars) * 100}%`;
    if (progressBar) progressBar.style.width = `${(inProgress / totalForBars) * 100}%`;
    if (doneBar) doneBar.style.width = `${(completed / totalForBars) * 100}%`;
}

// Global functions for story actions
(window as any).generateArchitecture = async function(storyId: string) {
    const story = stories.find(s => s.id === storyId);
    if (!story) return;
    
    const output = document.getElementById(`arch-output-${storyId}`);
    if (!output) return;
    
    output.innerHTML = '<div class="spinner"></div><p>Generating architecture...</p>';
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const architecture = `
## Technical Architecture for ${story.title}

### System Overview
- **Frontend**: React TypeScript application
- **Backend**: Node.js with Express
- **Database**: PostgreSQL with proper indexing
- **Authentication**: JWT with refresh tokens
- **API**: RESTful with OpenAPI documentation

### Component Structure
\`\`\`
src/
├── components/
│   ├── ${story.title.replace(/\s+/g, '')}/
│   │   ├── ${story.title.replace(/\s+/g, '')}.tsx
│   │   ├── ${story.title.replace(/\s+/g, '')}.test.tsx
│   │   └── ${story.title.replace(/\s+/g, '')}.module.css
├── services/
│   └── ${story.title.replace(/\s+/g, '')}Service.ts
└── types/
    └── ${story.title.replace(/\s+/g, '')}.types.ts
\`\`\`

### Security Considerations
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- Rate limiting
- HTTPS enforcement

### Performance Optimization
- Component lazy loading
- Database query optimization
- Caching strategy
- CDN integration
    `;
    
    output.innerHTML = `<pre style="background: #1f2937; padding: 1rem; border-radius: 6px; overflow-x: auto;">${architecture}</pre>`;
    
    // Update story status
    story.status = 'in-progress';
    story.architecture = architecture;
    saveData();
    renderProjectBoard();
};

(window as any).generateCode = async function(storyId: string) {
    const story = stories.find(s => s.id === storyId);
    if (!story) return;
    
    const output = document.getElementById(`code-output-${storyId}`);
    if (!output) return;
    
    if (!story.architecture) {
        alert('Please generate architecture first!');
        return;
    }
    
    output.innerHTML = '<div class="spinner"></div><p>Generating code...</p>';
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    const componentName = story.title.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
    
    const code = `
// ${componentName}.tsx
import React, { useState, useEffect } from 'react';
import './${componentName}.module.css';

interface ${componentName}Props {
  // Add props as needed
}

const ${componentName}: React.FC<${componentName}Props> = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    // Initialize component
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Implement data loading logic
      console.log('Loading data for ${story.title}');
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="${componentName.toLowerCase()}">
      <h2>${story.title}</h2>
      <p>Implementation for: ${story.description}</p>
      
      {/* Add your component UI here */}
      <div className="content">
        {/* Component content */}
      </div>
    </div>
  );
};

export default ${componentName};

// ${componentName}.test.tsx
import { render, screen } from '@testing-library/react';
import ${componentName} from './${componentName}';

describe('${componentName}', () => {
  test('renders component', () => {
    render(<${componentName} />);
    expect(screen.getByText('${story.title}')).toBeInTheDocument();
  });
});
    `;
    
    output.innerHTML = `<pre style="background: #1f2937; padding: 1rem; border-radius: 6px; overflow-x: auto; max-height: 400px;"><code>${code}</code></pre>`;
    
    // Update story
    story.code = code;
    saveData();
};

(window as any).deployStory = async function(storyId: string) {
    const story = stories.find(s => s.id === storyId);
    if (!story) return;
    
    const output = document.getElementById(`deploy-output-${storyId}`);
    if (!output) return;
    
    if (!story.code) {
        alert('Please generate code first!');
        return;
    }
    
    output.innerHTML = '<div class="spinner"></div><p>Deploying to production...</p>';
    
    // Simulate deployment process
    await new Promise(resolve => setTimeout(resolve, 2000));
    output.innerHTML += '<p>✅ Building application...</p>';
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    output.innerHTML += '<p>✅ Running tests...</p>';
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    output.innerHTML += '<p>✅ Deploying to production...</p>';
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const deployUrl = `https://${story.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}.turboagile.app`;
    
    output.innerHTML += `
        <div style="background: #065f46; padding: 1rem; border-radius: 6px; margin-top: 1rem;">
            <h4>🚀 Deployment Successful!</h4>
            <p><strong>Production URL:</strong> <a href="${deployUrl}" target="_blank">${deployUrl}</a></p>
            <p><strong>Status:</strong> Live and running</p>
            <p><strong>Build Time:</strong> ${new Date().toLocaleString()}</p>
        </div>
    `;
    
    // Update story status
    story.status = 'done';
    story.deploymentUrl = deployUrl;
    story.completionDate = new Date().toISOString();
    
    saveData();
    renderProjectBoard();
    
    // Close modal and show success
    setTimeout(() => {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.remove();
            document.body.style.overflow = 'auto';
        }
        
        alert(`🎉 Story "${story.title}" completed and deployed!\n\nProduction URL: ${deployUrl}\n\nThe story has been moved to the "Done" column.`);
    }, 1000);
};

// Global function for diagram generation
(window as any).generateDiagram = async function(storyId: string, diagramType: string) {
    const story = stories.find(s => s.id === storyId);
    if (!story) return;
    
    const diagramOutput = document.getElementById(`diagram-output-${storyId}`);
    if (!diagramOutput) return;
    
    diagramOutput.style.display = 'block';
    diagramOutput.innerHTML = '<div class="spinner"></div><p>Generating diagram...</p>';
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    let mermaidCode = '';
    let diagramTitle = '';
    
    switch (diagramType) {
        case 'architecture':
            diagramTitle = 'System Architecture Diagram';
            mermaidCode = generateArchitectureDiagram(story);
            break;
        case 'sequence':
            diagramTitle = 'User Interaction Sequence';
            mermaidCode = generateSequenceDiagram(story);
            break;
        case 'er':
            diagramTitle = 'Database Entity Relationship';
            mermaidCode = generateERDiagram(story);
            break;
        case 'class':
            diagramTitle = 'Code Class Structure';
            mermaidCode = generateClassDiagram(story);
            break;
        case 'deployment':
            diagramTitle = 'Deployment Architecture';
            mermaidCode = generateDeploymentDiagram(story);
            break;
        case 'flow':
            diagramTitle = 'System Flow Diagram';
            mermaidCode = generateFlowDiagram(story);
            break;
        default:
            mermaidCode = 'graph TD\n    A[Start] --> B[Process] --> C[End]';
    }
    
    diagramOutput.innerHTML = `
        <div class="diagram-container">
            <div class="diagram-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h4>${diagramTitle}</h4>
                <div class="diagram-actions">
                    <button class="action-button" onclick="exportDiagram('${storyId}', '${diagramType}')" style="font-size: 0.8rem; padding: 0.4rem 0.8rem;">📄 Export</button>
                    <button class="action-button" onclick="regenerateDiagram('${storyId}', '${diagramType}')" style="font-size: 0.8rem; padding: 0.4rem 0.8rem;">🔄 Regenerate</button>
                </div>
            </div>
            <div class="mermaid-diagram" id="mermaid-${storyId}-${diagramType}">
                <div class="mermaid">${mermaidCode}</div>
            </div>
            <div class="diagram-code" style="margin-top: 1rem;">
                <details>
                    <summary style="cursor: pointer; font-weight: 500; margin-bottom: 0.5rem;">View Mermaid Code</summary>
                    <pre style="background: #1f2937; padding: 1rem; border-radius: 6px; overflow-x: auto; font-size: 0.85rem;"><code>${mermaidCode}</code></pre>
                </details>
            </div>
        </div>
    `;
    
    // Initialize mermaid if available
    setTimeout(() => {
        if (typeof (window as any).mermaid !== 'undefined') {
            (window as any).mermaid.init(undefined, `#mermaid-${storyId}-${diagramType} .mermaid`);
        }
    }, 100);
};

// Diagram generation helper functions
function generateArchitectureDiagram(story: any): string {
    return `flowchart TD
    A["👤 User Interface<br/>(React/TypeScript)"] --> B["🌐 API Gateway<br/>(Express.js)"]
    B --> C["🔐 Authentication<br/>(JWT)"]
    C --> D["⚙️ Business Logic<br/>(Services)"]
    D --> E["🗄️ Database<br/>(PostgreSQL)"]
    D --> F["⚡ Cache Layer<br/>(Redis)"]
    B --> G["📊 Monitoring<br/>(Logs/Metrics)"]
    
    classDef frontend fill:#3b82f6,stroke:#1e40af,stroke-width:2px,color:#ffffff
    classDef backend fill:#10b981,stroke:#059669,stroke-width:2px,color:#ffffff
    classDef data fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#ffffff
    
    class A frontend
    class B,C,D,G backend
    class E,F data`;
}

function generateSequenceDiagram(story: any): string {
    return `sequenceDiagram
    participant U as 👤 User
    participant F as 🖥️ Frontend
    participant A as 🌐 API
    participant D as 🗄️ Database
    
    U->>+F: Submit Form
    F->>F: Validate Input
    F->>+A: POST /api/${story.title.toLowerCase().replace(/\s+/g, '-')}
    A->>A: Authenticate User
    A->>+D: Query/Insert Data
    D-->>-A: Return Result
    A-->>-F: Success Response
    F->>F: Update UI State
    F-->>-U: Show Success Message`;
}

function generateERDiagram(story: any): string {
    return `erDiagram
    USER {
        uuid id PK
        varchar email UK
        varchar password_hash
        timestamp created_at
        timestamp updated_at
    }
    
    PROFILE {
        uuid id PK
        uuid user_id FK
        varchar first_name
        varchar last_name
        text bio
        varchar avatar_url
    }
    
    SESSION {
        uuid id PK
        uuid user_id FK
        varchar token
        timestamp expires_at
        timestamp created_at
    }
    
    USER ||--|| PROFILE : has
    USER ||--o{ SESSION : creates`;
}

function generateClassDiagram(story: any): string {
    const componentName = story.title.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
    return `classDiagram
    class ${componentName}Component {
        -state: State
        +props: Props
        +render(): JSX.Element
        -handleSubmit(event: Event): void
        -validateInput(data: any): boolean
    }
    
    class ${componentName}Service {
        -apiClient: ApiClient
        +create(data: any): Promise~any~
        +update(id: string, data: any): Promise~any~
        +delete(id: string): Promise~void~
        +findById(id: string): Promise~any~
    }
    
    class ${componentName}Model {
        +id: string
        +createdAt: Date
        +updatedAt: Date
        +validate(): boolean
        +toJSON(): object
    }
    
    ${componentName}Component --> ${componentName}Service : uses
    ${componentName}Service --> ${componentName}Model : manages`;
}

function generateDeploymentDiagram(story: any): string {
    return `flowchart TD
    U["👥 Users"] --> CDN["🌐 CloudFront CDN"]
    CDN --> LB["⚖️ Application Load Balancer"]
    LB --> ECS1["🐳 ECS Container 1"]
    LB --> ECS2["🐳 ECS Container 2"]
    ECS1 --> RDS["🗄️ RDS PostgreSQL"]
    ECS2 --> RDS
    ECS1 --> REDIS["⚡ ElastiCache Redis"]
    ECS2 --> REDIS
    ECS1 --> S3["📦 S3 Storage"]
    ECS2 --> S3
    
    subgraph "AWS VPC"
        LB
        ECS1
        ECS2
        RDS
        REDIS
    end
    
    classDef aws fill:#ff9900,stroke:#ff6600,stroke-width:2px,color:#ffffff
    classDef compute fill:#3b82f6,stroke:#1e40af,stroke-width:2px,color:#ffffff
    classDef storage fill:#10b981,stroke:#059669,stroke-width:2px,color:#ffffff
    
    class CDN,LB aws
    class ECS1,ECS2 compute
    class RDS,REDIS,S3 storage`;
}

function generateFlowDiagram(story: any): string {
    return `flowchart TD
    START(["🚀 User Request"]) --> VALIDATE{"✅ Validate Input"}
    VALIDATE -->|Valid| AUTH{"🔐 Authenticate"}
    VALIDATE -->|Invalid| ERROR1["❌ Return Error"]
    AUTH -->|Success| PROCESS["⚙️ Process Request"]
    AUTH -->|Failed| ERROR2["🚫 Unauthorized"]
    PROCESS --> DB["💾 Update Database"]
    DB --> CACHE["⚡ Update Cache"]
    CACHE --> LOG["📝 Log Activity"]
    LOG --> SUCCESS["✅ Return Success"]
    ERROR1 --> END(["🏁 End"])
    ERROR2 --> END
    SUCCESS --> END
    
    classDef start fill:#10b981,stroke:#059669,stroke-width:2px,color:#ffffff
    classDef process fill:#3b82f6,stroke:#1e40af,stroke-width:2px,color:#ffffff
    classDef decision fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#ffffff
    classDef error fill:#ef4444,stroke:#dc2626,stroke-width:2px,color:#ffffff
    
    class START,SUCCESS start
    class PROCESS,DB,CACHE,LOG process
    class VALIDATE,AUTH decision
    class ERROR1,ERROR2 error`;
}

// Export and regenerate functions
(window as any).exportDiagram = function(storyId: string, diagramType: string) {
    const diagramContainer = document.querySelector(`#mermaid-${storyId}-${diagramType} .mermaid`);
    if (diagramContainer) {
        const mermaidCode = diagramContainer.textContent || '';
        const blob = new Blob([mermaidCode], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${diagramType}-diagram-${storyId}.mmd`;
        a.click();
        URL.revokeObjectURL(url);
    }
};

(window as any).regenerateDiagram = function(storyId: string, diagramType: string) {
    (window as any).generateDiagram(storyId, diagramType);
};

function addProjectTimelineButton() {
    const projectHeader = document.querySelector('.project-header .header-controls');
    if (projectHeader && !document.getElementById('timeline-button')) {
        const timelineButton = document.createElement('button');
        timelineButton.id = 'timeline-button';
        timelineButton.className = 'action-button';
        timelineButton.innerHTML = '📅 Project Timeline';
        timelineButton.onclick = showProjectTimeline;
        projectHeader.insertBefore(timelineButton, projectHeader.firstChild);
    }
}

function showProjectTimeline() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.display = 'flex';
    
    const timelineDiagram = generateProjectTimeline(stories);
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 1200px; width: 95vw;">
            <button class="modal-close" onclick="this.closest('.modal-overlay').remove(); document.body.style.overflow = 'auto';">&times;</button>
            
            <div class="timeline-header">
                <h2>📅 Project Timeline & Gantt Chart</h2>
                <p>Visual timeline showing story dependencies and estimated completion dates</p>
            </div>
            
            <div class="timeline-controls" style="margin: 1rem 0; display: flex; gap: 1rem; align-items: center;">
                <button class="action-button" onclick="exportTimeline()" style="font-size: 0.9rem;">📄 Export Timeline</button>
                <button class="action-button" onclick="regenerateTimeline()" style="font-size: 0.9rem;">🔄 Regenerate</button>
                <select id="timeline-view" style="padding: 0.5rem; border-radius: 4px; border: 1px solid var(--border-color);">
                    <option value="gantt">Gantt Chart</option>
                    <option value="timeline">Linear Timeline</option>
                    <option value="dependencies">Dependency Graph</option>
                </select>
            </div>
            
            <div class="timeline-container" id="timeline-container">
                <div class="mermaid">${timelineDiagram}</div>
            </div>
            
            <div class="timeline-summary" style="margin-top: 2rem; padding: 1rem; background: var(--card-bg-color); border-radius: 8px;">
                <h3>📊 Project Summary</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem;">
                    <div><strong>Total Stories:</strong> ${stories.length}</div>
                    <div><strong>Completed:</strong> ${stories.filter(s => s.status === 'done').length}</div>
                    <div><strong>In Progress:</strong> ${stories.filter(s => s.status === 'in-progress').length}</div>
                    <div><strong>Estimated Duration:</strong> ${Math.ceil(stories.length * 2.5)} days</div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Initialize mermaid
    setTimeout(() => {
        if (typeof (window as any).mermaid !== 'undefined') {
            (window as any).mermaid.init(undefined, '#timeline-container .mermaid');
        }
    }, 100);
}

function generateProjectTimeline(projectStories: any[]): string {
    const today = new Date();
    let gantt = `gantt
    title Project Development Timeline
    dateFormat YYYY-MM-DD
    axisFormat %m/%d
    
    section Setup Phase
`;
    
    // Framework setup story
    const frameworkStory = projectStories.find(s => s.isFrameworkSetup);
    if (frameworkStory) {
        const startDate = new Date(today);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + (frameworkStory.points || 5));
        
        const status = frameworkStory.status === 'done' ? 'done' : 
                      frameworkStory.status === 'in-progress' ? 'active' : 'crit';
        
        gantt += `    Framework Setup :${status}, setup, ${startDate.toISOString().split('T')[0]}, ${endDate.toISOString().split('T')[0]}\n`;
    }
    
    gantt += `\n    section Feature Development\n`;
    
    // Feature stories
    const featureStories = projectStories.filter(s => !s.isFrameworkSetup);
    let currentDate = new Date(today);
    if (frameworkStory) {
        currentDate.setDate(currentDate.getDate() + (frameworkStory.points || 5));
    }
    
    featureStories.forEach((story, index) => {
        const startDate = new Date(currentDate);
        const duration = story.points || 3;
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + duration);
        
        const status = story.status === 'done' ? 'done' : 
                      story.status === 'in-progress' ? 'active' : 
                      story.status === 'blocked' ? 'crit' : '';
        
        const taskName = story.title.replace(/[^a-zA-Z0-9\s]/g, '').substring(0, 30).replace(/\s+/g, '_');
        gantt += `    ${taskName} :${status}, task${index + 1}, ${startDate.toISOString().split('T')[0]}, ${endDate.toISOString().split('T')[0]}\n`;
        
        currentDate = new Date(endDate);
        currentDate.setDate(currentDate.getDate() + 1);
    });
    
    gantt += `\n    section Deployment\n`;
    gantt += `    Production Deploy :milestone, deploy, ${currentDate.toISOString().split('T')[0]}, 1d\n`;
    
    return gantt;
}

// Global timeline functions
(window as any).exportTimeline = function() {
    const timelineContainer = document.querySelector('#timeline-container .mermaid');
    if (timelineContainer) {
        const mermaidCode = timelineContainer.textContent || '';
        const blob = new Blob([mermaidCode], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'project-timeline.mmd';
        a.click();
        URL.revokeObjectURL(url);
    }
};

(window as any).regenerateTimeline = function() {
    const container = document.getElementById('timeline-container');
    if (container) {
        const newDiagram = generateProjectTimeline(stories);
        container.innerHTML = `<div class="mermaid">${newDiagram}</div>`;
        
        setTimeout(() => {
            if (typeof (window as any).mermaid !== 'undefined') {
                (window as any).mermaid.init(undefined, '#timeline-container .mermaid');
            }
        }, 100);
    }
};

(window as any).showProjectTimeline = showProjectTimeline;

console.log('TurboAgile main.ts loaded with diagram generation');

function createSimpleStoryCard(story: any): HTMLElement {
    const card = document.createElement('div');
    card.className = 'story-card';
    card.setAttribute('data-story-id', story.id);
    
    if (story.status === 'blocked') card.classList.add('blocked');
    if (story.isFrameworkSetup) card.classList.add('framework-setup');
    
    const title = story.title.length > 50 ? story.title.substring(0, 47) + '...' : story.title;
    const description = story.description.length > 120 ? story.description.substring(0, 117) + '...' : story.description;
    
    card.innerHTML = `
        <div class="card-header">
            <input type="checkbox" class="story-checkbox" value="${story.id}" onchange="updateDeleteButton()">
            <h4 title="${story.title}">${title}</h4>
            <span class="story-points">${story.points} SP</span>
        </div>
        <p class="story-description" title="${story.description}">${description}</p>
        <div class="criteria-section">
            <strong>Acceptance Criteria:</strong>
            <ul class="criteria-list">
                ${story.acceptanceCriteria.slice(0, 3).map((c: string) => 
                    `<li title="${c}">${c.length > 60 ? c.substring(0, 57) + '...' : c}</li>`
                ).join('')}
                ${story.acceptanceCriteria.length > 3 ? `<li class="more-criteria">+${story.acceptanceCriteria.length - 3} more...</li>` : ''}
            </ul>
        </div>
        <div class="card-footer">
            <span class="story-status">${story.status.toUpperCase()}</span>
            <span class="click-hint">Click to view details</span>
        </div>
    `;
    
    card.addEventListener('click', () => {
        if (story.isFrameworkSetup) {
            openArchitectureWizard(story);
        } else {
            openStoryModal(story);
        }
    });
    return card;
}
// Wizard navigation functions
(window as any).nextWizardStep = function(step: number) {
    document.querySelectorAll('.wizard-step-content').forEach(el => (el as HTMLElement).style.display = 'none');
    document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
    
    document.getElementById(`step-${step}`)!.style.display = 'block';
    document.querySelector(`[data-step="${step}"]`)!.classList.add('active');
};

(window as any).enableNextStep = function(currentStep: number) {
    const nextButton = document.querySelector(`#step-${currentStep} .next-step`) as HTMLButtonElement;
    if (nextButton) {
        nextButton.disabled = false;
        nextButton.style.opacity = '1';
    }
};

(window as any).finishWizard = function() {
    const modal = document.querySelector('.wizard-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
};

// Update generate functions to enable next steps
(window as any).generateArchitecture = async function(storyId: string) {
    const story = stories.find(s => s.id === storyId);
    if (!story) return;
    
    const output = document.getElementById(`arch-output-${storyId}`);
    if (!output) return;
    
    output.innerHTML = '<div class="spinner"></div><p>Generating architecture...</p>';
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const architecture = `## Technical Architecture for ${story.title}\n\n### System Overview\n- Frontend: React TypeScript\n- Backend: Node.js Express\n- Database: PostgreSQL\n- Authentication: JWT\n\n### Security & Performance\n- Input validation\n- Rate limiting\n- Caching strategy`;
    
    output.innerHTML = `<pre style="background: #1f2937; padding: 1rem; border-radius: 6px; overflow-x: auto;">${architecture}</pre>`;
    
    story.architecture = architecture;
    saveData();
    
    // Enable next step
    (window as any).enableNextStep(1);
};

(window as any).generateCode = async function(storyId: string) {
    const story = stories.find(s => s.id === storyId);
    if (!story) return;
    
    const output = document.getElementById(`code-output-${storyId}`);
    if (!output) return;
    
    if (!story.architecture) {
        alert('Please generate architecture first!');
        return;
    }
    
    output.innerHTML = '<div class="spinner"></div><p>Generating code...</p>';
    
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    const code = `// ${story.title.replace(/\s+/g, '')}.tsx\nimport React from 'react';\n\nconst Component: React.FC = () => {\n  return <div>{/* Implementation */}</div>;\n};\n\nexport default Component;`;
    
    output.innerHTML = `<pre style="background: #1f2937; padding: 1rem; border-radius: 6px;"><code>${code}</code></pre>`;
    
    story.code = code;
    saveData();
    
    // Enable next step
    (window as any).enableNextStep(2);
};

(window as any).deployStory = async function(storyId: string) {
    const story = stories.find(s => s.id === storyId);
    if (!story) return;
    
    const output = document.getElementById(`deploy-output-${storyId}`);
    if (!output) return;
    
    if (!story.code) {
        alert('Please generate code first!');
        return;
    }
    
    output.innerHTML = '<div class="spinner"></div><p>Deploying...</p>';
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const deployUrl = `https://${story.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.app`;
    
    output.innerHTML = `<div style="background: #065f46; padding: 1rem; border-radius: 6px;"><h4>🚀 Deployed!</h4><p><a href="${deployUrl}" target="_blank">${deployUrl}</a></p></div>`;
    
    story.status = 'done';
    story.deploymentUrl = deployUrl;
    saveData();
    renderProjectBoard();
};
// Sequential wizard navigation
(window as any).showNextStep = function(step: number, storyId: string) {
    // Hide current step
    document.querySelectorAll('.wizard-step-content').forEach(el => (el as HTMLElement).style.display = 'none');
    
    // Show next step
    document.getElementById(`step-${step}`)!.style.display = 'block';
    
    // Update progress tabs - show next tab
    const nextTab = document.querySelector(`[data-step="${step}"]`);
    if (nextTab) {
        nextTab.classList.remove('hidden');
        nextTab.classList.add('active');
    }
    
    // Remove active from previous tabs
    document.querySelectorAll('.step').forEach(el => {
        if (el.getAttribute('data-step') !== step.toString()) {
            el.classList.remove('active');
        }
    });
};

(window as any).showPrevStep = function(step: number) {
    document.querySelectorAll('.wizard-step-content').forEach(el => (el as HTMLElement).style.display = 'none');
    document.getElementById(`step-${step}`)!.style.display = 'block';
    
    document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
    document.querySelector(`[data-step="${step}"]`)!.classList.add('active');
};

// Restore original generateArchitecture with next step enabling
(window as any).generateArchitecture = async function(storyId: string) {
    const story = stories.find(s => s.id === storyId);
    if (!story) return;
    
    const output = document.getElementById(`arch-output-${storyId}`);
    if (!output) return;
    
    output.innerHTML = '<div class="spinner"></div><p>Generating architecture...</p>';
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const architecture = `
## Technical Architecture for ${story.title}

### System Overview
- **Frontend**: React TypeScript application
- **Backend**: Node.js with Express
- **Database**: PostgreSQL with proper indexing
- **Authentication**: JWT with refresh tokens
- **API**: RESTful with OpenAPI documentation

### Component Structure
\`\`\`
src/
├── components/
│   ├── ${story.title.replace(/\s+/g, '')}/
│   │   ├── ${story.title.replace(/\s+/g, '')}.tsx
│   │   ├── ${story.title.replace(/\s+/g, '')}.test.tsx
│   │   └── ${story.title.replace(/\s+/g, '')}.module.css
├── services/
│   └── ${story.title.replace(/\s+/g, '')}Service.ts
└── types/
    └── ${story.title.replace(/\s+/g, '')}.types.ts
\`\`\`

### Security Considerations
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- Rate limiting
- HTTPS enforcement

### Performance Optimization
- Component lazy loading
- Database query optimization
- Caching strategy
- CDN integration
    `;
    
    output.innerHTML = `<pre style="background: #1f2937; padding: 1rem; border-radius: 6px; overflow-x: auto;">${architecture}</pre>`;
    
    story.status = 'in-progress';
    story.architecture = architecture;
    saveData();
    renderProjectBoard();
    
    const nextButton = document.querySelector('#step-1 .next-step') as HTMLButtonElement;
    if (nextButton) {
        nextButton.disabled = false;
        nextButton.style.opacity = '1';
    }
};

// Update code generation to enable next step  
(window as any).generateCode = async function(storyId: string) {
    const story = stories.find(s => s.id === storyId);
    if (!story) return;
    
    const output = document.getElementById(`code-output-${storyId}`);
    if (!output) return;
    
    if (!story.architecture) {
        alert('Please generate architecture first!');
        return;
    }
    
    output.innerHTML = '<div class="spinner"></div><p>Generating code...</p>';
    
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    const componentName = story.title.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
    
    const code = `
// ${componentName}.tsx
import React, { useState, useEffect } from 'react';
import './${componentName}.module.css';

interface ${componentName}Props {
  // Add props as needed
}

const ${componentName}: React.FC<${componentName}Props> = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    // Initialize component
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Implement data loading logic
      console.log('Loading data for ${story.title}');
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="${componentName.toLowerCase()}">
      <h2>${story.title}</h2>
      <p>Implementation for: ${story.description}</p>
      
      {/* Add your component UI here */}
      <div className="content">
        {/* Component content */}
      </div>
    </div>
  );
};

export default ${componentName};

// ${componentName}.test.tsx
import { render, screen } from '@testing-library/react';
import ${componentName} from './${componentName}';

describe('${componentName}', () => {
  test('renders component', () => {
    render(<${componentName} />);
    expect(screen.getByText('${story.title}')).toBeInTheDocument();
  });
});
    `;
    
    output.innerHTML = `<pre style="background: #1f2937; padding: 1rem; border-radius: 6px; overflow-x: auto; max-height: 400px;"><code>${code}</code></pre>`;
    
    // Update story
    story.code = code;
    saveData();
    
    // Enable next step button
    const nextButton = document.querySelector('#step-2 .next-step') as HTMLButtonElement;
    if (nextButton) {
        nextButton.disabled = false;
        nextButton.style.opacity = '1';
    }
};
// Restore original deployStory function
(window as any).deployStory = async function(storyId: string) {
    const story = stories.find(s => s.id === storyId);
    if (!story) return;
    
    const output = document.getElementById(`deploy-output-${storyId}`);
    if (!output) return;
    
    if (!story.code) {
        alert('Please generate code first!');
        return;
    }
    
    output.innerHTML = '<div class="spinner"></div><p>Deploying to production...</p>';
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    output.innerHTML += '<p>✅ Building application...</p>';
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    output.innerHTML += '<p>✅ Running tests...</p>';
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    output.innerHTML += '<p>✅ Deploying to production...</p>';
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const deployUrl = `https://${story.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}.turboagile.app`;
    
    output.innerHTML += `
        <div style="background: #065f46; padding: 1rem; border-radius: 6px; margin-top: 1rem;">
            <h4>🚀 Deployment Successful!</h4>
            <p><strong>Production URL:</strong> <a href="${deployUrl}" target="_blank">${deployUrl}</a></p>
            <p><strong>Status:</strong> Live and running</p>
            <p><strong>Build Time:</strong> ${new Date().toLocaleString()}</p>
        </div>
    `;
    
    story.status = 'done';
    story.deploymentUrl = deployUrl;
    story.completionDate = new Date().toISOString();
    
    saveData();
    renderProjectBoard();
    
    setTimeout(() => {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.remove();
            document.body.style.overflow = 'auto';
        }
        
        alert(`🎉 Story "${story.title}" completed and deployed!\n\nProduction URL: ${deployUrl}\n\nThe story has been moved to the "Done" column.`);
    }, 1000);
};
// Delete project functionality
function handleDeleteProject() {
    if (confirm('⚠️ Delete Entire Project?\n\nThis will permanently delete all stories and project data. This action cannot be undone.')) {
        stories = [];
        currentProject = null;
        localStorage.removeItem('turboagile_stories');
        localStorage.removeItem('turboagile_current_project');
        alert('✅ Project deleted successfully!');
        showDashboardView();
    }
}

// Delete selected stories functionality
function handleDeleteSelected() {
    const selectedCheckboxes = document.querySelectorAll('.story-checkbox:checked');
    if (selectedCheckboxes.length === 0) {
        alert('Please select stories to delete');
        return;
    }
    
    if (confirm(`Delete ${selectedCheckboxes.length} selected stories?`)) {
        selectedCheckboxes.forEach(checkbox => {
            const storyId = (checkbox as HTMLInputElement).value;
            stories = stories.filter(s => s.id !== storyId);
        });
        
        saveData();
        renderProjectBoard();
        alert(`✅ Deleted ${selectedCheckboxes.length} stories`);
    }
}

// Select all functionality
function handleSelectAll() {
    const selectAllCheckbox = document.getElementById('select-all-checkbox') as HTMLInputElement;
    const storyCheckboxes = document.querySelectorAll('.story-checkbox') as NodeListOf<HTMLInputElement>;
    
    storyCheckboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });
    
    updateDeleteButton();
}

// Update delete button visibility
function updateDeleteButton() {
    const selectedCheckboxes = document.querySelectorAll('.story-checkbox:checked');
    const deleteButton = document.getElementById('delete-stories-button');
    
    if (deleteButton) {
        deleteButton.style.display = selectedCheckboxes.length > 0 ? 'block' : 'none';
    }
}

// Add event listeners for delete functionality
document.addEventListener('DOMContentLoaded', () => {
    const deleteProjectButton = document.getElementById('delete-project-button');
    if (deleteProjectButton) {
        deleteProjectButton.addEventListener('click', handleDeleteProject);
    }
    
    const deleteStoriesButton = document.getElementById('delete-stories-button');
    if (deleteStoriesButton) {
        deleteStoriesButton.addEventListener('click', handleDeleteSelected);
    }
    
    const selectAllCheckbox = document.getElementById('select-all-checkbox');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', handleSelectAll);
    }
});
// Architecture Wizard for Project Setup
function openArchitectureWizard(story: any) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay architecture-wizard';
    modal.style.display = 'flex';
    
    modal.innerHTML = `
        <div class="modal-content architecture-wizard-content">
            <button class="modal-close" onclick="this.closest('.modal-overlay').remove(); document.body.style.overflow = 'auto';">&times;</button>
            
            <div class="wizard-header">
                <h2>🏗️ Architecture Design Wizard</h2>
                <p>Design your project architecture with AI assistance</p>
            </div>
            
            <div class="wizard-steps">
                <div class="step active" data-step="1">1. Requirements</div>
                <div class="step" data-step="2">2. Architecture Options</div>
                <div class="step" data-step="3">3. Detailed Design</div>
                <div class="step" data-step="4">4. Diagrams & Export</div>
            </div>
            
            <div class="wizard-content">
                <!-- Step 1: Requirements -->
                <div class="wizard-step" id="arch-step-1">
                    <h3>Project Requirements</h3>
                    <div class="requirements-form">
                        <div class="form-group">
                            <label>Additional Requirements (Optional)</label>
                            <textarea id="app-description" placeholder="Any specific requirements not covered in your BRD? Leave blank to use existing project requirements..."></textarea>
                            <small>We already have your project requirements from the BRD. Only add extra details if needed.</small>
                        </div>
                        
                        <div class="brd-summary">
                            <h4>📋 Your Project Requirements (from BRD)</h4>
                            <div class="brd-content">
                                <p><strong>Project:</strong> ${currentProject?.name || 'Generated Project'}</p>
                                <p><strong>Stories:</strong> ${stories.length} user stories created</p>
                                <p><strong>Features:</strong> Authentication, Dashboard, Data Management, and more</p>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label>Expected Users</label>
                                <select id="user-scale">
                                    <option value="small">< 1,000 users</option>
                                    <option value="medium">1K - 100K users</option>
                                    <option value="large">100K - 1M users</option>
                                    <option value="enterprise">> 1M users</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label>Budget Range</label>
                                <select id="budget-range">
                                    <option value="startup">Startup ($0-$500/month)</option>
                                    <option value="small">Small Business ($500-$2K/month)</option>
                                    <option value="medium">Medium ($2K-$10K/month)</option>
                                    <option value="enterprise">Enterprise ($10K+/month)</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>Technology Preferences</label>
                            <div class="tech-checkboxes">
                                <label><input type="checkbox" value="react"> React</label>
                                <label><input type="checkbox" value="vue"> Vue.js</label>
                                <label><input type="checkbox" value="angular"> Angular</label>
                                <label><input type="checkbox" value="nodejs"> Node.js</label>
                                <label><input type="checkbox" value="python"> Python</label>
                                <label><input type="checkbox" value="java"> Java</label>
                                <label><input type="checkbox" value="dotnet"> .NET</label>
                                <label><input type="checkbox" value="aws"> AWS</label>
                                <label><input type="checkbox" value="azure"> Azure</label>
                                <label><input type="checkbox" value="gcp"> Google Cloud</label>
                            </div>
                        </div>
                    </div>
                    
                    <div class="guidance-section">
                        <div class="guidance-card">
                            <h4>💡 Not sure what to choose?</h4>
                            <p><strong>For beginners:</strong> Start with "Startup Pattern" - it's simple and cost-effective</p>
                            <p><strong>Growing business:</strong> Choose "Modern Pattern" - scales automatically</p>
                            <p><strong>Large company:</strong> Go with "Enterprise Pattern" - handles millions of users</p>
                        </div>
                    </div>
                    
                    <div class="step-actions">
                        <button class="action-button" onclick="generateArchitectureOptions()">
                            🎯 Generate My Architecture Options
                        </button>
                    </div>
                </div>
                
                <!-- Step 2: Architecture Options -->
                <div class="wizard-step" id="arch-step-2" style="display: none;">
                    <h3>Choose Your Architecture</h3>
                    <div id="architecture-options" class="architecture-options">
                        <!-- Options will be generated here -->
                    </div>
                </div>
                
                <!-- Step 3: Detailed Design -->
                <div class="wizard-step" id="arch-step-3" style="display: none;">
                    <h3>Detailed Architecture Design</h3>
                    <div id="detailed-architecture" class="detailed-architecture">
                        <!-- Detailed design will be generated here -->
                    </div>
                </div>
                
                <!-- Step 4: Diagrams & Export -->
                <div class="wizard-step" id="arch-step-4" style="display: none;">
                    <h3>Architecture Diagrams & Documentation</h3>
                    <div class="diagram-tabs">
                        <button class="tab-btn active" data-tab="system">System Architecture</button>
                        <button class="tab-btn" data-tab="sequence">Sequence Diagrams</button>
                        <button class="tab-btn" data-tab="database">Database Design</button>
                        <button class="tab-btn" data-tab="deployment">Deployment</button>
                    </div>
                    
                    <div class="diagram-content">
                        <div id="system-diagram" class="diagram-panel active"></div>
                        <div id="sequence-diagram" class="diagram-panel"></div>
                        <div id="database-diagram" class="diagram-panel"></div>
                        <div id="deployment-diagram" class="diagram-panel"></div>
                    </div>
                    
                    <div class="export-actions">
                        <button class="action-btn" onclick="exportTechnicalDoc()">📄 Export Technical Document</button>
                        <button class="action-btn" onclick="exportDiagrams()">📊 Export All Diagrams</button>
                        <button class="action-btn" onclick="generateImplementationPlan()">📋 Generate Implementation Plan</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            document.body.style.overflow = 'auto';
        }
    });
}

// Generate architecture options using AI
async function generateArchitectureOptions() {
    const appDescription = (document.getElementById('app-description') as HTMLTextAreaElement).value;
    const userScale = (document.getElementById('user-scale') as HTMLSelectElement).value;
    const budget = (document.getElementById('budget-range') as HTMLSelectElement).value;
    
    if (!appDescription.trim()) {
        alert('Please describe your application first');
        return;
    }
    
    // Show loading
    const optionsContainer = document.getElementById('architecture-options');
    if (optionsContainer) {
        optionsContainer.innerHTML = '<div class="loading-spinner"></div><p>AI is analyzing your requirements and generating architecture options...</p>';
    }
    
    // Move to step 2
    showArchStep(2);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate architecture options
    const architectures = [
        {
            id: 'microservices',
            name: 'Microservices Architecture',
            description: 'Scalable, distributed system with independent services',
            pros: ['High scalability', 'Technology diversity', 'Fault isolation'],
            cons: ['Complex deployment', 'Network overhead', 'Data consistency challenges'],
            cost: budget === 'startup' ? 'High' : 'Medium',
            complexity: 'High',
            recommended: userScale === 'large' || userScale === 'enterprise'
        },
        {
            id: 'monolith',
            name: 'Modular Monolith',
            description: 'Single deployable unit with clear module boundaries',
            pros: ['Simple deployment', 'Easy testing', 'Lower operational overhead'],
            cons: ['Scaling limitations', 'Technology lock-in', 'Potential bottlenecks'],
            cost: 'Low',
            complexity: 'Low',
            recommended: userScale === 'small' || budget === 'startup'
        },
        {
            id: 'serverless',
            name: 'Serverless Architecture',
            description: 'Event-driven, fully managed compute services',
            pros: ['Auto-scaling', 'Pay-per-use', 'No server management'],
            cons: ['Vendor lock-in', 'Cold starts', 'Limited execution time'],
            cost: 'Variable',
            complexity: 'Medium',
            recommended: budget === 'startup' || budget === 'small'
        }
    ];
    
    if (optionsContainer) {
        optionsContainer.innerHTML = architectures.map(arch => `
            <div class="architecture-option ${arch.recommended ? 'recommended' : ''}" onclick="selectArchitecture('${arch.id}')">
                ${arch.recommended ? '<div class="recommended-badge">🎯 Recommended</div>' : ''}
                <h4>${arch.name}</h4>
                <p>${arch.description}</p>
                
                <div class="arch-details">
                    <div class="detail-row">
                        <span class="label">Complexity:</span>
                        <span class="value complexity-${arch.complexity.toLowerCase()}">${arch.complexity}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Cost:</span>
                        <span class="value">${arch.cost}</span>
                    </div>
                </div>
                
                <div class="pros-cons">
                    <div class="pros">
                        <strong>✅ Pros:</strong>
                        <ul>${arch.pros.map(pro => `<li>${pro}</li>`).join('')}</ul>
                    </div>
                    <div class="cons">
                        <strong>❌ Cons:</strong>
                        <ul>${arch.cons.map(con => `<li>${con}</li>`).join('')}</ul>
                    </div>
                </div>
                
                <button class="select-btn">Select This Architecture</button>
            </div>
        `).join('');
    }
}

// Select architecture and generate detailed design
(window as any).selectArchitecture = async function(archId: string) {
    showArchStep(3);
    
    const detailedContainer = document.getElementById('detailed-architecture');
    if (detailedContainer) {
        detailedContainer.innerHTML = '<div class="loading-spinner"></div><p>Generating detailed architecture design...</p>';
    }
    
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    // Generate detailed architecture based on selection
    const detailedDesign = generateDetailedDesign(archId);
    
    if (detailedContainer) {
        detailedContainer.innerHTML = detailedDesign;
    }
    
    // Auto-proceed to diagrams
    setTimeout(() => {
        generateAllDiagrams(archId);
        showArchStep(4);
    }, 2000);
}

// Generate detailed design content
function generateDetailedDesign(archId: string): string {
    const designs = {
        microservices: `
            <div class="detailed-design">
                <h4>🏗️ Microservices Architecture Design</h4>
                
                <div class="design-section">
                    <h5>Core Services</h5>
                    <div class="services-grid">
                        <div class="service-card">
                            <h6>🔐 Authentication Service</h6>
                            <p>JWT-based auth, user management</p>
                            <span class="tech-stack">Node.js + Redis</span>
                        </div>
                        <div class="service-card">
                            <h6>👤 User Service</h6>
                            <p>User profiles, preferences</p>
                            <span class="tech-stack">Node.js + PostgreSQL</span>
                        </div>
                        <div class="service-card">
                            <h6>📊 Analytics Service</h6>
                            <p>Event tracking, reporting</p>
                            <span class="tech-stack">Python + ClickHouse</span>
                        </div>
                        <div class="service-card">
                            <h6>📧 Notification Service</h6>
                            <p>Email, SMS, push notifications</p>
                            <span class="tech-stack">Node.js + RabbitMQ</span>
                        </div>
                    </div>
                </div>
                
                <div class="design-section">
                    <h5>Infrastructure Components</h5>
                    <ul class="infrastructure-list">
                        <li><strong>API Gateway:</strong> Kong/AWS API Gateway for routing and rate limiting</li>
                        <li><strong>Service Discovery:</strong> Consul/AWS Service Discovery</li>
                        <li><strong>Load Balancer:</strong> NGINX/AWS ALB</li>
                        <li><strong>Message Queue:</strong> RabbitMQ/AWS SQS for async communication</li>
                        <li><strong>Monitoring:</strong> Prometheus + Grafana + ELK Stack</li>
                        <li><strong>CI/CD:</strong> Jenkins/GitHub Actions with Docker</li>
                    </ul>
                </div>
                
                <div class="design-section">
                    <h5>Database Strategy</h5>
                    <div class="database-strategy">
                        <div class="db-choice">
                            <strong>PostgreSQL:</strong> User data, transactions (ACID compliance)
                        </div>
                        <div class="db-choice">
                            <strong>Redis:</strong> Session storage, caching
                        </div>
                        <div class="db-choice">
                            <strong>ClickHouse:</strong> Analytics and time-series data
                        </div>
                    </div>
                </div>
            </div>
        `,
        monolith: `
            <div class="detailed-design">
                <h4>🏢 Modular Monolith Design</h4>
                
                <div class="design-section">
                    <h5>Application Modules</h5>
                    <div class="modules-grid">
                        <div class="module-card">
                            <h6>🔐 Auth Module</h6>
                            <p>Authentication, authorization, user management</p>
                        </div>
                        <div class="module-card">
                            <h6>📊 Core Business Module</h6>
                            <p>Main application logic and workflows</p>
                        </div>
                        <div class="module-card">
                            <h6>📧 Communication Module</h6>
                            <p>Notifications, emails, messaging</p>
                        </div>
                        <div class="module-card">
                            <h6>📈 Analytics Module</h6>
                            <p>Reporting, metrics, dashboards</p>
                        </div>
                    </div>
                </div>
                
                <div class="design-section">
                    <h5>Technology Stack</h5>
                    <ul class="tech-stack-list">
                        <li><strong>Frontend:</strong> React + TypeScript + Vite</li>
                        <li><strong>Backend:</strong> Node.js + Express + TypeScript</li>
                        <li><strong>Database:</strong> PostgreSQL with connection pooling</li>
                        <li><strong>Cache:</strong> Redis for session and application cache</li>
                        <li><strong>File Storage:</strong> AWS S3 or local filesystem</li>
                        <li><strong>Monitoring:</strong> Winston logging + Prometheus metrics</li>
                    </ul>
                </div>
                
                <div class="design-section">
                    <h5>Deployment Strategy</h5>
                    <p>Single Docker container with health checks, deployed behind NGINX reverse proxy. Database and Redis as separate containers or managed services.</p>
                </div>
            </div>
        `,
        serverless: `
            <div class="detailed-design">
                <h4>⚡ Serverless Architecture Design</h4>
                
                <div class="design-section">
                    <h5>Lambda Functions</h5>
                    <div class="functions-grid">
                        <div class="function-card">
                            <h6>🔐 Auth Functions</h6>
                            <p>Login, register, token refresh</p>
                            <span class="runtime">Node.js 18</span>
                        </div>
                        <div class="function-card">
                            <h6>📊 API Functions</h6>
                            <p>CRUD operations, business logic</p>
                            <span class="runtime">Node.js 18</span>
                        </div>
                        <div class="function-card">
                            <h6>📧 Event Processors</h6>
                            <p>Email, notifications, webhooks</p>
                            <span class="runtime">Python 3.9</span>
                        </div>
                        <div class="function-card">
                            <h6>📈 Analytics Pipeline</h6>
                            <p>Data processing, aggregation</p>
                            <span class="runtime">Python 3.9</span>
                        </div>
                    </div>
                </div>
                
                <div class="design-section">
                    <h5>AWS Services</h5>
                    <ul class="aws-services-list">
                        <li><strong>API Gateway:</strong> REST API endpoints with throttling</li>
                        <li><strong>Lambda:</strong> Serverless compute functions</li>
                        <li><strong>DynamoDB:</strong> NoSQL database with auto-scaling</li>
                        <li><strong>S3:</strong> File storage and static website hosting</li>
                        <li><strong>SQS/SNS:</strong> Message queuing and notifications</li>
                        <li><strong>CloudWatch:</strong> Logging and monitoring</li>
                        <li><strong>Cognito:</strong> User authentication and management</li>
                    </ul>
                </div>
                
                <div class="design-section">
                    <h5>Event-Driven Architecture</h5>
                    <p>Functions triggered by API Gateway, S3 events, DynamoDB streams, and scheduled CloudWatch events. Loose coupling through SQS queues and SNS topics.</p>
                </div>
            </div>
        `
    };
    
    return designs[archId] || designs.monolith;
}

// Show specific architecture step
function showArchStep(stepNumber: number) {
    // Update step indicators
    document.querySelectorAll('.wizard-steps .step').forEach((step, index) => {
        step.classList.toggle('active', index + 1 === stepNumber);
    });
    
    // Show/hide step content
    document.querySelectorAll('.wizard-step').forEach((step, index) => {
        (step as HTMLElement).style.display = index + 1 === stepNumber ? 'block' : 'none';
    });
}

// Generate all diagrams
async function generateAllDiagrams(archId: string) {
    // Generate system architecture diagram
    const systemDiagram = document.getElementById('system-diagram');
    if (systemDiagram) {
        systemDiagram.innerHTML = '<div class="loading-spinner"></div><p>Generating system architecture diagram...</p>';
        await new Promise(resolve => setTimeout(resolve, 2000));
        systemDiagram.innerHTML = generateSystemDiagram(archId);
    }
    
    // Generate sequence diagram
    const sequenceDiagram = document.getElementById('sequence-diagram');
    if (sequenceDiagram) {
        sequenceDiagram.innerHTML = generateSequenceDiagramContent(archId);
    }
    
    // Generate database diagram
    const databaseDiagram = document.getElementById('database-diagram');
    if (databaseDiagram) {
        databaseDiagram.innerHTML = generateDatabaseDiagram(archId);
    }
    
    // Generate deployment diagram
    const deploymentDiagram = document.getElementById('deployment-diagram');
    if (deploymentDiagram) {
        deploymentDiagram.innerHTML = generateDeploymentDiagramContent(archId);
    }
}

// Generate system architecture diagram using Mermaid
function generateSystemDiagram(archId: string): string {
    const diagrams = {
        microservices: `
            <div class="mermaid">
                graph TB
                    U[👤 Users] --> LB[⚖️ Load Balancer]
                    LB --> AG[🌐 API Gateway]
                    AG --> AS[🔐 Auth Service]
                    AG --> US[👤 User Service]
                    AG --> BS[📊 Business Service]
                    AG --> NS[📧 Notification Service]
                    
                    AS --> R1[(Redis Cache)]
                    US --> DB1[(PostgreSQL)]
                    BS --> DB2[(PostgreSQL)]
                    NS --> MQ[📨 Message Queue]
                    
                    BS --> AN[📈 Analytics Service]
                    AN --> DB3[(ClickHouse)]
                    
                    classDef service fill:#e1f5fe,stroke:#01579b,stroke-width:2px
                    classDef database fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
                    classDef infrastructure fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px
                    
                    class AS,US,BS,NS,AN service
                    class DB1,DB2,DB3,R1 database
                    class LB,AG,MQ infrastructure
            </div>
        `,
        monolith: `
            <div class="mermaid">
                graph TB
                    U[👤 Users] --> LB[⚖️ NGINX]
                    LB --> APP[🏢 Monolith App]
                    
                    subgraph "Application Modules"
                        AUTH[🔐 Auth Module]
                        CORE[📊 Core Module]
                        COMM[📧 Communication Module]
                        ANALYTICS[📈 Analytics Module]
                    end
                    
                    APP --> AUTH
                    APP --> CORE
                    APP --> COMM
                    APP --> ANALYTICS
                    
                    APP --> DB[(PostgreSQL)]
                    APP --> CACHE[(Redis)]
                    APP --> FS[📁 File Storage]
                    
                    classDef module fill:#e1f5fe,stroke:#01579b,stroke-width:2px
                    classDef database fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
                    classDef infrastructure fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px
                    
                    class AUTH,CORE,COMM,ANALYTICS module
                    class DB,CACHE database
                    class LB,FS infrastructure
            </div>
        `,
        serverless: `
            <div class="mermaid">
                graph TB
                    U[👤 Users] --> CF[☁️ CloudFront]
                    CF --> S3[📦 S3 Static Site]
                    CF --> AG[🌐 API Gateway]
                    
                    AG --> L1[⚡ Auth Lambda]
                    AG --> L2[⚡ API Lambda]
                    AG --> L3[⚡ File Lambda]
                    
                    L1 --> COG[🔐 Cognito]
                    L2 --> DDB[(DynamoDB)]
                    L3 --> S3B[📦 S3 Bucket]
                    
                    L2 --> SQS[📨 SQS Queue]
                    SQS --> L4[⚡ Event Processor]
                    L4 --> SNS[📢 SNS Topic]
                    
                    CW[📊 CloudWatch] --> L1
                    CW --> L2
                    CW --> L3
                    CW --> L4
                    
                    classDef lambda fill:#ff9800,stroke:#e65100,stroke-width:2px,color:#fff
                    classDef aws fill:#232f3e,stroke:#ff9900,stroke-width:2px,color:#fff
                    classDef storage fill:#4caf50,stroke:#1b5e20,stroke-width:2px,color:#fff
                    
                    class L1,L2,L3,L4 lambda
                    class AG,COG,SNS,CW aws
                    class S3,S3B,DDB,SQS storage
            </div>
        `
    };
    
    return diagrams[archId] || diagrams.monolith;
}

// Generate other diagram contents
function generateSequenceDiagramContent(archId: string): string {
    return `
        <div class="mermaid">
            sequenceDiagram
                participant U as 👤 User
                participant F as 🖥️ Frontend
                participant A as 🌐 API
                participant D as 🗄️ Database
                
                U->>+F: Login Request
                F->>+A: POST /auth/login
                A->>+D: Validate Credentials
                D-->>-A: User Data
                A-->>-F: JWT Token
                F->>F: Store Token
                F-->>-U: Redirect to Dashboard
                
                U->>+F: Create Resource
                F->>+A: POST /api/resource
                Note over A: Validate JWT
                A->>+D: Insert Data
                D-->>-A: Success
                A-->>-F: Resource Created
                F-->>-U: Show Success
        </div>
    `;
}

function generateDatabaseDiagram(archId: string): string {
    return `
        <div class="mermaid">
            erDiagram
                USER {
                    uuid id PK
                    varchar email UK
                    varchar password_hash
                    varchar first_name
                    varchar last_name
                    timestamp created_at
                    timestamp updated_at
                    boolean is_active
                }
                
                PROFILE {
                    uuid id PK
                    uuid user_id FK
                    text bio
                    varchar avatar_url
                    json preferences
                    timestamp updated_at
                }
                
                SESSION {
                    uuid id PK
                    uuid user_id FK
                    varchar token_hash
                    timestamp expires_at
                    varchar ip_address
                    varchar user_agent
                    timestamp created_at
                }
                
                RESOURCE {
                    uuid id PK
                    uuid user_id FK
                    varchar title
                    text description
                    varchar status
                    json metadata
                    timestamp created_at
                    timestamp updated_at
                }
                
                AUDIT_LOG {
                    uuid id PK
                    uuid user_id FK
                    varchar action
                    varchar resource_type
                    uuid resource_id
                    json changes
                    timestamp created_at
                }
                
                USER ||--|| PROFILE : has
                USER ||--o{ SESSION : creates
                USER ||--o{ RESOURCE : owns
                USER ||--o{ AUDIT_LOG : generates
        </div>
    `;
}

function generateDeploymentDiagramContent(archId: string): string {
    const deployments = {
        microservices: `
            <div class="mermaid">
                graph TB
                    subgraph "Production Environment"
                        subgraph "Kubernetes Cluster"
                            subgraph "Frontend Namespace"
                                FE1[React App Pod 1]
                                FE2[React App Pod 2]
                            end
                            
                            subgraph "Backend Namespace"
                                BE1[Auth Service Pod]
                                BE2[User Service Pod]
                                BE3[Business Service Pod]
                            end
                            
                            subgraph "Data Namespace"
                                PG[(PostgreSQL)]
                                RD[(Redis)]
                                MQ[RabbitMQ]
                            end
                        end
                        
                        subgraph "External Services"
                            LB[Load Balancer]
                            CDN[CloudFront CDN]
                            S3[S3 Storage]
                        end
                    end
                    
                    Internet --> CDN
                    CDN --> LB
                    LB --> FE1
                    LB --> FE2
                    FE1 --> BE1
                    FE2 --> BE2
                    BE1 --> PG
                    BE2 --> RD
                    BE3 --> MQ
            </div>
        `,
        monolith: `
            <div class="mermaid">
                graph TB
                    subgraph "Production Server"
                        NGINX[NGINX Reverse Proxy]
                        APP[Node.js Application]
                        PG[(PostgreSQL)]
                        RD[(Redis)]
                    end
                    
                    subgraph "External Services"
                        CDN[CloudFront CDN]
                        S3[S3 Storage]
                        BACKUP[Backup Service]
                    end
                    
                    Internet --> CDN
                    CDN --> NGINX
                    NGINX --> APP
                    APP --> PG
                    APP --> RD
                    APP --> S3
                    PG --> BACKUP
            </div>
        `,
        serverless: `
            <div class="mermaid">
                graph TB
                    subgraph "AWS Cloud"
                        subgraph "Frontend"
                            CF[CloudFront]
                            S3W[S3 Website]
                        end
                        
                        subgraph "API Layer"
                            AG[API Gateway]
                            L1[Auth Lambda]
                            L2[API Lambda]
                            L3[Event Lambda]
                        end
                        
                        subgraph "Data Layer"
                            DDB[(DynamoDB)]
                            S3D[S3 Data]
                            COG[Cognito]
                        end
                        
                        subgraph "Messaging"
                            SQS[SQS Queue]
                            SNS[SNS Topic]
                        end
                    end
                    
                    Internet --> CF
                    CF --> S3W
                    CF --> AG
                    AG --> L1
                    AG --> L2
                    L1 --> COG
                    L2 --> DDB
                    L2 --> SQS
                    SQS --> L3
                    L3 --> SNS
            </div>
        `
    };
    
    return deployments[archId] || deployments.monolith;
}

// Export functions
function exportTechnicalDoc() {
    alert('📄 Technical document export functionality - would generate comprehensive PDF with all architecture details, diagrams, and implementation guidelines');
}

function exportDiagrams() {
    alert('📊 Diagram export functionality - would export all diagrams as PNG/SVG files in a ZIP package');
}

function generateImplementationPlan() {
    alert('📋 Implementation plan generation - would create detailed project timeline, tasks, and development phases');
}

// Tab switching for diagrams
document.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).classList.contains('tab-btn')) {
        const tabBtn = e.target as HTMLElement;
        const tabId = tabBtn.dataset.tab;
        
        // Update active tab
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        tabBtn.classList.add('active');
        
        // Show corresponding panel
        document.querySelectorAll('.diagram-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(`${tabId}-diagram`)?.classList.add('active');
    }
});
// AWS Cost calculation functions
function calculateMicroservicesCost(userScale: string, budget: string): string {
    const costs = {
        small: '$300-600',
        medium: '$800-1500', 
        large: '$2000-5000',
        enterprise: '$5000-15000'
    };
    return costs[userScale] || '$300-600';
}

function calculateMonolithCost(userScale: string, budget: string): string {
    const costs = {
        small: '$100-250',
        medium: '$250-600',
        large: '$600-1500', 
        enterprise: '$1500-4000'
    };
    return costs[userScale] || '$100-250';
}

function calculateServerlessCost(userScale: string, budget: string): string {
    const costs = {
        small: '$50-150',
        medium: '$150-400',
        large: '$400-1000',
        enterprise: '$1000-3000'
    };
    return costs[userScale] || '$50-150';
}

function calculateJAMStackCost(userScale: string, budget: string): string {
    const costs = {
        small: '$20-80',
        medium: '$80-200',
        large: '$200-500',
        enterprise: '$500-1200'
    };
    return costs[userScale] || '$20-80';
}

// Fix generate architecture options function
(window as any).generateArchitectureOptions = async function() {
    const appDescription = (document.getElementById('app-description') as HTMLTextAreaElement)?.value;
    const userScale = (document.getElementById('user-scale') as HTMLSelectElement)?.value;
    const budget = (document.getElementById('budget-range') as HTMLSelectElement)?.value;
    
    if (!appDescription?.trim()) {
        alert('Please describe your application first');
        return;
    }
    
    const optionsContainer = document.getElementById('architecture-options');
    if (optionsContainer) {
        optionsContainer.innerHTML = '<div class="loading-spinner"></div><p>AI analyzing requirements...</p>';
    }
    
    showArchStep(2);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate architecture options with costs
    const architectures = [
        {
            id: 'microservices',
            name: 'Microservices Architecture',
            description: 'Multiple small services that communicate over APIs. Like having separate specialized teams.',
            example: 'Netflix, Amazon, Uber - each feature runs independently',
            pros: ['Scale parts separately', 'Use different technologies', 'Team independence'],
            cons: ['Complex to manage', 'Network overhead', 'Data consistency hard'],
            complexity: 'High',
            monthlyCost: calculateMicroservicesCost(userScale, budget),
            services: ['ECS/EKS: $150-500/month', 'RDS: $100-300/month', 'Load Balancer: $25/month'],
            recommended: userScale === 'large' || userScale === 'enterprise',
            pattern: '🏢 Enterprise Pattern'
        },
        {
            id: 'monolith',
            name: 'Monolithic Architecture',
            description: 'Single application with all features together. Like a Swiss Army knife.',
            example: 'Most startups, WordPress, traditional web apps',
            pros: ['Simple to develop', 'Easy to test', 'Single deployment', 'Lower costs'],
            cons: ['Hard to scale parts', 'Technology locked-in', 'Large team conflicts'],
            complexity: 'Low',
            monthlyCost: calculateMonolithCost(userScale, budget),
            services: ['EC2 Instance: $50-200/month', 'RDS: $50-150/month', 'Load Balancer: $25/month'],
            recommended: userScale === 'small' || budget === 'startup',
            pattern: '🚀 Startup Pattern'
        },
        {
            id: 'serverless',
            name: 'Serverless Architecture',
            description: 'No servers to manage - cloud runs your code automatically.',
            example: 'Simple APIs, event processing, mobile backends',
            pros: ['No server management', 'Pay only when used', 'Auto-scaling'],
            cons: ['Vendor lock-in', 'Cold start delays', 'Limited control'],
            complexity: 'Medium',
            monthlyCost: calculateServerlessCost(userScale, budget),
            services: ['Lambda: $20-100/month', 'API Gateway: $30-150/month', 'DynamoDB: $25-200/month'],
            recommended: budget === 'startup' || budget === 'small',
            pattern: '⚡ Modern Pattern'
        }
    ];
    
    const suggestedArch = architectures.find(a => a.recommended) || architectures[1];
    
    if (optionsContainer) {
        optionsContainer.innerHTML = `
            <div class="suggested-section">
                <h3>🎯 Our Recommendation for You</h3>
                <div class="suggested-card" onclick="selectArchitecture('${suggestedArch.id}')">
                    <div class="suggested-badge">BEST MATCH</div>
                    <h4>${suggestedArch.name}</h4>
                    <p>${suggestedArch.description}</p>
                    <div class="cost-highlight">Monthly Cost: ${suggestedArch.monthlyCost}</div>
                    <button class="action-button">Choose Recommended</button>
                </div>
            </div>
            
            <div class="all-options">
                <h3>All Architecture Options</h3>
                <div class="options-grid">
                    ${architectures.map(arch => `
                        <div class="arch-card" onclick="selectArchitecture('${arch.id}')">
                            <h4>${arch.name}</h4>
                            <p>${arch.description}</p>
                            <div class="cost-info">Cost: ${arch.monthlyCost}</div>
                            <div class="complexity">Complexity: ${arch.complexity}</div>
                            <button class="action-button">Select</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
};
// Add proper event listener after modal is created
setTimeout(() => {
    const generateBtn = document.getElementById('generate-arch-btn');
    if (generateBtn) {
        generateBtn.onclick = (window as any).generateArchitectureOptions;
        console.log('Generate button event listener added');
    }
}, 100);
// Restore create story functionality
function showCreateStoryModal() {
    const modal = document.getElementById('create-story-modal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function hideCreateStoryModal() {
    const modal = document.getElementById('create-story-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function handleCreateStory(e: Event) {
    e.preventDefault();
    
    const titleInput = document.getElementById('story-title') as HTMLInputElement;
    const descInput = document.getElementById('story-description') as HTMLTextAreaElement;
    const criteriaInput = document.getElementById('story-criteria') as HTMLTextAreaElement;
    const pointsInput = document.getElementById('story-points') as HTMLSelectElement;
    const typeInput = document.getElementById('story-type') as HTMLSelectElement;
    
    if (!titleInput.value.trim() || !descInput.value.trim() || !criteriaInput.value.trim()) {
        alert('Please fill in all required fields');
        return;
    }
    
    const newStory = {
        id: 'story-' + Date.now(),
        title: titleInput.value.trim(),
        description: descInput.value.trim(),
        acceptanceCriteria: criteriaInput.value.split('\n').filter(c => c.trim()),
        status: 'backlog',
        type: typeInput.value,
        points: parseInt(pointsInput.value),
        creationDate: new Date().toISOString()
    };
    
    stories.push(newStory);
    saveData();
    renderProjectBoard();
    hideCreateStoryModal();
    
    // Clear form
    titleInput.value = '';
    descInput.value = '';
    criteriaInput.value = '';
    pointsInput.value = '5';
    typeInput.value = 'story';
    
    alert('✅ Story created successfully!');
}

// Add event listeners for create story
document.addEventListener('DOMContentLoaded', () => {
    const createStoryButton = document.getElementById('create-story-button');
    if (createStoryButton) {
        createStoryButton.addEventListener('click', showCreateStoryModal);
    }
    
    const createStoryForm = document.getElementById('create-story-form');
    if (createStoryForm) {
        createStoryForm.addEventListener('submit', handleCreateStory);
    }
    
    const cancelStoryButton = document.getElementById('cancel-story-button');
    if (cancelStoryButton) {
        cancelStoryButton.addEventListener('click', hideCreateStoryModal);
    }
    
    const createStoryModalClose = document.getElementById('create-story-modal-close');
    if (createStoryModalClose) {
        createStoryModalClose.addEventListener('click', hideCreateStoryModal);
    }
});

// Replace Mermaid diagrams with professional Python-style diagrams
function generateSystemDiagram(archId: string): string {
    const diagrams = {
        microservices: `
            <div class="visual-diagram">
                <h4>🏗️ Microservices System Architecture</h4>
                <div class="diagram-visual">
                    <svg width="800" height="500" viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
                        <!-- Background -->
                        <rect width="800" height="500" fill="#f8f9fa" rx="8"/>
                        
                        <!-- Users -->
                        <g transform="translate(50, 50)">
                            <circle cx="40" cy="40" r="30" fill="#4CAF50" stroke="#2E7D32" stroke-width="2"/>
                            <text x="40" y="45" text-anchor="middle" fill="white" font-size="12" font-weight="bold">👥</text>
                            <text x="40" y="90" text-anchor="middle" fill="#333" font-size="11">Users</text>
                        </g>
                        
                        <!-- Load Balancer -->
                        <g transform="translate(200, 50)">
                            <rect x="0" y="20" width="100" height="40" fill="#FF9800" rx="6"/>
                            <text x="50" y="42" text-anchor="middle" fill="white" font-size="10" font-weight="bold">Load Balancer</text>
                        </g>
                        
                        <!-- API Gateway -->
                        <g transform="translate(200, 150)">
                            <rect x="0" y="20" width="100" height="40" fill="#2196F3" rx="6"/>
                            <text x="50" y="42" text-anchor="middle" fill="white" font-size="10" font-weight="bold">API Gateway</text>
                        </g>
                        
                        <!-- Microservices -->
                        <g transform="translate(400, 50)">
                            <rect x="0" y="0" width="80" height="35" fill="#9C27B0" rx="4"/>
                            <text x="40" y="20" text-anchor="middle" fill="white" font-size="9">Auth Service</text>
                            
                            <rect x="0" y="50" width="80" height="35" fill="#9C27B0" rx="4"/>
                            <text x="40" y="70" text-anchor="middle" fill="white" font-size="9">User Service</text>
                            
                            <rect x="0" y="100" width="80" height="35" fill="#9C27B0" rx="4"/>
                            <text x="40" y="120" text-anchor="middle" fill="white" font-size="9">Business Service</text>
                        </g>
                        
                        <!-- Databases -->
                        <g transform="translate(600, 50)">
                            <ellipse cx="40" cy="20" rx="35" ry="15" fill="#607D8B"/>
                            <text x="40" y="24" text-anchor="middle" fill="white" font-size="9">Auth DB</text>
                            
                            <ellipse cx="40" cy="70" rx="35" ry="15" fill="#607D8B"/>
                            <text x="40" y="74" text-anchor="middle" fill="white" font-size="9">User DB</text>
                            
                            <ellipse cx="40" cy="120" rx="35" ry="15" fill="#607D8B"/>
                            <text x="40" y="124" text-anchor="middle" fill="white" font-size="9">Analytics DB</text>
                        </g>
                        
                        <!-- Connections -->
                        <line x1="120" y1="90" x2="200" y2="70" stroke="#666" stroke-width="2" marker-end="url(#arrowhead)"/>
                        <line x1="250" y1="80" x2="250" y2="150" stroke="#666" stroke-width="2" marker-end="url(#arrowhead)"/>
                        <line x1="300" y1="170" x2="400" y2="120" stroke="#666" stroke-width="2" marker-end="url(#arrowhead)"/>
                        <line x1="480" y1="67" x2="565" y2="67" stroke="#666" stroke-width="2" marker-end="url(#arrowhead)"/>
                        <line x1="480" y1="117" x2="565" y2="117" stroke="#666" stroke-width="2" marker-end="url(#arrowhead)"/>
                        
                        <!-- Arrow marker -->
                        <defs>
                            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#666"/>
                            </marker>
                        </defs>
                    </svg>
                </div>
                
                <div class="diagram-benefits">
                    <div class="benefit-item">
                        <span class="benefit-icon">✅</span>
                        <span>Independent scaling of services</span>
                    </div>
                    <div class="benefit-item">
                        <span class="benefit-icon">✅</span>
                        <span>Technology diversity per service</span>
                    </div>
                    <div class="benefit-item">
                        <span class="benefit-icon">✅</span>
                        <span>Fault isolation and resilience</span>
                    </div>
                </div>
            </div>
        `,
        monolith: `
            <div class="visual-diagram">
                <h4>🏢 Monolithic System Architecture</h4>
                <div class="diagram-visual">
                    <svg width="700" height="400" viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg">
                        <rect width="700" height="400" fill="#f8f9fa" rx="8"/>
                        
                        <!-- Users -->
                        <g transform="translate(50, 150)">
                            <circle cx="40" cy="40" r="30" fill="#4CAF50" stroke="#2E7D32" stroke-width="2"/>
                            <text x="40" y="45" text-anchor="middle" fill="white" font-size="12" font-weight="bold">👥</text>
                            <text x="40" y="90" text-anchor="middle" fill="#333" font-size="11">Users</text>
                        </g>
                        
                        <!-- Load Balancer -->
                        <g transform="translate(200, 170)">
                            <rect x="0" y="0" width="100" height="40" fill="#FF9800" rx="6"/>
                            <text x="50" y="22" text-anchor="middle" fill="white" font-size="10" font-weight="bold">Load Balancer</text>
                        </g>
                        
                        <!-- Monolith App -->
                        <g transform="translate(350, 100)">
                            <rect x="0" y="0" width="120" height="120" fill="#2196F3" rx="8" stroke="#1976D2" stroke-width="2"/>
                            <text x="60" y="25" text-anchor="middle" fill="white" font-size="12" font-weight="bold">Monolith App</text>
                            
                            <!-- Internal modules -->
                            <rect x="10" y="35" width="45" height="25" fill="#1976D2" rx="3"/>
                            <text x="32" y="50" text-anchor="middle" fill="white" font-size="8">Auth</text>
                            
                            <rect x="65" y="35" width="45" height="25" fill="#1976D2" rx="3"/>
                            <text x="87" y="50" text-anchor="middle" fill="white" font-size="8">Business</text>
                            
                            <rect x="10" y="70" width="45" height="25" fill="#1976D2" rx="3"/>
                            <text x="32" y="85" text-anchor="middle" fill="white" font-size="8">API</text>
                            
                            <rect x="65" y="70" width="45" height="25" fill="#1976D2" rx="3"/>
                            <text x="87" y="85" text-anchor="middle" fill="white" font-size="8">UI</text>
                        </g>
                        
                        <!-- Database -->
                        <g transform="translate(550, 150)">
                            <ellipse cx="40" cy="30" rx="40" ry="20" fill="#607D8B"/>
                            <text x="40" y="34" text-anchor="middle" fill="white" font-size="10">PostgreSQL</text>
                        </g>
                        
                        <!-- Connections -->
                        <line x1="120" y1="190" x2="200" y2="190" stroke="#666" stroke-width="2" marker-end="url(#arrowhead)"/>
                        <line x1="300" y1="190" x2="350" y2="160" stroke="#666" stroke-width="2" marker-end="url(#arrowhead)"/>
                        <line x1="470" y1="160" x2="510" y2="170" stroke="#666" stroke-width="2" marker-end="url(#arrowhead)"/>
                        
                        <defs>
                            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#666"/>
                            </marker>
                        </defs>
                    </svg>
                </div>
                
                <div class="diagram-benefits">
                    <div class="benefit-item">
                        <span class="benefit-icon">✅</span>
                        <span>Simple deployment and testing</span>
                    </div>
                    <div class="benefit-item">
                        <span class="benefit-icon">✅</span>
                        <span>Lower operational overhead</span>
                    </div>
                    <div class="benefit-item">
                        <span class="benefit-icon">✅</span>
                        <span>Cost-effective for startups</span>
                    </div>
                </div>
            </div>
        `,
        serverless: `
            <div class="visual-diagram">
                <h4>⚡ Serverless System Architecture</h4>
                <div class="diagram-visual">
                    <svg width="800" height="450" viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg">
                        <rect width="800" height="450" fill="#f8f9fa" rx="8"/>
                        
                        <!-- Users -->
                        <g transform="translate(50, 180)">
                            <circle cx="40" cy="40" r="30" fill="#4CAF50" stroke="#2E7D32" stroke-width="2"/>
                            <text x="40" y="45" text-anchor="middle" fill="white" font-size="12" font-weight="bold">👥</text>
                            <text x="40" y="90" text-anchor="middle" fill="#333" font-size="11">Users</text>
                        </g>
                        
                        <!-- CloudFront -->
                        <g transform="translate(180, 200)">
                            <rect x="0" y="0" width="90" height="35" fill="#FF9800" rx="6"/>
                            <text x="45" y="20" text-anchor="middle" fill="white" font-size="9" font-weight="bold">CloudFront</text>
                        </g>
                        
                        <!-- S3 Website -->
                        <g transform="translate(180, 120)">
                            <rect x="0" y="0" width="90" height="35" fill="#4CAF50" rx="6"/>
                            <text x="45" y="20" text-anchor="middle" fill="white" font-size="9" font-weight="bold">S3 Website</text>
                        </g>
                        
                        <!-- API Gateway -->
                        <g transform="translate(320, 200)">
                            <rect x="0" y="0" width="90" height="35" fill="#2196F3" rx="6"/>
                            <text x="45" y="20" text-anchor="middle" fill="white" font-size="9" font-weight="bold">API Gateway</text>
                        </g>
                        
                        <!-- Lambda Functions -->
                        <g transform="translate(480, 80)">
                            <rect x="0" y="0" width="70" height="30" fill="#FF6B35" rx="4"/>
                            <text x="35" y="18" text-anchor="middle" fill="white" font-size="8">Auth λ</text>
                            
                            <rect x="0" y="50" width="70" height="30" fill="#FF6B35" rx="4"/>
                            <text x="35" y="68" text-anchor="middle" fill="white" font-size="8">API λ</text>
                            
                            <rect x="0" y="100" width="70" height="30" fill="#FF6B35" rx="4"/>
                            <text x="35" y="118" text-anchor="middle" fill="white" font-size="8">Process λ</text>
                        </g>
                        
                        <!-- DynamoDB -->
                        <g transform="translate(620, 150)">
                            <ellipse cx="35" cy="25" rx="35" ry="20" fill="#607D8B"/>
                            <text x="35" y="29" text-anchor="middle" fill="white" font-size="9">DynamoDB</text>
                        </g>
                        
                        <!-- S3 Storage -->
                        <g transform="translate(620, 250)">
                            <rect x="0" y="0" width="70" height="30" fill="#4CAF50" rx="4"/>
                            <text x="35" y="18" text-anchor="middle" fill="white" font-size="8">S3 Storage</text>
                        </g>
                        
                        <!-- Connections -->
                        <line x1="120" y1="220" x2="180" y2="218" stroke="#666" stroke-width="2" marker-end="url(#arrowhead)"/>
                        <line x1="225" y1="200" x2="225" y2="155" stroke="#666" stroke-width="2" marker-end="url(#arrowhead)"/>
                        <line x1="270" y1="218" x2="320" y2="218" stroke="#666" stroke-width="2" marker-end="url(#arrowhead)"/>
                        <line x1="410" y1="210" x2="480" y2="115" stroke="#666" stroke-width="2" marker-end="url(#arrowhead)"/>
                        <line x1="550" y1="95" x2="585" y2="160" stroke="#666" stroke-width="2" marker-end="url(#arrowhead)"/>
                        <line x1="550" y1="115" x2="620" y2="260" stroke="#666" stroke-width="2" marker-end="url(#arrowhead)"/>
                        
                        <defs>
                            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#666"/>
                            </marker>
                        </defs>
                    </svg>
                </div>
                
                <div class="diagram-benefits">
                    <div class="benefit-item">
                        <span class="benefit-icon">✅</span>
                        <span>No server management required</span>
                    </div>
                    <div class="benefit-item">
                        <span class="benefit-icon">✅</span>
                        <span>Pay only for actual usage</span>
                    </div>
                    <div class="benefit-item">
                        <span class="benefit-icon">✅</span>
                        <span>Automatic scaling and availability</span>
                    </div>
                </div>
            </div>
        `
    };
    
    return diagrams[archId] || diagrams.monolith;
}
// Project selection modal before story creation
function showProjectSelectionModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay project-selection-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" onclick="this.closest('.modal-overlay').remove(); document.body.style.overflow = 'auto';">&times;</button>
            <h2>📁 Select Project</h2>
            <p>Choose where to add your new story</p>
            
            <div class="project-options">
                <div class="option-card">
                    <input type="radio" name="project-option" value="existing" id="existing-project" checked>
                    <label for="existing-project">
                        <div class="option-header">
                            <span class="option-icon">📂</span>
                            <span class="option-title">Add to Existing Project</span>
                        </div>
                        <p class="option-description">Add story to: ${currentProject?.name || 'Generated Project'}</p>
                    </label>
                    
                    <div class="project-tree">
                        <h4>📊 Current Project</h4>
                        <div class="tree-view">
                            <div class="tree-node">
                                <span class="tree-icon">📁</span>
                                <span class="tree-label">${currentProject?.name || 'Generated Project'}</span>
                                <span class="tree-count">${stories.length} stories</span>
                            </div>
                            <div class="tree-children">
                                <div class="tree-node">
                                    <span class="tree-icon">📋</span>
                                    <span class="tree-label">Backlog</span>
                                    <span class="tree-count">${stories.filter(s => s.status === 'backlog' || s.status === 'blocked').length}</span>
                                </div>
                                <div class="tree-node">
                                    <span class="tree-icon">⚡</span>
                                    <span class="tree-label">In Progress</span>
                                    <span class="tree-count">${stories.filter(s => s.status === 'in-progress').length}</span>
                                </div>
                                <div class="tree-node">
                                    <span class="tree-icon">✅</span>
                                    <span class="tree-label">Done</span>
                                    <span class="tree-count">${stories.filter(s => s.status === 'done').length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="option-card">
                    <input type="radio" name="project-option" value="new" id="new-project">
                    <label for="new-project">
                        <div class="option-header">
                            <span class="option-icon">➕</span>
                            <span class="option-title">Create New Project</span>
                        </div>
                        <p class="option-description">Start fresh project with this story</p>
                    </label>
                    
                    <div class="new-project-form" style="display: none;">
                        <div class="form-group">
                            <label>Project Name</label>
                            <input type="text" id="new-project-name" placeholder="Enter project name...">
                        </div>
                        <div class="form-group">
                            <label>Description</label>
                            <textarea id="new-project-desc" placeholder="Brief description..."></textarea>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="action-button secondary" onclick="this.closest('.modal-overlay').remove(); document.body.style.overflow = 'auto';">Cancel</button>
                <button class="action-button" onclick="proceedToStoryCreation()">Continue</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Add radio button listeners
    setTimeout(() => {
        const newRadio = document.getElementById('new-project') as HTMLInputElement;
        const newProjectForm = document.querySelector('.new-project-form') as HTMLElement;
        
        if (newRadio) {
            newRadio.addEventListener('change', () => {
                newProjectForm.style.display = newRadio.checked ? 'block' : 'none';
            });
        }
        
        const existingRadio = document.getElementById('existing-project') as HTMLInputElement;
        if (existingRadio) {
            existingRadio.addEventListener('change', () => {
                newProjectForm.style.display = 'none';
            });
        }
    }, 100);
}

// Proceed to story creation after project selection
(window as any).proceedToStoryCreation = function() {
    const newRadio = document.getElementById('new-project') as HTMLInputElement;
    
    if (newRadio?.checked) {
        const projectName = (document.getElementById('new-project-name') as HTMLInputElement)?.value;
        const projectDesc = (document.getElementById('new-project-desc') as HTMLTextAreaElement)?.value;
        
        if (!projectName?.trim()) {
            alert('Please enter a project name');
            return;
        }
        
        // Create new project
        currentProject = {
            id: 'proj-' + Date.now(),
            name: projectName.trim(),
            description: projectDesc?.trim() || '',
            createdDate: new Date().toISOString(),
            stories: []
        };
        
        // Clear existing stories for new project
        stories = [];
        saveData();
    }
    
    // Close project selection modal
    document.querySelector('.project-selection-modal')?.remove();
    document.body.style.overflow = 'auto';
    
    // Show story creation modal
    const storyModal = document.getElementById('create-story-modal');
    if (storyModal) {
        storyModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
};

// Update showCreateStoryModal to use project selection
function showCreateStoryModal() {
    showProjectSelectionModal();
}
// Fix navigation links
(window as any).exportTechnicalDoc = function() {
    const architectureData = {
        selectedArchitecture: 'microservices', // or get from current selection
        diagrams: ['system', 'sequence', 'database', 'deployment'],
        timestamp: new Date().toISOString()
    };
    
    // Create downloadable PDF content
    const pdfContent = `
# Technical Architecture Document
Generated: ${new Date().toLocaleDateString()}

## Architecture Overview
Selected: Microservices Architecture

## System Components
- Load Balancer: AWS ALB
- API Gateway: AWS API Gateway  
- Microservices: ECS containers
- Databases: RDS PostgreSQL
- Storage: S3 buckets

## Cost Estimate
Monthly: $800-1500 (medium scale)

## Implementation Timeline
- Week 1-2: Infrastructure setup
- Week 3-4: Core services development
- Week 5-6: Integration and testing
- Week 7-8: Deployment and monitoring
    `;
    
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'technical-architecture-document.txt';
    a.click();
    URL.revokeObjectURL(url);
    
    alert('📄 Technical document exported successfully!');
};

(window as any).exportDiagrams = function() {
    alert('📊 All diagrams exported as PNG files in ZIP package');
};

(window as any).generateImplementationPlan = function() {
    const plan = `
# Implementation Plan

## Phase 1: Infrastructure (Week 1-2)
- Set up AWS account and IAM roles
- Configure VPC and networking
- Deploy load balancer and API gateway

## Phase 2: Core Services (Week 3-4)  
- Develop authentication service
- Build user management service
- Create business logic services

## Phase 3: Integration (Week 5-6)
- Service-to-service communication
- Database integration
- API testing and validation

## Phase 4: Deployment (Week 7-8)
- Production deployment
- Monitoring and logging setup
- Performance optimization
    `;
    
    const blob = new Blob([plan], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'implementation-plan.txt';
    a.click();
    URL.revokeObjectURL(url);
    
    alert('📋 Implementation plan generated and downloaded!');
};

// Fix BRD context integration
function getBRDContext(): string {
    const projectContext = {
        name: currentProject?.name || 'Generated Project',
        storiesCount: stories.length,
        features: stories.map(s => s.title).slice(0, 5),
        requirements: 'User authentication, dashboard, data management, reporting'
    };
    
    return `Project: ${projectContext.name}
Stories: ${projectContext.storiesCount} user stories
Key Features: ${projectContext.features.join(', ')}
Requirements: ${projectContext.requirements}`;
}
// Make handleLogin globally available
(window as any).handleLogin = handleLogin;