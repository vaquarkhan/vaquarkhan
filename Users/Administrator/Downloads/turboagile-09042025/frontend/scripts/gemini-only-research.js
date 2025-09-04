// Pure Gemini API research generator with progress bar
async function generateResearchReport(ideaText) {
    console.log('🚀 Starting Gemini-only research generation');
    
    const modal = document.getElementById('idea-research-modal');
    if (!modal) {
        alert('Research modal not found');
        return;
    }
    
    modal.className = 'modal-overlay research-modal';
    
    // Show progress modal
    showResearchProgress();
    
    try {
        const apiKey = 'AIzaSyArfVWFuo0eX2nAYyM7HFRS366XBK2OhGY';
        
        if (!apiKey || apiKey === 'your_api_key_here') {
            throw new Error('Please set your Gemini API key in .env.local file');
        }

        // Generate all sections with Gemini
        await generateAllSectionsWithGemini(ideaText, apiKey);
        
    } catch (error) {
        console.error('❌ Research generation failed:', error);
        hideResearchProgress();
        showResearchError(error.message);
    }
}

async function generateAllSectionsWithGemini(ideaText, apiKey) {
    const sections = [
        { id: 'executive-summary', name: 'Executive Summary', prompt: `Create executive summary for business idea: "${ideaText}". Include market opportunity, value proposition, and strategic positioning. Format as HTML.` },
        { id: 'project-objectives', name: 'SMART Objectives', prompt: `Create 5 SMART objectives for: "${ideaText}". Format as HTML with specific, measurable goals.` },
        { id: 'stakeholders', name: 'Stakeholder Analysis', prompt: `Identify key stakeholders for: "${ideaText}". Include roles, interests, and influence levels. Format as HTML.` },
        { id: 'business-requirements', name: 'Business Requirements', prompt: `Define business requirements for: "${ideaText}". Include metrics, KPIs, and success criteria. Format as HTML.` },
        { id: 'functional-requirements', name: 'Functional Requirements', prompt: `List functional requirements for: "${ideaText}". Include system features and capabilities. Format as HTML.` },
        { id: 'assumptions-constraints', name: 'Assumptions & Constraints', prompt: `Identify assumptions and constraints for: "${ideaText}". Include technical, budget, and timeline factors. Format as HTML.` },
        { id: 'risks-mitigation', name: 'Risk Analysis', prompt: `Analyze risks and mitigation strategies for: "${ideaText}". Include probability, impact, and solutions. Format as HTML.` },
        { id: 'competitor-analysis', name: 'Competitor Analysis', prompt: `Analyze top 3 competitors for: "${ideaText}". Include market share, features, and ratings. Format as HTML.` },
        { id: 'feature-comparison', name: 'Feature Comparison', prompt: `Create feature comparison matrix for: "${ideaText}" vs competitors. Show competitive advantages. Format as HTML table.` },
        { id: 'ai-features', name: 'AI Features', prompt: `Design 3 AI game-changing features for: "${ideaText}". Include impact metrics and strategic advantages. Format as HTML.` },
        { id: 'detailed-specifications', name: 'Technical Specs', prompt: `Create technical specifications for: "${ideaText}". Include architecture, tech stack, and infrastructure. Format as HTML.` },
        { id: 'software-requirements', name: 'Software Requirements', prompt: `Write software requirements specification for: "${ideaText}". Include functional and non-functional requirements. Format as HTML.` },
        { id: 'user-stories-detailed', name: 'User Stories', prompt: `Generate user stories with acceptance criteria for: "${ideaText}". Include story points and epics. Format as HTML.` },
        { id: 'cost-benefit-analysis', name: 'Cost-Benefit Analysis', prompt: `Create cost-benefit analysis for: "${ideaText}". Include ROI projections and financial metrics. Format as HTML.` },
        { id: 'schedule-deliverables', name: 'Project Timeline', prompt: `Create project timeline and deliverables for: "${ideaText}". Include phases, milestones, and deadlines. Format as HTML.` }
    ];
    
    let completed = 0;
    const total = sections.length;
    
    for (const section of sections) {
        try {
            updateProgress(completed, total, `Generating ${section.name}...`);
            
            const content = await callGeminiAPI(section.prompt, apiKey);
            
            const element = document.getElementById(section.id);
            if (element) {
                element.innerHTML = content || `<p>Failed to generate ${section.name}. Please try again.</p>`;
            }
            
            completed++;
            updateProgress(completed, total, `✅ ${section.name} completed`);
            
            // Small delay to show progress
            await new Promise(resolve => setTimeout(resolve, 500));
            
        } catch (error) {
            console.error(`❌ Failed to generate ${section.name}:`, error);
            const element = document.getElementById(section.id);
            if (element) {
                element.innerHTML = `<p style="color: #ef4444;">❌ Failed to generate ${section.name}: ${error.message}</p>`;
            }
            completed++;
        }
    }
    
    updateProgress(total, total, '🎉 Research report completed!');
    
    setTimeout(() => {
        hideResearchProgress();
    }, 2000);
}

