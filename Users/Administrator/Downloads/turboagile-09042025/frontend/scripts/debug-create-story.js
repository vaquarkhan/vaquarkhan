// Debug create story functionality
console.log('Debug create story loaded');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - checking create story elements');
    
    const createButton = document.getElementById('create-story-button');
    const modal = document.getElementById('create-story-modal');
    
    console.log('Create button:', createButton ? 'EXISTS' : 'MISSING');
    console.log('Modal:', modal ? 'EXISTS' : 'MISSING');
    
    if (createButton) {
        createButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Create story button clicked');
            
            if (modal) {
                modal.style.display = 'flex';
                modal.style.position = 'fixed';
                modal.style.top = '0';
                modal.style.left = '0';
                modal.style.width = '100%';
                modal.style.height = '100%';
                modal.style.zIndex = '9999';
                modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
                console.log('Modal shown');
            } else {
                console.error('Modal not found!');
                alert('Create story modal not found');
            }
        });
    }
    
    // Close modal handlers
    const closeBtn = document.getElementById('create-story-modal-close');
    const cancelBtn = document.getElementById('cancel-story-button');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            console.log('Close button clicked');
            if (modal) modal.style.display = 'none';
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            console.log('Cancel button clicked');
            if (modal) modal.style.display = 'none';
        });
    }
});