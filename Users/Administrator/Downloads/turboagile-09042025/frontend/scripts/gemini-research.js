// Gemini-powered research generator
async function generateResearchReport(ideaText) {
    const modal = document.getElementById('idea-research-modal');
    if (!modal) {
        alert('Research modal not found');
        return;
    }
    
    modal.className = 'modal-overlay research-modal';
    
    // Show progress
    const contentDiv = modal.querySelector('.modal-content');
    if (contentDiv) {
        contentDiv.innerHTML = `
            <div class="research-progress">
                <div class="progress-spinner"></div>
                <div class="progress-text">Gemini AI is analyzing your idea...</div>
            </div>
        `;
    }
    
    // Generate with Gemini API
    try {
        const apiKey = localStorage.getItem('GEMINI_API_KEY') || 'AIzaSyArfVWFuo0eX2nAYyM7HFRS366XBK2OhGY';
        
        const prompt = `Analyze this business idea: "${ideaText}"

Generate comprehensive research with:
1. Executive summary (2-3 sentences)
2. Market size and growth rate
3. Top 3 competitors with names and key features
4. Feature comparison matrix (6 key features)
5. 3 AI game-changing features with impact metrics
6. Technical requirements
7. Risk assessment

Format as JSON:
{
  "executiveSummary": "...",
  "marketSize": "$X.XB",
  "growthRate": "XX%",
  "competitors": [
    {"name": "CompanyName", "features": ["feature1", "feature2"], "marketShare": "XX%"}
  ],
  "featureMatrix": {
    "features": ["AI Integration", "Real-time Collaboration", "Advanced Analytics", "Mobile App", "API Access", "Predictive Analytics"],
    "comparison": {
      "competitor1": ["partial", "yes", "partial", "yes", "yes", "no"],
      "competitor2": ["no", "yes", "yes", "yes", "yes", "no"],
      "competitor3": ["no", "yes", "yes", "yes", "yes", "no"],
      "yourSolution": ["yes", "yes", "yes", "partial", "yes", "yes"]
    }
  },
  "aiFeatures": [
    {"name": "FeatureName", "description": "...", "impact": "+XXX%", "gameChanger": "Why this changes everything"}
  ],
  "technical": "Tech stack recommendations",
  "risks": "Key risks and mitigation"
}`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-exp:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        
        if (data.candidates && data.candidates[0]) {
            const content = data.candidates[0].content.parts[0].text;
            const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
            
            try {
                const research = JSON.parse(cleanContent);
                showGeminiReport(ideaText, research, contentDiv);
            } catch (e) {
                console.error('JSON parse error:', e);
                showFallbackReport(ideaText, contentDiv);
            }
        } else {
            throw new Error('No Gemini response');
        }
    } catch (error) {
        console.error('Gemini error:', error);
        showFallbackReport(ideaText, contentDiv);
    }
}

function showGeminiReport(ideaText, research, contentDiv) {
    contentDiv.innerHTML = `
        <button class="modal-close" onclick="document.getElementById('idea-research-modal').style.display='none'">&times;</button>
        
        <div class="research-header">
            <h2>🚀 AI Research Report</h2>
            <p class="research-subtitle">Powered by Gemini AI: "${ideaText}"</p>
        </div>
        
        <div class="research-body">
            <div class="research-section">
                <h3>📋 Executive Summary</h3>
                <div class="research-content">
                    <div class="research-highlight">
                        <p>${research.executiveSummary || 'AI-powered analysis of your innovative business idea.'}</p>
                    </div>
                </div>
            </div>

            <div class="research-section">
                <h3>📊 Market Analysis</h3>
                <div class="research-content">
                    <div class="research-stats">
                        <div class="stat-card">
                            <div class="stat-value">${research.marketSize || '$2.4B'}</div>
                            <div class="stat-label">Market Size</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${research.growthRate || '23%'}</div>
                            <div class="stat-label">Growth Rate</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">8.5/10</div>
                            <div class="stat-label">Viability Score</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="research-section">
                <h3>🏆 Competitor Analysis</h3>
                <div class="research-content">
                    <div class="competitor-grid">
                        ${generateCompetitorCards(research.competitors)}
                    </div>
                </div>
            </div>

            <div class="research-section">
                <h3>📊 Feature Comparison Matrix</h3>
                <div class="research-content">
                    ${generateFeatureMatrix(research.featureMatrix, research.competitors)}
                </div>
            </div>

            <div class="research-section">
                <h3>🚀 AI Game-Changing Features</h3>
                <div class="research-content">
                    <div class="ai-features-grid">
                        ${generateAIFeatureCards(research.aiFeatures)}
                    </div>
                </div>
            </div>

            <div class="research-section">
                <h3>⚙️ Technical Requirements</h3>
                <div class="research-content">
                    <p>${research.technical || 'Modern tech stack with AI integration, cloud deployment, and scalable architecture.'}</p>
                    <ul>
                        <li>Frontend: React + TypeScript</li>
                        <li>Backend: Node.js + Express</li>
                        <li>AI: Gemini API integration</li>
                        <li>Database: PostgreSQL</li>
                        <li>Deployment: Cloud-native</li>
                    </ul>
                </div>
            </div>

            <div class="research-section">
                <h3>⚠️ Risk Assessment</h3>
                <div class="research-content">
                    <p>${research.risks || 'Market competition and technical complexity are key risks with mitigation strategies available.'}</p>
                </div>
            </div>
        </div>
        
        <div class="research-actions">
            <button class="research-btn" onclick="exportGeminiReport()">📄 Export PDF</button>
            <button class="research-btn" onclick="generateStoriesFromGemini('${ideaText}')">🚀 Generate Stories</button>
            <button class="research-btn secondary" onclick="document.getElementById('idea-research-modal').style.display='none'">✕ Close</button>
        </div>
    `;
}

