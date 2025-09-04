// Research report actions - Export PDF and Generate Stories
function exportResearchToPDF() {
    // Show progress
    const btn = document.getElementById('export-pdf-button');
    const originalText = btn.innerHTML;
    btn.innerHTML = '📄 Exporting...';
    btn.disabled = true;
    
    setTimeout(() => {
        // Simulate PDF generation
        const reportTitle = 'AI_Research_Report_' + new Date().toISOString().split('T')[0];
        alert(`✅ Research report exported as ${reportTitle}.pdf`);
        
        btn.innerHTML = originalText;
        btn.disabled = false;
    }, 2000);
}

function generateStoriesFromResearch() {
    // Close research modal
    document.getElementById('idea-research-modal').style.display = 'none';
    
    // Show progress modal
    showStoryGenerationProgress();
    
    // Navigate to story section
    setTimeout(() => {
        document.getElementById('story-generator-section').scrollIntoView({ behavior: 'smooth' });
        
        // Auto-populate BRD with research content
        const brdInput = document.getElementById('brd-input');
        if (brdInput) {
            const researchContent = `COMPREHENSIVE BUSINESS REQUIREMENTS DOCUMENT
Generated from AI Research Analysis

EXECUTIVE SUMMARY:
AI-powered productivity platform with revolutionary features that differentiate from competitors like Notion, Airtable, and ClickUp through advanced AI integration and predictive analytics.

KEY BUSINESS REQUIREMENTS:
- User authentication and authorization system
- Real-time collaborative document editing
- AI-powered content generation and suggestions
- Predictive analytics and insights
- Advanced project management features
- Mobile-responsive web application

TECHNICAL REQUIREMENTS:
- Frontend: React 18 + TypeScript + Vite
- Backend: Node.js + Express + PostgreSQL
- AI Integration: OpenAI/Gemini APIs
- Real-time: WebSocket connections
- Security: JWT + OAuth 2.0 + encryption

COMPETITIVE ADVANTAGES:
- Revolutionary AI integration (300% productivity boost)
- Predictive analytics (85% higher success rate)
- Self-configuring automation (250% time savings)
- First-mover advantage in AI-powered collaboration

USER STORIES REQUIREMENTS:
Generate comprehensive user stories for:
• User authentication and onboarding
• AI-powered content generation
• Real-time collaboration features
• Project management and tracking
• Advanced analytics and reporting
• Mobile and responsive design
• Integration with third-party tools`;

            brdInput.value = researchContent;
            brdInput.focus();
        }
        
        hideStoryGenerationProgress();
        alert('🚀 Research insights transferred to User Stories section! Ready to generate project.');
    }, 3000);
}

function showStoryGenerationProgress() {
    // Create progress modal
    const progressModal = document.createElement('div');
    progressModal.id = 'story-progress-modal';
    progressModal.className = 'modal-overlay';
    progressModal.style.display = 'flex';
    progressModal.innerHTML = `
        <div class="modal-content" style="max-width: 500px; text-align: center;">
            <h3>🚀 Generating User Stories</h3>
            <p>Converting research insights into actionable user stories...</p>
            
            <div class="progress-container" style="margin: 2rem 0;">
                <div class="progress-bar" style="width: 100%; height: 8px; background: #334155; border-radius: 4px; overflow: hidden;">
                    <div class="progress-fill" style="height: 100%; background: linear-gradient(90deg, #6366f1, #8b5cf6); width: 0%; transition: width 0.3s ease;"></div>
                </div>
                <div class="progress-text" style="margin-top: 1rem; color: #64748b;">Initializing...</div>
            </div>
            
            <div class="progress-steps" style="text-align: left; margin: 1.5rem 0;">
                <div class="step-item" style="padding: 0.5rem 0; color: #64748b;">
                    <span class="step-icon">⏳</span> Analyzing research data...
                </div>
                <div class="step-item" style="padding: 0.5rem 0; color: #64748b;">
                    <span class="step-icon">⏳</span> Extracting key requirements...
                </div>
                <div class="step-item" style="padding: 0.5rem 0; color: #64748b;">
                    <span class="step-icon">⏳</span> Generating user stories...
                </div>
                <div class="step-item" style="padding: 0.5rem 0; color: #64748b;">
                    <span class="step-icon">⏳</span> Preparing project board...
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(progressModal);
    
    // Animate progress
    let progress = 0;
    const progressFill = progressModal.querySelector('.progress-fill');
    const progressText = progressModal.querySelector('.progress-text');
    const steps = progressModal.querySelectorAll('.step-item');
    
    const progressSteps = [
        { progress: 25, text: 'Analyzing research data...', step: 0 },
        { progress: 50, text: 'Extracting key requirements...', step: 1 },
        { progress: 75, text: 'Generating user stories...', step: 2 },
        { progress: 100, text: 'Preparing project board...', step: 3 }
    ];
    
    let currentStep = 0;
    const progressInterval = setInterval(() => {
        if (currentStep < progressSteps.length) {
            const step = progressSteps[currentStep];
            progressFill.style.width = step.progress + '%';
            progressText.textContent = step.text;
            
            // Update step status
            if (step.step > 0) {
                steps[step.step - 1].innerHTML = '<span class="step-icon">✅</span> ' + steps[step.step - 1].textContent.replace('⏳', '').trim();
                steps[step.step - 1].style.color = '#22c55e';
            }
            
            currentStep++;
        } else {
            clearInterval(progressInterval);
            progressText.textContent = 'Complete! Redirecting...';
            steps[3].innerHTML = '<span class="step-icon">✅</span> ' + steps[3].textContent.replace('⏳', '').trim();
            steps[3].style.color = '#22c55e';
        }
    }, 750);
}

function hideStoryGenerationProgress() {
    const progressModal = document.getElementById('story-progress-modal');
    if (progressModal) {
        progressModal.remove();
    }
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Export PDF button
    document.addEventListener('click', function(e) {
        if (e.target.id === 'export-pdf-button' || e.target.closest('#export-pdf-button')) {
            e.preventDefault();
            exportResearchToPDF();
        }
        
        if (e.target.id === 'create-brd-from-research' || e.target.closest('#create-brd-from-research')) {
            e.preventDefault();
            generateStoriesFromResearch();
        }
    });
});