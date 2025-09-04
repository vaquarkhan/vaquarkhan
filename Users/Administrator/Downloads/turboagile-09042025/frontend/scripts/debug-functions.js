// Debug functionality extracted from index.html
function debugStoryCards() {
    console.log('=== Story Card Debug ===');
    const storyCards = document.querySelectorAll('.story-card');
    console.log('Found story cards:', storyCards.length);
    
    storyCards.forEach((card, index) => {
        console.log(`Card ${index}:`, {
            id: card.getAttribute('data-story-id'),
            hasClickListener: card.onclick !== null,
            cursor: getComputedStyle(card).cursor
        });
    });
    
    const modal = document.getElementById('story-modal');
    console.log('Story modal exists:', !!modal);
    
    const modalDetails = document.getElementById('modal-story-details');
    console.log('Modal details exists:', !!modalDetails);
}

// Make debug function available globally
window.debugStoryCards = debugStoryCards;

// Auto-debug after page load
setTimeout(() => {
    if (window.location.hash === '#debug') {
        debugStoryCards();
    }
}, 2000);