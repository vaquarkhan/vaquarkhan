import React, { useEffect, useState } from 'react';
import { TurboAgileDB } from '../services/database/TurboAgileDB';
import { Story } from '../types';
import { TurboAgileApp } from './TurboAgileApp';

const App: React.FC = () => {
  const [db, setDb] = useState<TurboAgileDB | null>(null);
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    try {
      // Initialize database
      const database = new TurboAgileDB();
      setDb(database);

      // Load stories
      const loadedStories = database.getStories();
      setStories(loadedStories);
    } catch (error) {
      console.error('Error in App useEffect:', error);
    }
  }, []);

  if (!db) {
    return <div style={{ color: 'white', padding: '20px' }}>Loading database...</div>;
  }

  return (
    <TurboAgileApp
      db={db}
      stories={stories}
      setStories={setStories}
    />
  );
};

export default App;
