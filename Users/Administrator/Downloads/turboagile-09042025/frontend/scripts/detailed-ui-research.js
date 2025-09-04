// Detailed UI with Gemini API content generation
async function generateResearchReport(ideaText) {
    console.log('🚀 Starting detailed research generation');
    
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
        
        // Generate all sections with detailed UI
        await generateDetailedSections(ideaText, apiKey);
        
    } catch (error) {
        console.error('❌ Research generation failed:', error);
        hideResearchProgress();
        showResearchError(error.message);
    }
}

async function generateDetailedSections(ideaText, apiKey) {
    updateProgress(10, 100, 'Generating Executive Summary...');
    
    // Executive Summary with detailed UI
    const executiveSummary = await callGeminiAPI(`Create detailed executive summary for "${ideaText}" with market analysis, value propositions, and strategic positioning. Include specific metrics and competitive advantages.`, apiKey);
    document.getElementById('executive-summary').innerHTML = `
        <div class="research-highlight">
            <h4>Project Vision & Market Opportunity</h4>
            ${formatContent(executiveSummary)}
        </div>
    `;
    
    updateProgress(20, 100, 'Generating SMART Objectives...');
    
    // SMART Objectives with visual cards
    const objectives = await callGeminiAPI(`Create 5 SMART objectives for "${ideaText}" with specific metrics and timelines.`, apiKey);
    document.getElementById('project-objectives').innerHTML = `
        <div class="smart-goals">
            <div class="smart-goal">
                <div class="smart-letter">S</div>
                <div class="smart-word">Specific</div>
                <div class="smart-description">${objectives.split('.')[0] || 'Launch MVP with core features'}</div>
            </div>
            <div class="smart-goal">
                <div class="smart-letter">M</div>
                <div class="smart-word">Measurable</div>
                <div class="smart-description">${objectives.split('.')[1] || 'Achieve measurable user adoption'}</div>
            </div>
            <div class="smart-goal">
                <div class="smart-letter">A</div>
                <div class="smart-word">Achievable</div>
                <div class="smart-description">${objectives.split('.')[2] || 'Leverage proven technologies'}</div>
            </div>
            <div class="smart-goal">
                <div class="smart-letter">R</div>
                <div class="smart-word">Relevant</div>
                <div class="smart-description">${objectives.split('.')[3] || 'Address market pain points'}</div>
            </div>
            <div class="smart-goal">
                <div class="smart-letter">T</div>
                <div class="smart-word">Time-bound</div>
                <div class="smart-description">${objectives.split('.')[4] || 'Deliver within timeline'}</div>
            </div>
        </div>
    `;
    
    updateProgress(30, 100, 'Analyzing Stakeholders...');
    
    // Stakeholder Analysis with cards
    const stakeholders = await callGeminiAPI(`Identify key stakeholders for "${ideaText}" with roles, interests, and influence levels.`, apiKey);
    document.getElementById('stakeholders').innerHTML = `
        <div class="stakeholder-analysis">
            <h5>Primary Stakeholders:</h5>
            <div class="stakeholder-grid">
                <div class="stakeholder-card">
                    <h6>👥 End Users</h6>
                    ${formatContent(stakeholders.substring(0, 200))}
                </div>
                <div class="stakeholder-card">
                    <h6>💼 Business Executives</h6>
                    ${formatContent(stakeholders.substring(200, 400))}
                </div>
                <div class="stakeholder-card">
                    <h6>👨💻 Development Team</h6>
                    ${formatContent(stakeholders.substring(400, 600))}
                </div>
                <div class="stakeholder-card">
                    <h6>📊 Product Managers</h6>
                    ${formatContent(stakeholders.substring(600, 800))}
                </div>
            </div>
        </div>
    `;
    
    updateProgress(40, 100, 'Defining Business Requirements...');
    
    // Business Requirements with grid
    const businessReqs = await callGeminiAPI(`Define business requirements for "${ideaText}" with KPIs, metrics, and success criteria.`, apiKey);
    document.getElementById('business-requirements').innerHTML = `
        <div class="business-requirements-detailed">
            <h5>Core Business Capabilities:</h5>
            <div class="requirements-grid">
                <div class="requirement-category">
                    <h6>🎯 User Engagement</h6>
                    ${formatContent(businessReqs.substring(0, 300))}
                </div>
                <div class="requirement-category">
                    <h6>💰 Revenue Generation</h6>
                    ${formatContent(businessReqs.substring(300, 600))}
                </div>
                <div class="requirement-category">
                    <h6>🚀 Scalability</h6>
                    ${formatContent(businessReqs.substring(600, 900))}
                </div>
                <div class="requirement-category">
                    <h6>🔒 Security & Compliance</h6>
                    ${formatContent(businessReqs.substring(900, 1200))}
                </div>
            </div>
        </div>
    `;
    
    updateProgress(50, 100, 'Creating Functional Requirements...');
    
    // Functional Requirements
    const functionalReqs = await callGeminiAPI(`List functional requirements for "${ideaText}" with system features and capabilities.`, apiKey);
    document.getElementById('functional-requirements').innerHTML = `
        <div class="functional-requirements-detailed">
            <h5>System Functionality:</h5>
            <div class="functional-categories">
                <div class="func-category">
                    <h6>🤖 AI-Powered Features</h6>
                    ${formatContent(functionalReqs.substring(0, 400))}
                </div>
                <div class="func-category">
                    <h6>👥 Collaboration Tools</h6>
                    ${formatContent(functionalReqs.substring(400, 800))}
                </div>
            </div>
        </div>
    `;
    
    updateProgress(60, 100, 'Analyzing Competitors...');
    
    // Competitor Analysis with cards
    const competitors = await callGeminiAPI(`Analyze top 3 competitors for "${ideaText}" with market share, features, and ratings.`, apiKey);
    document.getElementById('competitor-analysis').innerHTML = `
        <div class="competitor-grid">
            <div class="competitor-card">
                <div class="competitor-header">
                    <div class="competitor-logo">C1</div>
                    <div class="competitor-info">
                        <h4>Competitor 1</h4>
                        <div class="market-share">Market Analysis</div>
                    </div>
                </div>
                <div class="competitor-features">
                    ${formatContent(competitors.substring(0, 200))}
                </div>
                <div class="competitor-rating">
                    <div class="rating-stars">★★★★☆</div>
                    <div class="rating-score">4.0/5</div>
                </div>
            </div>
            <div class="competitor-card">
                <div class="competitor-header">
                    <div class="competitor-logo">C2</div>
                    <div class="competitor-info">
                        <h4>Competitor 2</h4>
                        <div class="market-share">Market Analysis</div>
                    </div>
                </div>
                <div class="competitor-features">
                    ${formatContent(competitors.substring(200, 400))}
                </div>
                <div class="competitor-rating">
                    <div class="rating-stars">★★★★☆</div>
                    <div class="rating-score">4.0/5</div>
                </div>
            </div>
        </div>
    `;
    
    updateProgress(70, 100, 'Creating Feature Comparison...');
    
    // Feature Comparison Matrix
    const featureMatrix = await callGeminiAPI(`Create feature comparison matrix for "${ideaText}" vs competitors showing competitive advantages.`, apiKey);
    document.getElementById('feature-comparison').innerHTML = `
        <div class="feature-comparison-table">
            <div class="comparison-header">Feature Comparison Matrix</div>
            ${formatContent(featureMatrix)}
        </div>
    `;
    
    updateProgress(80, 100, 'Designing AI Features...');
    
    // AI Game-Changing Features
    const aiFeatures = await callGeminiAPI(`Design 3 AI game-changing features for "${ideaText}" with impact metrics and strategic advantages.`, apiKey);
    document.getElementById('ai-features').innerHTML = `
        <div class="ai-features-grid">
            <div class="ai-feature-card">
                <div class="ai-feature-header">
                    <div class="ai-feature-icon">🤖</div>
                    <div class="ai-feature-info">
                        <h4>AI Innovation</h4>
                        <div class="innovation-level">Game Changer</div>
                    </div>
                </div>
                <div class="ai-feature-description">
                    ${formatContent(aiFeatures.substring(0, 300))}
                </div>
                <div class="ai-feature-benefits">
                    <h5>Game-Changing Advantage:</h5>
                    ${formatContent(aiFeatures.substring(300, 600))}
                </div>
                <div class="ai-feature-impact">
                    <div class="impact-label">Impact</div>
                    <div class="impact-value">+300%</div>
                </div>
            </div>
        </div>
    `;
    
    updateProgress(90, 100, 'Finalizing remaining sections...');
    
    // Generate remaining sections quickly
    const remainingSections = [
        { id: 'assumptions-constraints', prompt: `Identify assumptions and constraints for "${ideaText}".` },
        { id: 'risks-mitigation', prompt: `Analyze risks and mitigation for "${ideaText}".` },
        { id: 'detailed-specifications', prompt: `Create technical specifications for "${ideaText}".` },
        { id: 'software-requirements', prompt: `Write software requirements for "${ideaText}".` },
        { id: 'user-stories-detailed', prompt: `Generate user stories for "${ideaText}".` },
        { id: 'cost-benefit-analysis', prompt: `Create cost-benefit analysis for "${ideaText}".` },
        { id: 'schedule-deliverables', prompt: `Create project timeline for "${ideaText}".` }
    ];
    
    for (const section of remainingSections) {
        const content = await callGeminiAPI(section.prompt, apiKey);
        const element = document.getElementById(section.id);
        if (element) {
            element.innerHTML = formatContent(content);
        }
    }
    
    updateProgress(100, 100, '🎉 Research report completed!');
    
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
        <div class="modal-content" style="max-width: 500px; text-align: center;">
            <h3>🤖 Generating Detailed Research Report</h3>
            <p>Creating comprehensive analysis with beautiful UI...</p>
            
            <div class="progress-container" style="margin: 2rem 0;">
                <div class="progress-bar" style="width: 100%; height: 8px; background: #334155; border-radius: 4px; overflow: hidden;">
                    <div class="progress-fill" style="height: 100%; background: linear-gradient(90deg, #6366f1, #8b5cf6); width: 0%; transition: width 0.3s ease;"></div>
                </div>
                <div class="progress-text" style="margin-top: 1rem; color: #64748b;">Initializing...</div>
                <div class="progress-percentage" style="margin-top: 0.5rem; font-weight: 600; color: #6366f1;">0%</div>
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
    
    if (progressFill) progressFill.style.width = percentage + '%';
    if (progressText) progressText.textContent = message;
    if (progressPercentage) progressPercentage.textContent = percentage + '%';
}

