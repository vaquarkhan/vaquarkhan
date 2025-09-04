// Simple create story functionality
console.log('Create story script loaded');

let stories = [];

// Show create story modal
function showCreateStoryModal() {
    const modal = document.getElementById('create-story-modal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Hide create story modal
function hideCreateStoryModal() {
    const modal = document.getElementById('create-story-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Handle create story form
function handleCreateStory(e) {
    e.preventDefault();
    
    const title = document.getElementById('story-title').value.trim();
    const description = document.getElementById('story-description').value.trim();
    const criteria = document.getElementById('story-criteria').value.trim();
    const points = document.getElementById('story-points').value;
    
    if (!title || !description || !criteria) {
        alert('Please fill in all required fields');
        return;
    }
    
    const newStory = {
        id: 'story-' + Date.now(),
        title: title,
        description: description,
        acceptanceCriteria: criteria.split('\n').filter(c => c.trim()),
        status: 'backlog',
        points: parseInt(points),
        creationDate: new Date().toISOString()
    };
    
    stories.push(newStory);
    localStorage.setItem('turboagile_stories', JSON.stringify(stories));
    
    hideCreateStoryModal();
    alert('✅ Story created successfully!');
    
    // Clear form
    document.getElementById('story-title').value = '';
    document.getElementById('story-description').value = '';
    document.getElementById('story-criteria').value = '';
    document.getElementById('story-points').value = '5';
}

// Add event listeners
document.addEventListener('DOMContentLoaded', function() {
    const createButton = document.getElementById('create-story-button');
    if (createButton) {
        createButton.addEventListener('click', showCreateStoryModal);
    }
    
    const form = document.getElementById('create-story-form');
    if (form) {
        form.addEventListener('submit', handleCreateStory);
    }
    
    const cancelButton = document.getElementById('cancel-story-button');
    if (cancelButton) {
        cancelButton.addEventListener('click', hideCreateStoryModal);
    }
    
    const closeButton = document.getElementById('create-story-modal-close');
    if (closeButton) {
        closeButton.addEventListener('click', hideCreateStoryModal);
    }
});