import React, { useState } from 'react';
import { TurboAgileDB } from '../services/database/TurboAgileDB';
import { Story } from '../types';
import { MainDashboard } from './dashboard/MainDashboard';

interface TurboAgileAppProps {
  db: TurboAgileDB;
  stories: Story[];
  setStories: React.Dispatch<React.SetStateAction<Story[]>>;
}

export const TurboAgileApp: React.FC<TurboAgileAppProps> = ({
  db,
  stories,
  setStories
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<string>('dashboard');

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('dashboard');
  };

  if (!isLoggedIn) {
    return (
      <div id="login-container" className="fade-in">
        <div className="login-box">
          <div className="login-showcase">
            <div className="login-hero">
              <h1>Welcome to TurboAgile</h1>
              <p>Your comprehensive project management and development platform</p>
            </div>
            <div className="feature-grid">
              <div className="feature-card">
                <div className="feature-icon">📋</div>
                <h3>Project Management</h3>
                <p>Organize and track your projects with ease</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🚀</div>
                <h3>Agile Development</h3>
                <p>Streamline your development workflow</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3>Analytics</h3>
                <p>Get insights into your project performance</p>
              </div>
            </div>
          </div>
          <div className="login-form-container">
            <div className="login-header">
              <h2>Get Started</h2>
              <p>Enter your credentials to continue</p>
            </div>
            <form id="login-form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" placeholder="Enter username" />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" placeholder="Enter password" />
              </div>
              <button type="button" id="login-button" onClick={handleLogin}>
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <MainDashboard
      db={db}
      stories={stories}
      setStories={setStories}
      currentView={currentView}
      setCurrentView={setCurrentView}
      onLogout={handleLogout}
    />
  );
};
