import React from 'react';
import { Story } from '../../types';

interface StoryCardProps {
  story: Story;
  onUpdate: (story: Story) => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story, onUpdate }) => {
  const handleStatusChange = (newStatus: string) => {
    onUpdate({
      ...story,
      status: newStatus as 'todo' | 'in-progress' | 'done'
    });
  };

  return (
    <div className="story-card" data-story-id={story.id}>
      <div className="card-header">
        <h4>{story.title}</h4>
        <span className="story-points">{story.storyPoints} pts</span>
      </div>
      
      <p className="story-description">{story.description}</p>
      
      <strong>Acceptance Criteria:</strong>
      <ul>
        {story.acceptanceCriteria.map((criteria, index) => (
          <li key={index}>{criteria}</li>
        ))}
      </ul>
      
      <div style={{ marginTop: '1rem' }}>
        <strong>Assignee:</strong> {story.assignee}
        <br />
        <strong>Priority:</strong> {story.priority}
        <br />
        <strong>Status:</strong> 
        <select 
          value={story.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          style={{ marginLeft: '0.5rem' }}
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
    </div>
  );
};

