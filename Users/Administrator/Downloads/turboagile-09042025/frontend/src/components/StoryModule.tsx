import React, { useState, useEffect } from 'react';
import { Story } from '../types';

interface StoryModuleProps {
  projectId: string;
  onStoryUpdate: (story: Story) => void;
  onStoryDelete: (storyId: string) => void;
}

interface StoryFormData {
  title: string;
  description: string;
  acceptanceCriteria: string;
  storyPoints: number;
  priority: string;
  type: string;
  assignee: string;
  reporter: string;
  sprint: string;
  epicLink: string;
  labels: string[];
  dueDate: string;
}

const StoryModule: React.FC<StoryModuleProps> = ({ projectId, onStoryUpdate, onStoryDelete }) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [formData, setFormData] = useState<StoryFormData>({
    title: '',
    description: '',
    acceptanceCriteria: '',
    storyPoints: 0,
    priority: 'medium',
    type: 'story',
    assignee: '',
    reporter: '',
    sprint: '',
    epicLink: '',
    labels: [],
    dueDate: ''
  });

  const statuses = ['backlog', 'to-do', 'in-progress', 'review', 'done'];
  const types = ['story', 'bug', 'task', 'epic'];
  const priorities = ['low', 'medium', 'high', 'critical'];
  const storyPointOptions = [1, 2, 3, 5, 8, 13, 21];

  useEffect(() => {
    // Load stories from backend API
    loadStories();
  }, [projectId]);

  const loadStories = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/stories`);
      if (response.ok) {
        const data = await response.json();
        setStories(data);
      }
    } catch (error) {
      console.error('Failed to load stories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingStory 
        ? `/api/projects/${projectId}/stories/${editingStory.id}`
        : `/api/projects/${projectId}/stories`;
      
      const method = editingStory ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          projectId,
          status: editingStory ? editingStory.status : 'backlog'
        }),
      });

      if (response.ok) {
        const savedStory = await response.json();
        if (editingStory) {
          onStoryUpdate(savedStory);
          setStories(stories.map(s => s.id === savedStory.id ? savedStory : s));
        } else {
          setStories([...stories, savedStory]);
        }
        resetForm();
        setShowForm(false);
      }
    } catch (error) {
      console.error('Failed to save story:', error);
    }
  };

  const handleEdit = (story: Story) => {
    setEditingStory(story);
    setFormData({
      title: story.title,
      description: story.description || '',
      acceptanceCriteria: story.acceptanceCriteria || '',
      storyPoints: story.storyPoints || 0,
      priority: story.priority || 'medium',
      type: story.type || 'story',
      assignee: story.assignee || '',
      reporter: story.reporter || '',
      sprint: story.sprint || '',
      epicLink: story.epicLink || '',
      labels: story.labels || [],
      dueDate: story.dueDate ? new Date(story.dueDate).toISOString().split('T')[0] : ''
    });
    setShowForm(true);
  };

  const handleDelete = async (storyId: string) => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      try {
        const response = await fetch(`/api/projects/${projectId}/stories/${storyId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          onStoryDelete(storyId);
          setStories(stories.filter(s => s.id !== storyId));
        }
      } catch (error) {
        console.error('Failed to delete story:', error);
      }
    }
  };

  const handleStatusChange = async (storyId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/stories/${storyId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedStory = await response.json();
        onStoryUpdate(updatedStory);
        setStories(stories.map(s => s.id === storyId ? updatedStory : s));
      }
    } catch (error) {
      console.error('Failed to update story status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      acceptanceCriteria: '',
      storyPoints: 0,
      priority: 'medium',
      type: 'story',
      assignee: '',
      reporter: '',
      sprint: '',
      epicLink: '',
      labels: [],
      dueDate: ''
    });
    setEditingStory(null);
  };

  const filteredStories = stories.filter(story => {
    const matchesStatus = filterStatus === 'all' || story.status === filterStatus;
    const matchesType = filterType === 'all' || story.type === filterType;
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesType && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'backlog': return 'bg-gray-200 text-gray-800';
      case 'to-do': return 'bg-blue-200 text-blue-800';
      case 'in-progress': return 'bg-yellow-200 text-yellow-800';
      case 'review': return 'bg-purple-200 text-purple-800';
      case 'done': return 'bg-green-200 text-green-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="story-module">
      <div className="story-module-header">
        <h2 className="text-2xl font-bold mb-4">Story Management</h2>
        
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + Add Story
          </button>
          
          <input
            type="text"
            placeholder="Search stories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 flex-1 max-w-md"
          />
        </div>

        <div className="flex gap-4 mb-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="all">All Statuses</option>
            {statuses.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="all">All Types</option>
            {types.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {showForm && (
        <div className="story-form-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {editingStory ? 'Edit Story' : 'Create New Story'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    {types.map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Acceptance Criteria</label>
                <textarea
                  value={formData.acceptanceCriteria}
                  onChange={(e) => setFormData({...formData, acceptanceCriteria: e.target.value})}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Story Points</label>
                  <select
                    value={formData.storyPoints}
                    onChange={(e) => setFormData({...formData, storyPoints: parseInt(e.target.value)})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    {storyPointOptions.map(points => (
                      <option key={points} value={points}>{points}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    {priorities.map(priority => (
                      <option key={priority} value={priority}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Assignee</label>
                  <input
                    type="text"
                    value={formData.assignee}
                    onChange={(e) => setFormData({...formData, assignee: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Reporter</label>
                  <input
                    type="text"
                    value={formData.reporter}
                    onChange={(e) => setFormData({...formData, reporter: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Sprint</label>
                  <input
                    type="text"
                    value={formData.sprint}
                    onChange={(e) => setFormData({...formData, sprint: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Epic Link</label>
                  <input
                    type="text"
                    value={formData.epicLink}
                    onChange={(e) => setFormData({...formData, epicLink: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  {editingStory ? 'Update Story' : 'Create Story'}
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="stories-grid">
        {filteredStories.map(story => (
          <div key={story.id} className="story-card bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className="flex gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(story.status)}`}>
                  {story.status}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(story.priority)}`}>
                  {story.priority}
                </span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {story.type}
                </span>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(story)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(story.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  🗑️
                </button>
              </div>
            </div>

            <h4 className="font-semibold mb-2">{story.title}</h4>
            
            {story.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{story.description}</p>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
              <div>
                <span className="font-medium">Points:</span> {story.storyPoints || '?'}
              </div>
              <div>
                <span className="font-medium">Sprint:</span> {story.sprint || 'Backlog'}
              </div>
              {story.assignee && (
                <div>
                  <span className="font-medium">Assignee:</span> {story.assignee}
                </div>
              )}
              {story.dueDate && (
                <div>
                  <span className="font-medium">Due:</span> {new Date(story.dueDate).toLocaleDateString()}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <select
                value={story.status}
                onChange={(e) => handleStatusChange(story.id, e.target.value)}
                className="text-xs border border-gray-300 rounded px-2 py-1"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      {filteredStories.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No stories found matching your criteria.
        </div>
      )}
    </div>
  );
};

export default StoryModule;


