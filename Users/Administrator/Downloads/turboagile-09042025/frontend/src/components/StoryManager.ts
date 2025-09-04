// Story Management System with Blocking Logic
import { architectureModal } from './ArchitectureModal.js';

export interface Story {
    id: string;
    title: string;
    description: string;
    type: 'architecture' | 'framework' | 'feature';
    status: 'blocked' | 'ready' | 'in-progress' | 'completed';
    blockedBy?: string[];
    dependencies?: string[];
    order: number;
    requirements?: string;
    architecture?: string;
    framework?: string;
    createdAt: Date;
}

export class StoryManager {
    private stories: Story[] = [];
    private projectRequirements: string = '';

    initializeProject(requirements: string) {
        this.projectRequirements = requirements;
        this.createInitialStories();
        this.saveAllStoriesToDatabase();
        this.renderStoryBoard();
    }
    
    private async saveStoryToDatabase(story: Story) {
        try {
            const { createDatabase } = await import('../database/index.js');
            const db = createDatabase();
            db.addStory(story);
        } catch (error) {
            console.error('Failed to save story:', error);
        }
    }
    
    private async saveAllStoriesToDatabase() {
        try {
            for (const story of this.stories) {
                await this.saveStoryToDatabase(story);
            }
        } catch (error) {
            console.error('Failed to save stories:', error);
        }
    }

    private createInitialStories() {
        console.log('Creating initial stories...');
        
        // Story 1: Architecture (Always first, unblocked)
        const architectureStory: Story = {
            id: 'story-arch-' + Date.now(),
            title: '🏗️ Define System Architecture',
            description: 'Create comprehensive system architecture including technology stack, component design, and infrastructure planning.',
            type: 'architecture',
            status: 'ready',
            order: 1,
            requirements: this.projectRequirements,
            createdAt: new Date()
        };
        
        console.log('Architecture story created:', architectureStory);

        // Story 2: Framework Setup (Blocked by architecture)
        const frameworkStory: Story = {
            id: 'story-framework-' + Date.now(),
            title: '⚙️ Setup Development Framework',
            description: 'Initialize project structure, configure build tools, setup development environment and core dependencies.',
            type: 'framework',
            status: 'blocked',
            blockedBy: [architectureStory.id],
            order: 2,
            createdAt: new Date()
        };

        // Generate feature stories based on requirements
        const featureStories = this.generateFeatureStories(frameworkStory.id);

        this.stories = [architectureStory, frameworkStory, ...featureStories];
    }

    private generateFeatureStories(frameworkStoryId: string): Story[] {
        const features = this.extractFeatures(this.projectRequirements);
        
        return features.map((feature, index) => {
            const story = {
                id: 'story-feature-' + Date.now() + '-' + index,
                title: feature.title,
                description: feature.description,
                type: 'feature' as const,
                status: 'blocked' as const,
                blockedBy: [frameworkStoryId],
                order: index + 3,
                createdAt: new Date()
            };
            
            // Save to database
            this.saveStoryToDatabase(story);
            return story;
        });
    }

