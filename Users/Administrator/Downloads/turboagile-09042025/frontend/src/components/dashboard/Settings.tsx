import React from 'react';
import { TurboAgileDB } from '../../services/database/TurboAgileDB';

interface SettingsProps {
  _db: TurboAgileDB;
  onLogout: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ _db, onLogout }) => {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Settings</h2>
      
      <div style={{ 
        background: 'var(--card-background)', 
        padding: '1.5rem', 
        borderRadius: '8px',
        border: '1px solid var(--border-color)',
        marginBottom: '1rem'
      }}>
        <h3>Account Settings</h3>
        <p>Manage your account preferences and settings here.</p>
        
        <div style={{ marginTop: '1rem' }}>
          <button 
            onClick={onLogout}
            style={{
              background: 'var(--error-color)',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>
      
      <div style={{ 
        background: 'var(--card-background)', 
        padding: '1.5rem', 
        borderRadius: '8px',
        border: '1px solid var(--border-color)',
        marginBottom: '1rem'
      }}>
        <h3>Application Settings</h3>
        <p>Configure application preferences and behavior.</p>
        
        <div style={{ marginTop: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            <input type="checkbox" defaultChecked /> Enable notifications
          </label>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            <input type="checkbox" defaultChecked /> Auto-save changes
          </label>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            <input type="checkbox" /> Enable dark mode by default
          </label>
        </div>
      </div>
      
      <div style={{ 
        background: 'var(--card-background)', 
        padding: '1.5rem', 
        borderRadius: '8px',
        border: '1px solid var(--border-color)'
      }}>
        <h3>About TurboAgile</h3>
        <p>Version: 1.0.0</p>
        <p>A comprehensive project management and development platform.</p>
      </div>
    </div>
  );
};

