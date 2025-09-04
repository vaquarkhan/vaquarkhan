// Project Stories Management - Architecture and Framework Separation
class ProjectStories {
    constructor() {
        this.initializeProjectStories();
    }

    initializeProjectStories() {
        // Override the existing story generation to include architecture and framework stories
        const originalGenerateButton = document.getElementById('generate-button');
        if (originalGenerateButton) {
            originalGenerateButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.generateProjectWithArchitecture();
            });
        }
    }

    async generateProjectWithArchitecture() {
        const brdInput = document.getElementById('brd-input');
        const brdContent = brdInput?.value?.trim();
        
        if (!brdContent) {
            alert('Please provide Business Requirements Document content');
            return;
        }

        // Show loading
        const generateButton = document.getElementById('generate-button');
        const originalText = generateButton.textContent;
        generateButton.textContent = 'Generating Project...';
        generateButton.disabled = true;

        try {
            // Generate project stories including architecture and framework
            const stories = await this.generateStoriesFromBRD(brdContent);
            
            // Save stories
            localStorage.setItem('projectStories', JSON.stringify(stories));
            
            // Navigate to project board
            this.showProjectBoard();
            
        } catch (error) {
            console.error('Story generation failed:', error);
            alert('Failed to generate stories. Please try again.');
        } finally {
            generateButton.textContent = originalText;
            generateButton.disabled = false;
        }
    }

    async generateStoriesFromBRD(brdContent) {
        // Create architecture story (always first)
        const architectureStory = {
            id: 'arch-001',
            title: '🏗️ System Architecture',
            description: 'Design system architecture and technology stack.',
            acceptanceCriteria: [
                'Architecture design document',
                'System diagram created',
                'Technology stack selected'
            ],
            points: 8,
            type: 'architecture',
            status: 'backlog',
            priority: 'highest',
            blocksOthers: true,
            isArchitectureStory: true
        };

        // Create framework story (depends on architecture)
        const frameworkStory = {
            id: 'fw-001',
            title: '💻 Framework Setup',
            description: 'Setup basic project framework using the architecture design.',
            acceptanceCriteria: [
                'Project structure created',
                'Basic components setup',
                'Framework configured'
            ],
            points: 5,
            type: 'framework',
            status: 'blocked',
            priority: 'high',
            dependsOn: ['arch-001'],
            isFrameworkStory: true,
            blockedBy: 'Architecture must be completed first'
        };

        // Generate regular user stories from BRD
        const regularStories = await this.generateRegularStories(brdContent);

        // Mark all regular stories as blocked by framework
        const blockedStories = regularStories.map(story => ({
            ...story,
            status: 'blocked',
            dependsOn: ['fw-001'],
            blockedBy: 'Framework implementation required first'
        }));

        return [architectureStory, frameworkStory, ...blockedStories];
    }

    async generateRegularStories(brdContent) {
        const mockStories = [
            {
                id: 'us-001',
                title: 'User Login',
                description: 'As a user, I want to login with email/password.',
                acceptanceCriteria: [
                    'Login form with email and password fields',
                    'Validate credentials and show success/error',
                    'Redirect to dashboard on success'
                ],
                points: 3,
                type: 'story',
                status: 'blocked',
                priority: 'high'
            },
            {
                id: 'us-002',
                title: 'User Dashboard',
                description: 'As a user, I want to see my dashboard after login.',
                acceptanceCriteria: [
                    'Show welcome message with user name',
                    'Display navigation menu',
                    'Show logout button'
                ],
                points: 2,
                type: 'story',
                status: 'blocked',
                priority: 'high'
            },
            {
                id: 'us-003',
                title: 'User Profile',
                description: 'As a user, I want to view and edit my profile.',
                acceptanceCriteria: [
                    'Display current user information',
                    'Edit name and email fields',
                    'Save changes with confirmation'
                ],
                points: 3,
                type: 'story',
                status: 'blocked',
                priority: 'medium'
            }
        ];

        return mockStories;
    }

    showProjectBoard() {
        // Hide dashboard and show project view
        document.getElementById('dashboard-container').style.display = 'none';
        document.getElementById('project-view-container').style.display = 'block';
        
        // Load and display stories
        this.loadProjectStories();
    }

    loadProjectStories() {
        const stories = JSON.parse(localStorage.getItem('projectStories') || '[]');
        
        // Clear existing cards
        document.getElementById('backlog-cards').innerHTML = '';
        document.getElementById('inprogress-cards').innerHTML = '';
        document.getElementById('done-cards').innerHTML = '';

        // Display stories in appropriate columns
        stories.forEach(story => {
            const storyCard = this.createStoryCard(story);
            
            if (story.status === 'backlog' || story.status === 'blocked') {
                document.getElementById('backlog-cards').appendChild(storyCard);
            } else if (story.status === 'inprogress') {
                document.getElementById('inprogress-cards').appendChild(storyCard);
            } else if (story.status === 'done') {
                document.getElementById('done-cards').appendChild(storyCard);
            }
        });

        // Update metrics
        this.updateProjectMetrics(stories);
    }

    createStoryCard(story) {
        const card = document.createElement('div');
        card.className = `story-card ${story.status} ${story.type}`;
        card.setAttribute('data-story-id', story.id);
        
        const priorityColor = {
            'highest': '#dc2626',
            'high': '#ea580c', 
            'medium': '#ca8a04',
            'low': '#65a30d'
        };

        const typeIcon = {
            'architecture': '🏗️',
            'framework': '💻',
            'story': '📋',
            'bug': '🐛'
        };

        card.innerHTML = `
            <div class="story-header">
                <span class="story-type-icon">${typeIcon[story.type] || '📋'}</span>
                <span class="story-id">${story.id}</span>
                <span class="story-points" style="background-color: ${priorityColor[story.priority] || '#6b7280'}">${story.points}</span>
            </div>
            <h4 class="story-title">${story.title}</h4>
            <p class="story-description">${story.description}</p>
            ${story.status === 'blocked' ? `
                <div class="blocked-indicator">
                    <span class="blocked-icon">🚫</span>
                    <span class="blocked-text">${story.blockedBy || 'Blocked'}</span>
                </div>
            ` : ''}
            ${story.dependsOn ? `
                <div class="dependency-info">
                    <span class="dependency-icon">🔗</span>
                    <span class="dependency-text">Depends on: ${story.dependsOn.join(', ')}</span>
                </div>
            ` : ''}
            <div class="story-footer">
                <span class="story-priority priority-${story.priority}">${story.priority}</span>
                <span class="story-status">${story.status}</span>
            </div>
        `;

        // Add click handler
        card.addEventListener('click', () => {
            if (story.isArchitectureStory) {
                window.architectureManager?.showArchitectureModal(story.id);
            } else if (story.isFrameworkStory) {
                if (this.isArchitectureComplete()) {
                    window.codeGenerator?.showCodeGeneratorModal(story.id);
                } else {
                    alert('Architecture must be completed before framework implementation');
                }
            } else {
                if (this.isFrameworkComplete()) {
                    window.storyWorkflow?.openEnhancedStoryModal(story.id);
                } else {
                    alert('Framework must be completed before working on user stories');
                }
            }
        });

        return card;
    }

    isArchitectureComplete() {
        const architecture = window.architectureManager?.currentArchitecture;
        return architecture && architecture.content;
    }

    isFrameworkComplete() {
        const stories = JSON.parse(localStorage.getItem('projectStories') || '[]');
        const frameworkStory = stories.find(s => s.isFrameworkStory);
        return frameworkStory && frameworkStory.status === 'done';
    }

    updateProjectMetrics(stories) {
        const totalStories = stories.length;
        const completedStories = stories.filter(s => s.status === 'done').length;
        
        document.getElementById('total-stories').textContent = totalStories;
        document.getElementById('completed-stories').textContent = completedStories;
        
        // Update status counts
        document.getElementById('backlog-count').textContent = stories.filter(s => s.status === 'backlog' || s.status === 'blocked').length;
        document.getElementById('progress-count').textContent = stories.filter(s => s.status === 'inprogress').length;
        document.getElementById('done-count').textContent = completedStories;
    }

    // Method to unblock stories when dependencies are completed
    checkAndUnblockStories() {
        const stories = JSON.parse(localStorage.getItem('projectStories') || '[]');
        let updated = false;

        stories.forEach(story => {
            if (story.status === 'blocked' && story.dependsOn) {
                const allDependenciesComplete = story.dependsOn.every(depId => {
                    const depStory = stories.find(s => s.id === depId);
                    return depStory && depStory.status === 'done';
                });

                if (allDependenciesComplete) {
                    story.status = 'backlog';
                    delete story.blockedBy;
                    updated = true;
                }
            }
        });

        if (updated) {
            localStorage.setItem('projectStories', JSON.stringify(stories));
            this.loadProjectStories();
        }
    }

    // Method to mark story as complete
    completeStory(storyId) {
        const stories = JSON.parse(localStorage.getItem('projectStories') || '[]');
        const story = stories.find(s => s.id === storyId);
        
        if (story) {
            story.status = 'done';
            localStorage.setItem('projectStories', JSON.stringify(stories));
            this.loadProjectStories();
            this.checkAndUnblockStories();
        }
    }
}

// Initialize Project Stories Management
window.projectStories = new ProjectStories();