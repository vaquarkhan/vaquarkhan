// Simple StoryManager stub to prevent import errors
export const storyManager = {
    initializeProject: function(brdText) {
        console.log('StoryManager: Initializing project with BRD:', brdText.substring(0, 100) + '...');
        // This is handled by main.ts now
        return true;
    }
};

console.log('StoryManager loaded');