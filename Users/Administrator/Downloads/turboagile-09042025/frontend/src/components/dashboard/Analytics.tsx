import React from 'react';
import { TurboAgileDB } from '../../services/database/TurboAgileDB';
import { Story } from '../../types';

interface AnalyticsProps {
  _db: TurboAgileDB;
  stories: Story[];
}

export const Analytics: React.FC<AnalyticsProps> = ({ _db, stories }) => {
  const totalStories = stories.length;
  const todoStories = stories.filter(story => story.status === 'todo').length;
  const inProgressStories = stories.filter(story => story.status === 'in-progress').length;
  const doneStories = stories.filter(story => story.status === 'done').length;
  
  const totalStoryPoints = stories.reduce((sum, story) => sum + story.storyPoints, 0);
  const completedStoryPoints = stories
    .filter(story => story.status === 'done')
    .reduce((sum, story) => sum + story.storyPoints, 0);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Project Analytics</h2>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{ 
          background: 'var(--card-background)', 
          padding: '1rem', 
          borderRadius: '8px',
          border: '1px solid var(--border-color)'
        }}>
          <h3>Total Stories</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
            {totalStories}
          </p>
        </div>
        
        <div style={{ 
          background: 'var(--card-background)', 
          padding: '1rem', 
          borderRadius: '8px',
          border: '1px solid var(--border-color)'
        }}>
          <h3>To Do</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning-color)' }}>
            {todoStories}
          </p>
        </div>
        
        <div style={{ 
          background: 'var(--card-background)', 
          padding: '1rem', 
          borderRadius: '8px',
          border: '1px solid var(--border-color)'
        }}>
          <h3>In Progress</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
            {inProgressStories}
          </p>
        </div>
        
        <div style={{ 
          background: 'var(--card-background)', 
          padding: '1rem', 
          borderRadius: '8px',
          border: '1px solid var(--border-color)'
        }}>
          <h3>Completed</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success-color)' }}>
            {doneStories}
          </p>
        </div>
      </div>
      
      <div style={{ 
        background: 'var(--card-background)', 
        padding: '1.5rem', 
        borderRadius: '8px',
        border: '1px solid var(--border-color)'
      }}>
        <h3>Story Points Summary</h3>
        <p>Total Story Points: <strong>{totalStoryPoints}</strong></p>
        <p>Completed Story Points: <strong>{completedStoryPoints}</strong></p>
        <p>Remaining Story Points: <strong>{totalStoryPoints - completedStoryPoints}</strong></p>
        
        {totalStoryPoints > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <p>Progress: <strong>{Math.round((completedStoryPoints / totalStoryPoints) * 100)}%</strong></p>
            <div style={{ 
              width: '100%', 
              height: '20px', 
              background: 'var(--border-color)', 
              borderRadius: '10px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: `${(completedStoryPoints / totalStoryPoints) * 100}%`, 
                height: '100%', 
                background: 'var(--success-color)',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

