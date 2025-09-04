// Research functionality extracted from index.html
async function generateResearchReport(ideaText) {
    showProcessingOverlay();
    
    try {
        const aiService = new AIResearchService();
        updateProgress(10, 'Initializing Gemini Deep Research...');
        
        const existingResearch = checkExistingResearch(ideaText);
        if (existingResearch) {
            updateProgress(50, 'Loading existing research...');
            displayExistingResearch(existingResearch);
            updateProgress(100, 'Research Loaded!');
            setTimeout(() => {
                hideProcessingOverlay();
                setupModalEventListeners();
            }, 1000);
            return;
        }
        
        updateProgress(20, 'Conducting comprehensive deep research analysis...');
        const researchData = await aiService.generateDeepResearch(ideaText);
        
        updateProgress(60, 'Processing research results...');
        
        const sections = [
            { id: 'executive-summary', name: 'Executive Summary', data: researchData.executiveSummary },
            { id: 'market-research', name: 'Market Research', data: researchData.marketResearch },
            { id: 'technical-specs', name: 'Technical Specifications', data: researchData.technicalSpecs },
            { id: 'business-requirements', name: 'Business Requirements', data: researchData.businessRequirements },
            { id: 'user-personas', name: 'User Personas', data: researchData.userPersonas },
            { id: 'feature-roadmap', name: 'Feature Roadmap', data: researchData.featureRoadmap },
            { id: 'risk-assessment', name: 'Risk Assessment', data: researchData.riskAssessment },
            { id: 'financial-projections', name: 'Financial Projections', data: researchData.financialProjections },
            { id: 'implementation-timeline', name: 'Implementation Timeline', data: researchData.implementationTimeline },
            { id: 'competitive-analysis', name: 'Competitive Analysis', data: researchData.competitiveAnalysis },
            { id: 'ai-recommendations', name: 'AI Recommendations', data: researchData.aiRecommendations },
            { id: 'conclusion', name: 'Conclusion', data: researchData.conclusion }
        ];
        
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            updateProgress(70 + (i / sections.length) * 25, `Formatting ${section.name}...`);
            populateReportSection(section.id, section.data);
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        saveResearchData(ideaText, researchData);
        updateProgress(100, 'Deep Research Complete!');
        
        setTimeout(() => {
            hideProcessingOverlay();
            saveResearchToHistory(ideaText, Date.now().toString());
            setupModalEventListeners();
        }, 1000);
        
    } catch (error) {
        console.error('Research generation error:', error);
        updateProgress(100, 'Error generating research. Please try again.');
        setTimeout(hideProcessingOverlay, 2000);
    }
}

function checkExistingResearch(ideaText) {
    const researchKey = 'research_' + btoa(ideaText.substring(0, 100)).replace(/[^a-zA-Z0-9]/g, '');
    const saved = localStorage.getItem(researchKey);
    return saved ? JSON.parse(saved) : null;
}

function saveResearchData(ideaText, researchData) {
    const researchKey = 'research_' + btoa(ideaText.substring(0, 100)).replace(/[^a-zA-Z0-9]/g, '');
    const dataToSave = {
        timestamp: Date.now(),
        idea: ideaText,
        research: researchData
    };
    localStorage.setItem(researchKey, JSON.stringify(dataToSave));
}

function displayExistingResearch(existingData) {
    const sections = [
        { id: 'executive-summary', data: existingData.research.executiveSummary },
        { id: 'market-research', data: existingData.research.marketResearch },
        { id: 'technical-specs', data: existingData.research.technicalSpecs },
        { id: 'business-requirements', data: existingData.research.businessRequirements },
        { id: 'user-personas', data: existingData.research.userPersonas },
        { id: 'feature-roadmap', data: existingData.research.featureRoadmap },
        { id: 'risk-assessment', data: existingData.research.riskAssessment },
        { id: 'financial-projections', data: existingData.research.financialProjections },
        { id: 'implementation-timeline', data: existingData.research.implementationTimeline },
        { id: 'competitive-analysis', data: existingData.research.competitiveAnalysis },
        { id: 'ai-recommendations', data: existingData.research.aiRecommendations },
        { id: 'conclusion', data: existingData.research.conclusion }
    ];
    
    sections.forEach(section => {
        populateReportSection(section.id, section.data);
    });
}