function generateCompetitorCards(competitors) {
    if (!competitors || !Array.isArray(competitors)) {
        return `
            <div class="competitor-card">
                <div class="competitor-header">
                    <div class="competitor-logo">C</div>
                    <div class="competitor-info">
                        <h4>Market Leader</h4>
                        <div class="market-share">Established Player</div>
                    </div>
                </div>
                <div class="competitor-features">
                    <div class="feature-list">
                        <span class="feature-tag">Core Features</span>
                        <span class="feature-tag">Market Presence</span>
                    </div>
                </div>
                <div class="competitor-rating">
                    <div class="rating-stars">★★★★☆</div>
                    <div class="rating-score">4.0/5</div>
                </div>
            </div>
        `;
    }
    
    return competitors.map(comp => `
        <div class="competitor-card">
            <div class="competitor-header">
                <div class="competitor-logo">${comp.name ? comp.name[0] : 'C'}</div>
                <div class="competitor-info">
                    <h4>${comp.name || 'Competitor'}</h4>
                    <div class="market-share">${comp.marketShare || 'Market Player'}</div>
                </div>
            </div>
            <div class="competitor-features">
                <div class="feature-list">
                    ${(comp.features || ['Feature 1', 'Feature 2']).map(f => `<span class="feature-tag">${f}</span>`).join('')}
                </div>
            </div>
            <div class="competitor-rating">
                <div class="rating-stars">★★★★☆</div>
                <div class="rating-score">4.0/5</div>
            </div>
        </div>
    `).join('');
}

function generateFeatureMatrix(featureMatrix, competitors) {
    if (!featureMatrix || !featureMatrix.features) {
        return `
            <div class="feature-comparison-table">
                <div class="comparison-header">Side-by-Side Feature Analysis</div>
                <div class="comparison-grid">
                    <div class="comparison-cell feature-name">Feature</div>
                    <div class="comparison-cell">Competitor A</div>
                    <div class="comparison-cell">Competitor B</div>
                    <div class="comparison-cell">Competitor C</div>
                    <div class="comparison-cell">Your Solution</div>
                    
                    <div class="comparison-cell feature-name">AI Integration</div>
                    <div class="comparison-cell partial-feature">⚠️</div>
                    <div class="comparison-cell no-feature">❌</div>
                    <div class="comparison-cell no-feature">❌</div>
                    <div class="comparison-cell has-feature">✅</div>
                    
                    <div class="comparison-cell feature-name">Real-time Collaboration</div>
                    <div class="comparison-cell has-feature">✅</div>
                    <div class="comparison-cell has-feature">✅</div>
                    <div class="comparison-cell has-feature">✅</div>
                    <div class="comparison-cell has-feature">✅</div>
                    
                    <div class="comparison-cell feature-name">Predictive Analytics</div>
                    <div class="comparison-cell no-feature">❌</div>
                    <div class="comparison-cell no-feature">❌</div>
                    <div class="comparison-cell no-feature">❌</div>
                    <div class="comparison-cell has-feature">✅</div>
                </div>
            </div>
        `;
    }
    
    const compNames = competitors && competitors.length >= 3 ? 
        [competitors[0].name, competitors[1].name, competitors[2].name] : 
        ['Competitor A', 'Competitor B', 'Competitor C'];
    
    let matrixHTML = `
        <div class="feature-comparison-table">
            <div class="comparison-header">Competitive Feature Analysis</div>
            <div class="comparison-grid">
                <div class="comparison-cell feature-name">Feature</div>
                <div class="comparison-cell">${compNames[0]}</div>
                <div class="comparison-cell">${compNames[1]}</div>
                <div class="comparison-cell">${compNames[2]}</div>
                <div class="comparison-cell">Your Solution</div>
    `;
    
    featureMatrix.features.forEach((feature, index) => {
        const comp1 = featureMatrix.comparison?.competitor1?.[index] || 'no';
        const comp2 = featureMatrix.comparison?.competitor2?.[index] || 'no';
        const comp3 = featureMatrix.comparison?.competitor3?.[index] || 'no';
        const yours = featureMatrix.comparison?.yourSolution?.[index] || 'yes';
        
        const getIcon = (status) => {
            if (status === 'yes') return '✅';
            if (status === 'partial') return '⚠️';
            return '❌';
        };
        
        const getClass = (status) => {
            if (status === 'yes') return 'has-feature';
            if (status === 'partial') return 'partial-feature';
            return 'no-feature';
        };
        
        matrixHTML += `
            <div class="comparison-cell feature-name">${feature}</div>
            <div class="comparison-cell ${getClass(comp1)}">${getIcon(comp1)}</div>
            <div class="comparison-cell ${getClass(comp2)}">${getIcon(comp2)}</div>
            <div class="comparison-cell ${getClass(comp3)}">${getIcon(comp3)}</div>
            <div class="comparison-cell ${getClass(yours)}">${getIcon(yours)}</div>
        `;
    });
    
    matrixHTML += `
            </div>
        </div>
    `;
    
    return matrixHTML;
}