    private extractFeatures(requirements: string): Array<{title: string, description: string}> {
        const reqLower = requirements.toLowerCase();
        const features = [];
        
        // Core Authentication Features
        if (reqLower.includes('user') || reqLower.includes('login') || reqLower.includes('auth')) {
            features.push(
                {
                    title: '👤 User Registration System',
                    description: 'Implement user registration with email verification, password validation, and account activation.'
                },
                {
                    title: '🔐 User Login & Authentication',
                    description: 'Create secure login system with JWT tokens, remember me, and session management.'
                },
                {
                    title: '🔑 Password Management',
                    description: 'Implement password reset, change password, and forgot password functionality.'
                },
                {
                    title: '👥 User Profile Management',
                    description: 'Allow users to view and edit their profile information, avatar upload, and preferences.'
                }
            );
        }
        
        // Dashboard & Analytics
        if (reqLower.includes('dashboard') || reqLower.includes('analytics') || reqLower.includes('report')) {
            features.push(
                {
                    title: '📊 Main Dashboard',
                    description: 'Create responsive dashboard with key metrics, charts, and real-time data visualization.'
                },
                {
                    title: '📈 Analytics & Reporting',
                    description: 'Implement comprehensive analytics with custom reports, data export, and insights.'
                },
                {
                    title: '📋 Activity Monitoring',
                    description: 'Track user activities, system events, and generate activity logs and audit trails.'
                }
            );
        }
        
        // Data Management
        if (reqLower.includes('data') || reqLower.includes('crud') || reqLower.includes('manage')) {
            features.push(
                {
                    title: '💾 Data Entry System',
                    description: 'Create forms for data input with validation, auto-save, and bulk operations.'
                },
                {
                    title: '📝 Data Management Interface',
                    description: 'Build CRUD operations with inline editing, batch updates, and data validation.'
                },
                {
                    title: '🔄 Data Import/Export',
                    description: 'Implement CSV/Excel import/export functionality with data mapping and validation.'
                }
            );
        }
        
        // Search & Filter
        if (reqLower.includes('search') || reqLower.includes('filter') || reqLower.includes('find')) {
            features.push(
                {
                    title: '🔍 Advanced Search System',
                    description: 'Implement full-text search with autocomplete, suggestions, and search history.'
                },
                {
                    title: '🎛️ Dynamic Filtering',
                    description: 'Create advanced filters with multiple criteria, saved filters, and quick filters.'
                },
                {
                    title: '📑 Search Results & Pagination',
                    description: 'Display search results with sorting, pagination, and result highlighting.'
                }
            );
        }
        
        // API & Integration
        if (reqLower.includes('api') || reqLower.includes('integration') || reqLower.includes('external')) {
            features.push(
                {
                    title: '🔌 REST API Development',
                    description: 'Build comprehensive REST API with proper endpoints, documentation, and versioning.'
                },
                {
                    title: '🔗 Third-party Integrations',
                    description: 'Integrate with external services, APIs, and implement webhook handling.'
                },
                {
                    title: '📡 Real-time Communication',
                    description: 'Implement WebSocket connections for real-time updates and notifications.'
                }
            );
        }
        
        // UI/UX Features
        if (reqLower.includes('ui') || reqLower.includes('interface') || reqLower.includes('responsive')) {
            features.push(
                {
                    title: '🎨 UI Component Library',
                    description: 'Create reusable UI components with consistent styling and accessibility features.'
                },
                {
                    title: '📱 Responsive Design',
                    description: 'Ensure mobile-first responsive design across all devices and screen sizes.'
                },
                {
                    title: '🌙 Theme & Customization',
                    description: 'Implement dark/light themes, user preferences, and UI customization options.'
                }
            );
        }
        
        // Security Features
        if (reqLower.includes('security') || reqLower.includes('permission') || reqLower.includes('role')) {
            features.push(
                {
                    title: '🛡️ Role-based Access Control',
                    description: 'Implement RBAC system with roles, permissions, and access level management.'
                },
                {
                    title: '🔒 Security Measures',
                    description: 'Add security features like rate limiting, CSRF protection, and input sanitization.'
                },
                {
                    title: '📋 Audit & Compliance',
                    description: 'Implement audit logging, compliance reporting, and security monitoring.'
                }
            );
        }
        
        // Notification System
        if (reqLower.includes('notification') || reqLower.includes('email') || reqLower.includes('alert')) {
            features.push(
                {
                    title: '📧 Email Notification System',
                    description: 'Implement email notifications with templates, scheduling, and delivery tracking.'
                },
                {
                    title: '🔔 In-app Notifications',
                    description: 'Create real-time in-app notifications with read/unread status and preferences.'
                },
                {
                    title: '📱 Push Notifications',
                    description: 'Implement browser and mobile push notifications with targeting and analytics.'
                }
            );
        }
        
        // File Management
        if (reqLower.includes('file') || reqLower.includes('upload') || reqLower.includes('document')) {
            features.push(
                {
                    title: '📁 File Upload System',
                    description: 'Implement secure file upload with validation, progress tracking, and cloud storage.'
                },
                {
                    title: '📄 Document Management',
                    description: 'Create document library with versioning, sharing, and collaboration features.'
                },
                {
                    title: '🖼️ Media Gallery',
                    description: 'Build media gallery with thumbnails, preview, and batch operations.'
                }
            );
        }
        
        // Testing & Quality
        features.push(
            {
                title: '🧪 Testing Framework',
                description: 'Implement comprehensive testing with unit tests, integration tests, and E2E testing.'
            },
            {
                title: '📊 Performance Monitoring',
                description: 'Add performance monitoring, error tracking, and application health checks.'
            },
            {
                title: '🚀 Deployment Pipeline',
                description: 'Create CI/CD pipeline with automated testing, building, and deployment processes.'
            }
        );
        
        return features;
    }

