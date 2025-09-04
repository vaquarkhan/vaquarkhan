import React, { useState } from 'react';
import { TurboAgileDB } from '../../services/database/TurboAgileDB';
import { Story } from '../../types';
import { ProjectBoard } from '../project/ProjectBoard';
import { Analytics } from './Analytics';
import { Settings } from './Settings';
import { AIResearch } from '../ai/AIResearch';
import { CostOptimization } from '../cost/CostOptimization';
import { IncidentAnalysis } from '../incident/IncidentAnalysis';
import { StandupManagement } from '../standup/StandupManagement';
import { EmailManagement } from '../email/EmailManagement';
import { MonitoringDashboard } from '../monitoring/MonitoringDashboard';

interface MainDashboardProps {
  db: TurboAgileDB;
  stories: Story[];
  setStories: React.Dispatch<React.SetStateAction<Story[]>>;
  currentView: string;
  setCurrentView: (view: string) => void;
  onLogout: () => void;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({
  db,
  stories,
  setStories,
  currentView,
  setCurrentView,
  onLogout
}) => {
  const renderView = () => {
    switch (currentView) {
      case 'project':
        return <ProjectBoard db={db} stories={stories} setStories={setStories} />;
      case 'analytics':
        return <Analytics _db={db} stories={stories} />;
      case 'ai-research':
        return <AIResearch />;
      case 'cost-optimization':
        return <CostOptimization />;
      case 'incident-analysis':
        return <IncidentAnalysis />;
      case 'standup-management':
        return <StandupManagement />;
      case 'email-management':
        return <EmailManagement />;
      case 'monitoring':
        return <MonitoringDashboard />;
      case 'settings':
        return <Settings _db={db} onLogout={onLogout} />;
      default:
        return (
          <div className="dashboard-overview">
            <div className="feature-grid">
              <div className="feature-card" onClick={() => setCurrentView('project')}>
                <div className="feature-icon">📋</div>
                <h3>Project Board</h3>
                <p>Manage your user stories and tasks</p>
              </div>
              <div className="feature-card" onClick={() => setCurrentView('analytics')}>
                <div className="feature-icon">📊</div>
                <h3>Analytics</h3>
                <p>View project metrics and performance</p>
              </div>
              <div className="feature-card" onClick={() => setCurrentView('ai-research')}>
                <div className="feature-icon">🔍</div>
                <h3>AI Research</h3>
                <p>AI-powered research and analysis tools</p>
              </div>
              <div className="feature-card" onClick={() => setCurrentView('cost-optimization')}>
                <div className="feature-icon">💰</div>
                <h3>Cost Optimization</h3>
                <p>Monitor and optimize cloud costs</p>
              </div>
              <div className="feature-card" onClick={() => setCurrentView('incident-analysis')}>
                <div className="feature-icon">🚨</div>
                <h3>Incident Analysis</h3>
                <p>Track and resolve incidents</p>
              </div>
              <div className="feature-card" onClick={() => setCurrentView('standup-management')}>
                <div className="feature-icon">📅</div>
                <h3>Standup Management</h3>
                <p>Daily standup coordination</p>
              </div>
              <div className="feature-card" onClick={() => setCurrentView('email-management')}>
                <div className="feature-icon">📧</div>
                <h3>Email Management</h3>
                <p>Manage email workflows</p>
              </div>
              <div className="feature-card" onClick={() => setCurrentView('monitoring')}>
                <div className="feature-icon">📊</div>
                <h3>Monitoring</h3>
                <p>System monitoring and alerts</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>TurboAgile Dashboard</h1>
        <nav className="dashboard-nav">
          <button
            className={`nav-button ${currentView === 'project' ? 'active' : ''}`}
            onClick={() => setCurrentView('project')}
          >
            📋 Project Board
          </button>
          <button
            className={`nav-button ${currentView === 'analytics' ? 'active' : ''}`}
            onClick={() => setCurrentView('analytics')}
          >
            📊 Analytics
          </button>
          <button
            className={`nav-button ${currentView === 'ai-research' ? 'active' : ''}`}
            onClick={() => setCurrentView('ai-research')}
          >
            🔍 AI Research
          </button>
          <button
            className={`nav-button ${currentView === 'cost-optimization' ? 'active' : ''}`}
            onClick={() => setCurrentView('cost-optimization')}
          >
            💰 Cost Optimization
          </button>
          <button
            className={`nav-button ${currentView === 'incident-analysis' ? 'active' : ''}`}
            onClick={() => setCurrentView('incident-analysis')}
          >
            🚨 Incidents
          </button>
          <button
            className={`nav-button ${currentView === 'standup-management' ? 'active' : ''}`}
            onClick={() => setCurrentView('standup-management')}
          >
            📅 Standup
          </button>
          <button
            className={`nav-button ${currentView === 'email-management' ? 'active' : ''}`}
            onClick={() => setCurrentView('email-management')}
          >
            📧 Email
          </button>
          <button
            className={`nav-button ${currentView === 'monitoring' ? 'active' : ''}`}
            onClick={() => setCurrentView('monitoring')}
          >
            📊 Monitoring
          </button>
          <button
            className={`nav-button ${currentView === 'settings' ? 'active' : ''}`}
            onClick={() => setCurrentView('settings')}
          >
            ⚙️ Settings
          </button>
        </nav>
        <button className="logout-button" onClick={onLogout}>
          🚪 Logout
        </button>
      </header>

      <main className="dashboard-main">
        {renderView()}
      </main>
    </div>
  );
};