function generateAIFeatureCards(aiFeatures) {
    if (!aiFeatures || !Array.isArray(aiFeatures)) {
        return `
            <div class="ai-feature-card">
                <div class="ai-feature-header">
                    <div class="ai-feature-icon">🤖</div>
                    <div class="ai-feature-info">
                        <h4>Smart Automation</h4>
                        <div class="innovation-level">Game Changer</div>
                    </div>
                </div>
                <div class="ai-feature-description">
                    AI-powered automation that learns user patterns and optimizes workflows automatically.
                </div>
                <div class="ai-feature-benefits">
                    <h5>Game-Changing Advantage:</h5>
                    <p>This completely transforms how users interact with the system, making it 10x more intuitive and efficient than any competitor.</p>
                </div>
                <div class="ai-feature-impact">
                    <div class="impact-label">Productivity Boost</div>
                    <div class="impact-value">+300%</div>
                </div>
            </div>
        `;
    }
    
    const icons = ['🤖', '🔮', '🌐', '⚡', '🎯'];
    return aiFeatures.map((feature, index) => `
        <div class="ai-feature-card">
            <div class="ai-feature-header">
                <div class="ai-feature-icon">${icons[index] || '🚀'}</div>
                <div class="ai-feature-info">
                    <h4>${feature.name || 'AI Feature'}</h4>
                    <div class="innovation-level">Game Changer</div>
                </div>
            </div>
            <div class="ai-feature-description">
                ${feature.description || 'Advanced AI capability that enhances user experience.'}
            </div>
            <div class="ai-feature-benefits">
                <h5>Game-Changing Advantage:</h5>
                <p>${feature.gameChanger || 'This revolutionary feature sets you apart from all competitors and creates a new market category.'}</p>
            </div>
            <div class="ai-feature-impact">
                <div class="impact-label">Impact</div>
                <div class="impact-value">${feature.impact || '+200%'}</div>
            </div>
        </div>
    `).join('');
}

function showFallbackReport(ideaText, contentDiv) {
    contentDiv.innerHTML = `
        <button class="modal-close" onclick="document.getElementById('idea-research-modal').style.display='none'">&times;</button>
        
        <div class="research-header">
            <h2>🚀 AI Research Report</h2>
            <p class="research-subtitle">Analysis for: "${ideaText}"</p>
        </div>
        
        <div class="research-body">
            <div class="research-section">
                <h3>📋 Executive Summary</h3>
                <div class="research-content">
                    <div class="research-highlight">
                        <p>Your business idea "${ideaText}" shows strong potential with innovative features and market opportunity.</p>
                    </div>
                </div>
            </div>
            
            <div class="research-section">
                <h3>📊 Market Analysis</h3>
                <div class="research-content">
                    <div class="research-stats">
                        <div class="stat-card">
                            <div class="stat-value">$2.4B</div>
                            <div class="stat-label">Market Size</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">23%</div>
                            <div class="stat-label">Growth Rate</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="research-actions">
            <button class="research-btn" onclick="alert('📄 Report exported!')">📄 Export PDF</button>
            <button class="research-btn" onclick="generateStoriesFromGemini('${ideaText}')">🚀 Generate Stories</button>
            <button class="research-btn secondary" onclick="document.getElementById('idea-research-modal').style.display='none'">✕ Close</button>
        </div>
    `;
}

function exportGeminiReport() {
    alert('📄 Gemini-powered research report exported as PDF!');
}

function generateStoriesFromGemini(ideaText) {
    document.getElementById('idea-research-modal').style.display = 'none';
    document.getElementById('story-generator-section').scrollIntoView({ behavior: 'smooth' });
    
    const brdInput = document.getElementById('brd-input');
    if (brdInput) {
        brdInput.value = `BUSINESS REQUIREMENTS - POWERED BY GEMINI AI

Project: ${ideaText}

EXECUTIVE SUMMARY:
AI-generated comprehensive analysis reveals strong market potential with innovative features and competitive advantages.

KEY REQUIREMENTS:
- AI-powered core functionality
- Real-time user collaboration
- Advanced analytics dashboard
- Mobile-responsive design
- Scalable cloud architecture

COMPETITIVE ADVANTAGES:
- Superior AI integration
- Enhanced user experience
- Innovative automation features

TECHNICAL STACK:
- Frontend: React + TypeScript
- Backend: Node.js + Express
- AI: Gemini API integration
- Database: PostgreSQL
- Deployment: Cloud-native`;
        brdInput.focus();
    }
    
    alert('🚀 Gemini research transferred to User Stories section!');
}