function populateReportSection(sectionId, data) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    if (typeof data === 'string') {
        section.innerHTML = `<div class="report-text">${formatGeminiContent(data)}</div>`;
    } else {
        section.innerHTML = formatSectionContent(data);
    }
}

function formatGeminiContent(content) {
    let formatted = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/^/, '<p>')
        .replace(/$/, '</p>');
    
    formatted = '<div class="research-report">' + formatted + '</div>';
    return formatted;
}

function formatSectionContent(data) {
    if (typeof data === 'object') {
        return Object.keys(data).map(key => {
            const value = data[key];
            const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            
            if (typeof value === 'object' && Array.isArray(value)) {
                return `
                    <div class="report-subsection">
                        <h4 class="subsection-title">${formattedKey}</h4>
                        <ul class="report-list">
                            ${value.map(item => `<li class="report-list-item">${item}</li>`).join('')}
                        </ul>
                    </div>
                `;
            } else {
                return `
                    <div class="report-field">
                        <span class="field-label">${formattedKey}:</span>
                        <span class="field-value">${value}</span>
                    </div>
                `;
            }
        }).join('');
    }
    return `<div class="report-text">${data}</div>`;
}

function showProcessingOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'research-processing-overlay';
    overlay.innerHTML = `
        <div class="processing-content">
            <div class="processing-header">
                <h3>Generating AI Research Report</h3>
                <p>Please wait while our AI analyzes your idea and generates comprehensive specifications...</p>
            </div>
            <div class="progress-container">
                <div class="progress-bar">
                    <div class="progress-fill" id="progress-fill"></div>
                </div>
                <div class="progress-text" id="progress-text">Initializing...</div>
            </div>
            <div class="processing-animation">
                <div class="spinner"></div>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
}

function updateProgress(percentage, message) {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    if (progressFill) {
        progressFill.style.width = percentage + '%';
    }
    if (progressText) {
        progressText.textContent = message;
    }
}

function hideProcessingOverlay() {
    const overlay = document.getElementById('research-processing-overlay');
    if (overlay) {
        overlay.remove();
    }
}

function saveResearchToHistory(ideaText, reportId) {
    const history = JSON.parse(localStorage.getItem('researchHistory') || '[]');
    const newReport = {
        id: reportId,
        title: ideaText.substring(0, 60) + (ideaText.length > 60 ? '...' : ''),
        date: new Date().toLocaleDateString(),
        timestamp: Date.now()
    };
    
    history.unshift(newReport);
    if (history.length > 10) history.pop();
    
    localStorage.setItem('researchHistory', JSON.stringify(history));
    updateResearchHistory();
}

function updateResearchHistory() {
    const history = JSON.parse(localStorage.getItem('researchHistory') || '[]');
    const historySection = document.getElementById('research-history');
    const historyList = document.getElementById('research-history-list');
    
    if (history.length > 0) {
        historySection.style.display = 'block';
        historyList.innerHTML = history.map(report => `
            <div class="history-item" onclick="loadPreviousResearch('${report.id}')">
                <div class="history-content">
                    <div class="history-title">${report.title}</div>
                    <div class="history-date">${report.date}</div>
                </div>
                <button class="delete-research-btn" onclick="deleteResearch('${report.id}', event)" title="Delete Research">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3,6 5,6 21,6"></polyline>
                        <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                </button>
            </div>
        `).join('');
    } else {
        historySection.style.display = 'none';
    }
}

function setupModalEventListeners() {
    // Event delegation for modal buttons
}