function hideResearchProgress() {
    const progressModal = document.getElementById('research-progress-modal');
    if (progressModal) {
        progressModal.remove();
    }
}

function formatContent(content) {
    if (!content) return '<p>No content available</p>';
    
    // Clean and format the content
    let formatted = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
        .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic text
        .replace(/#{1,6}\s*(.*?)\n/g, '<h4>$1</h4>') // Headers
        .replace(/^\d+\.\s*(.*?)$/gm, '<h5>$1</h5>') // Numbered headers
        .replace(/^-\s*(.*?)$/gm, '<li>$1</li>') // List items
        .replace(/^\*\s*(.*?)$/gm, '<li>$1</li>') // Bullet points
        .replace(/\n\n/g, '</p><p>') // Paragraph breaks
        .replace(/\n/g, '<br>'); // Line breaks
    
    // Wrap in paragraphs and handle lists
    formatted = '<p>' + formatted + '</p>';
    
    // Fix list formatting
    formatted = formatted
        .replace(/<p>(<li>.*?<\/li>)<\/p>/g, '<ul>$1</ul>')
        .replace(/<\/li><br><li>/g, '</li><li>')
        .replace(/<p><\/p>/g, '')
        .replace(/<p><h/g, '<h')
        .replace(/<\/h([1-6])><\/p>/g, '</h$1>');
    
    return formatted;
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
            element.innerHTML = `<p style="color: #ef4444;">❌ Failed to generate content: ${errorMessage}</p>`;
        }
    });
}