import React, { useState } from 'react';
import { TurboAgileDB } from '../../services/database/TurboAgileDB';
import { Story } from '../../types';
import { StoryCard } from './StoryCard';

interface ProjectBoardProps {
  db: TurboAgileDB;
  stories: Story[];
  setStories: React.Dispatch<React.SetStateAction<Story[]>>;
}

export const ProjectBoard: React.FC<ProjectBoardProps> = ({
  db,
  stories,
  setStories
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredStories = statusFilter === 'all' 
    ? stories 
    : stories.filter(story => story.status === statusFilter);

  const todoStories = filteredStories.filter(story => story.status === 'todo');
  const inProgressStories = filteredStories.filter(story => story.status === 'in-progress');
  const doneStories = filteredStories.filter(story => story.status === 'done');

  return (
    <div className="project-board">
      <div className="board-header">
        <h2>Project Board</h2>
        <div className="board-controls">
          <select 
            className="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <button className="create-story-btn">
            + Create Story
          </button>
        </div>
      </div>

      <div className="board-columns">
        <div className="board-column">
          <h3>To Do ({todoStories.length})</h3>
          <div className="cards-container">
            {todoStories.map(story => (
              <StoryCard 
                key={story.id} 
                story={story} 
                onUpdate={(updatedStory) => {
                  const newStories = stories.map(s => 
                    s.id === updatedStory.id ? updatedStory : s
                  );
                  setStories(newStories);
                }}
              />
            ))}
          </div>
        </div>

        <div className="board-column">
          <h3>In Progress ({inProgressStories.length})</h3>
          <div className="cards-container">
            {inProgressStories.map(story => (
              <StoryCard 
                key={story.id} 
                story={story} 
                onUpdate={(updatedStory) => {
                  const newStories = stories.map(s => 
                    s.id === updatedStory.id ? updatedStory : s
                  );
                  setStories(newStories);
                }}
              />
            ))}
          </div>
        </div>

        <div className="board-column">
          <h3>Done ({doneStories.length})</h3>
          <div className="cards-container">
            {doneStories.map(story => (
              <StoryCard 
                key={story.id} 
                story={story} 
                onUpdate={(updatedStory) => {
                  const newStories = stories.map(s => 
                    s.id === updatedStory.id ? updatedStory : s
                  );
                  setStories(newStories);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