async function callGeminiAPI(prompt, apiKey) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
        })
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    
    if (data.candidates && data.candidates[0]) {
        return data.candidates[0].content.parts[0].text;
    }
    
    throw new Error('No content generated');
}

function showResearchProgress() {
    const progressModal = document.createElement('div');
    progressModal.id = 'research-progress-modal';
    progressModal.className = 'modal-overlay';
    progressModal.style.display = 'flex';
    progressModal.innerHTML = `
        <div class="modal-content" style="max-width: 600px; text-align: center;">
            <h3>🤖 Generating Research Report with Gemini AI</h3>
            <p>Creating comprehensive business analysis...</p>
            
            <div class="progress-container" style="margin: 2rem 0;">
                <div class="progress-bar" style="width: 100%; height: 12px; background: #334155; border-radius: 6px; overflow: hidden;">
                    <div class="progress-fill" style="height: 100%; background: linear-gradient(90deg, #6366f1, #8b5cf6); width: 0%; transition: width 0.5s ease;"></div>
                </div>
                <div class="progress-text" style="margin-top: 1rem; color: #64748b; font-size: 0.9rem;">Initializing Gemini API...</div>
                <div class="progress-percentage" style="margin-top: 0.5rem; font-weight: 600; color: #6366f1;">0%</div>
            </div>
            
            <div class="progress-steps" style="text-align: left; margin: 1.5rem 0; max-height: 200px; overflow-y: auto;">
                <div class="step-log" style="font-family: monospace; font-size: 0.8rem; color: #64748b;"></div>
            </div>
        </div>
    `;
    
    document.body.appendChild(progressModal);
}

function updateProgress(completed, total, message) {
    const progressModal = document.getElementById('research-progress-modal');
    if (!progressModal) return;
    
    const percentage = Math.round((completed / total) * 100);
    const progressFill = progressModal.querySelector('.progress-fill');
    const progressText = progressModal.querySelector('.progress-text');
    const progressPercentage = progressModal.querySelector('.progress-percentage');
    const stepLog = progressModal.querySelector('.step-log');
    
    if (progressFill) progressFill.style.width = percentage + '%';
    if (progressText) progressText.textContent = message;
    if (progressPercentage) progressPercentage.textContent = percentage + '%';
    if (stepLog) {
        stepLog.innerHTML += `<div>${new Date().toLocaleTimeString()}: ${message}</div>`;
        stepLog.scrollTop = stepLog.scrollHeight;
    }
}

function hideResearchProgress() {
    const progressModal = document.getElementById('research-progress-modal');
    if (progressModal) {
        progressModal.remove();
    }
}

function showResearchError(errorMessage) {
    const sections = [
        'executive-summary', 'project-objectives', 'stakeholders', 'business-requirements',
        'functional-requirements', 'assumptions-constraints', 'risks-mitigation',
        'competitor-analysis', 'feature-comparison', 'ai-features', 'detailed-specifications',
        'software-requirements', 'user-stories-detailed', 'cost-benefit-analysis', 'schedule-deliverables'
    ];
    
    sections.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (element && sectionId !== 'project-scope') {
            element.innerHTML = `<p style="color: #ef4444;">❌ Research generation failed: ${errorMessage}<br>Please check your Gemini API key and try again.</p>`;
        }
    });
}