    renderStoryBoard() {
        const container = document.getElementById('story-board-container');
        if (!container) return;

        container.innerHTML = `
            <div class="story-board">
                <div class="board-header">
                    <h2>📋 Project Stories</h2>
                    <div class="board-stats">
                        <span class="stat">Total: ${this.stories.length}</span>
                        <span class="stat">Ready: ${this.stories.filter(s => s.status === 'ready').length}</span>
                        <span class="stat">Blocked: ${this.stories.filter(s => s.status === 'blocked').length}</span>
                    </div>
                </div>
                
                <div class="stories-container">
                    ${this.stories.map(story => this.renderStoryCard(story)).join('')}
                </div>
            </div>
        `;

        this.attachEventListeners();
    }

    private renderStoryCard(story: Story): string {
        const isBlocked = story.status === 'blocked';
        const canStart = story.status === 'ready';
        const inProgress = story.status === 'in-progress';
        const completed = story.status === 'completed';

        let actionButton = '';
        
        console.log('Story:', story.title, 'Status:', story.status, 'Type:', story.type, 'CanStart:', canStart, 'IsBlocked:', isBlocked);
        
        if (completed) {
            actionButton = `<div class="completed-indicator">✅ Completed</div>`;
        } else if (inProgress) {
            actionButton = `<div class="progress-indicator">🟡 In Progress...</div>`;
        } else if (isBlocked) {
            const blockedByTitles = story.blockedBy?.map(id => 
                this.stories.find(s => s.id === id)?.title || 'Unknown'
            ).join(', ') || '';
            actionButton = `<div class="blocked-indicator">🔒 Blocked by: ${blockedByTitles}</div>`;
        } else if (canStart) {
            if (story.type === 'architecture') {
                actionButton = `<button class="story-action-btn primary" data-story-id="${story.id}" data-action="architecture">🏗️ Design Architecture</button>`;
            } else if (story.type === 'framework') {
                actionButton = `<button class="story-action-btn primary" data-story-id="${story.id}" data-action="framework">⚙️ Setup Framework</button>`;
            } else if (story.type === 'feature') {
                actionButton = `<button class="story-action-btn primary" data-story-id="${story.id}" data-action="feature">💻 Develop Feature</button>`;
            }
        } else {
            actionButton = `<div class="no-action">Status: ${story.status}</div>`;
        }

        return `
            <div class="story-card ${story.type} ${story.status}" data-story-id="${story.id}">
                <div class="story-header">
                    <div class="story-order">${story.order}</div>
                    <div class="story-status ${story.status}">${this.getStatusIcon(story.status)}</div>
                </div>
                
                <div class="story-content">
                    <h3 class="story-title">${story.title}</h3>
                    <p class="story-description">${story.description}</p>
                    
                    ${story.architecture ? `
                        <div class="story-artifact">
                            <span class="artifact-label">🏗️ Architecture:</span>
                            <span class="artifact-status">Defined</span>
                        </div>
                    ` : ''}
                    
                    ${story.framework ? `
                        <div class="story-artifact">
                            <span class="artifact-label">⚙️ Framework:</span>
                            <span class="artifact-status">Configured</span>
                        </div>
                    ` : ''}
                </div>
                
                <div class="story-actions">
                    ${actionButton}
                </div>
            </div>
        `;
    }

    private getStatusIcon(status: string): string {
        switch (status) {
            case 'ready': return '🟢';
            case 'blocked': return '🔴';
            case 'in-progress': return '🟡';
            case 'completed': return '✅';
            default: return '⚪';
        }
    }

