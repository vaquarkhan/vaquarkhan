import { Story } from '../../types';

export class TurboAgileDB {
  private stories: Story[] = [];

  constructor() {
    // Initialize with some sample data
    this.stories = [
      {
        id: '1',
        title: 'Setup Project Structure',
        description: 'Create the basic project structure and configuration',
        status: 'todo',
        priority: 'high',
        storyPoints: 3,
        assignee: 'Team',
        acceptanceCriteria: [
          'Project folder structure created',
          'Basic configuration files added',
          'Development environment setup'
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Implement Authentication',
        description: 'Add user authentication and login functionality',
        status: 'in-progress',
        priority: 'high',
        storyPoints: 5,
        assignee: 'Developer',
        acceptanceCriteria: [
          'Login form created',
          'User validation implemented',
          'Session management added'
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }

  getStories(): Story[] {
    return [...this.stories];
  }

  addStory(story: Omit<Story, 'id' | 'createdAt' | 'updatedAt'>): Story {
    const newStory: Story = {
      ...story,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.stories.push(newStory);
    return newStory;
  }

  updateStory(id: string, updates: Partial<Story>): Story | null {
    const index = this.stories.findIndex(story => story.id === id);
    if (index === -1) return null;
    
    this.stories[index] = {
      ...this.stories[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return this.stories[index];
  }

  deleteStory(id: string): boolean {
    const index = this.stories.findIndex(story => story.id === id);
    if (index === -1) return false;
    
    this.stories.splice(index, 1);
    return true;
  }
}