    private attachEventListeners() {
        document.querySelectorAll('.story-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                const storyId = target.dataset.storyId;
                const action = target.dataset.action;
                
                if (storyId && action) {
                    this.handleStoryAction(storyId, action);
                }
            });
        });

        // Listen for architecture approval
        document.addEventListener('architectureApproved', (e: any) => {
            this.completeArchitectureStory(e.detail.storyId);
        });
    }

    private handleStoryAction(storyId: string, action: string) {
        const story = this.stories.find(s => s.id === storyId);
        if (!story) return;

        switch (action) {
            case 'architecture':
                this.startArchitectureDesign(story);
                break;
            case 'framework':
                this.startFrameworkSetup(story);
                break;
            case 'feature':
                this.startFeatureDevelopment(story);
                break;
        }
    }

    private startArchitectureDesign(story: Story) {
        story.status = 'in-progress';
        this.renderStoryBoard();
        
        // Open architecture modal with requirements
        architectureModal.show(story.id, story.requirements || this.projectRequirements);
    }

    private completeArchitectureStory(storyId: string) {
        const story = this.stories.find(s => s.id === storyId);
        if (!story) return;

        story.status = 'completed';
        story.architecture = 'Architecture defined and approved';
        
        // Unblock framework story
        this.unblockDependentStories(storyId);
        this.renderStoryBoard();
        
        // Show success message
        this.showSuccessMessage('🏗️ Architecture completed! Framework setup is now available.');
    }

    private startFrameworkSetup(story: Story) {
        story.status = 'in-progress';
        this.renderStoryBoard();
        
        // Simulate framework setup process
        this.showFrameworkSetupModal(story);
    }

    private showFrameworkSetupModal(story: Story) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay framework-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>⚙️ Framework Setup</h2>
                    <button class="modal-close">&times;</button>
                </div>
                
                <div class="framework-content">
                    <div class="architecture-reference">
                        <h3>🏗️ Based on Approved Architecture</h3>
                        <div class="arch-summary">
                            <p>Following the defined system architecture...</p>
                            <button class="view-arch-btn">View Full Architecture</button>
                        </div>
                    </div>
                    
                    <div class="framework-steps">
                        <h3>🔧 Setup Progress</h3>
                        <div class="setup-step completed">
                            <span class="step-icon">✅</span>
                            <span class="step-text">Project structure created</span>
                        </div>
                        <div class="setup-step completed">
                            <span class="step-icon">✅</span>
                            <span class="step-text">Dependencies installed</span>
                        </div>
                        <div class="setup-step in-progress">
                            <span class="step-icon">🔄</span>
                            <span class="step-text">Build configuration...</span>
                        </div>
                        <div class="setup-step pending">
                            <span class="step-icon">⏳</span>
                            <span class="step-text">Development server setup</span>
                        </div>
                    </div>
                    
                    <div class="framework-actions">
                        <button id="complete-framework-btn" class="action-button">✅ Complete Setup</button>
                    </div>
                </div>
            </div>
        `;

        modal.querySelector('.modal-close')?.addEventListener('click', () => {
            modal.remove();
            document.body.style.overflow = 'auto';
        });

        modal.querySelector('#complete-framework-btn')?.addEventListener('click', () => {
            this.completeFrameworkStory(story.id);
            modal.remove();
            document.body.style.overflow = 'auto';
        });

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
    }

    private completeFrameworkStory(storyId: string) {
        const story = this.stories.find(s => s.id === storyId);
        if (!story) return;

        story.status = 'completed';
        story.framework = 'Framework configured and ready';
        
        // Unblock all feature stories
        this.unblockDependentStories(storyId);
        this.renderStoryBoard();
        
        this.showSuccessMessage('⚙️ Framework setup completed! All feature stories are now unblocked.');
    }

    private startFeatureDevelopment(story: Story) {
        story.status = 'in-progress';
        this.renderStoryBoard();
        
        // Show feature development modal (simplified)
        setTimeout(() => {
            story.status = 'completed';
            this.renderStoryBoard();
            this.showSuccessMessage(`✅ ${story.title} completed successfully!`);
        }, 2000);
    }

    private unblockDependentStories(completedStoryId: string) {
        this.stories.forEach(story => {
            if (story.blockedBy?.includes(completedStoryId)) {
                story.blockedBy = story.blockedBy.filter(id => id !== completedStoryId);
                if (story.blockedBy.length === 0) {
                    story.status = 'ready';
                }
            }
        });
    }

    private showSuccessMessage(message: string) {
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }

    getStories(): Story[] {
        return this.stories;
    }
}

// Global instance
export const storyManager = new StoryManager();