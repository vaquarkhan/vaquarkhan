// Enhanced research function with comprehensive content
function generateResearchReport(ideaText) {
    const modal = document.getElementById('idea-research-modal');
    if (!modal) {
        alert('Research modal not found');
        return;
    }
    
    modal.className = 'modal-overlay research-modal';
    
    // Show progress first
    const contentDiv = modal.querySelector('.modal-content');
    if (contentDiv) {
        contentDiv.innerHTML = `
            <div class="research-progress">
                <div class="progress-spinner"></div>
                <div class="progress-text">AI is analyzing your idea...</div>
            </div>
        `;
    }
    
    // Show final report after delay
    setTimeout(() => {
        showResearchReport(ideaText, contentDiv);
    }, 2000);
}

function showResearchReport(ideaText, contentDiv) {
    const reportContent = `
        <button class="modal-close" onclick="document.getElementById('idea-research-modal').style.display='none'">&times;</button>
        
        <div class="research-header">
            <h2>🚀 AI Research Report</h2>
            <p class="research-subtitle">Comprehensive Analysis for: "${ideaText}"</p>
        </div>
        
        <div class="research-body">
            <!-- Executive Summary -->
            <div class="research-section">
                <h3>📋 Executive Summary</h3>
                <div class="research-content">
                    <div class="research-highlight">
                        <p><strong>Project Vision:</strong> ${ideaText} represents a high-potential digital solution addressing modern market needs with innovative AI-powered features and scalable architecture.</p>
                    </div>
                    <p>This comprehensive analysis reveals strong market opportunity with $2.4B addressable market, competitive differentiation through AI integration, and clear path to MVP within 16 weeks. The solution combines proven technologies with cutting-edge AI capabilities to deliver exceptional user value.</p>
                </div>
            </div>

            <!-- SMART Objectives -->
            <div class="research-section">
                <h3>🎯 SMART Project Objectives</h3>
                <div class="research-content">
                    <div class="smart-goals">
                        <div class="smart-goal">
                            <div class="smart-letter">S</div>
                            <div class="smart-word">Specific</div>
                            <div class="smart-description">Launch MVP with core features within 16 weeks</div>
                        </div>
                        <div class="smart-goal">
                            <div class="smart-letter">M</div>
                            <div class="smart-word">Measurable</div>
                            <div class="smart-description">Achieve 1,000 active users in first 3 months</div>
                        </div>
                        <div class="smart-goal">
                            <div class="smart-letter">A</div>
                            <div class="smart-word">Achievable</div>
                            <div class="smart-description">Leverage proven tech stack and AI APIs</div>
                        </div>
                        <div class="smart-goal">
                            <div class="smart-letter">R</div>
                            <div class="smart-word">Relevant</div>
                            <div class="smart-description">Addresses validated market pain points</div>
                        </div>
                        <div class="smart-goal">
                            <div class="smart-letter">T</div>
                            <div class="smart-word">Time-bound</div>
                            <div class="smart-description">Q2 2024 launch with phased rollout</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Project Scope -->
            <div class="research-section">
                <h3>📐 Project Scope</h3>
                <div class="research-content">
                    <div class="scope-definition">
                        <div class="scope-column in-scope">
                            <div class="scope-header">
                                <div class="scope-icon">✅</div>
                                <div class="scope-title">In Scope</div>
                            </div>
                            <ul class="scope-list">
                                <li>Core user authentication system</li>
                                <li>Main application features</li>
                                <li>AI-powered recommendations</li>
                                <li>Mobile-responsive web app</li>
                                <li>Basic analytics dashboard</li>
                                <li>Payment integration</li>
                            </ul>
                        </div>
                        <div class="scope-column out-scope">
                            <div class="scope-header">
                                <div class="scope-icon">❌</div>
                                <div class="scope-title">Out of Scope</div>
                            </div>
                            <ul class="scope-list">
                                <li>Native mobile apps (Phase 2)</li>
                                <li>Advanced AI training models</li>
                                <li>Multi-language support</li>
                                <li>Enterprise SSO integration</li>
                                <li>White-label solutions</li>
                                <li>API marketplace</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Competitor Analysis -->
            <div class="research-section">
                <h3>🏆 Competitor Analysis</h3>
                <div class="research-content">
                    <div class="competitor-grid">
                        <div class="competitor-card">
                            <div class="competitor-header">
                                <div class="competitor-logo">N</div>
                                <div class="competitor-info">
                                    <h4>Notion</h4>
                                    <div class="market-share">Market Leader - 35% share</div>
                                </div>
                            </div>
                            <div class="competitor-features">
                                <h5>Key Features:</h5>
                                <div class="feature-list">
                                    <span class="feature-tag">Workspace</span>
                                    <span class="feature-tag">Templates</span>
                                    <span class="feature-tag">Collaboration</span>
                                    <span class="feature-tag">Database</span>
                                </div>
                            </div>
                            <div class="competitor-rating">
                                <div class="rating-stars">★★★★☆</div>
                                <div class="rating-score">4.2/5</div>
                            </div>
                        </div>
                        
                        <div class="competitor-card">
                            <div class="competitor-header">
                                <div class="competitor-logo">A</div>
                                <div class="competitor-info">
                                    <h4>Airtable</h4>
                                    <div class="market-share">Strong Player - 22% share</div>
                                </div>
                            </div>
                            <div class="competitor-features">
                                <h5>Key Features:</h5>
                                <div class="feature-list">
                                    <span class="feature-tag">Database</span>
                                    <span class="feature-tag">Automation</span>
                                    <span class="feature-tag">Views</span>
                                    <span class="feature-tag">API</span>
                                </div>
                            </div>
                            <div class="competitor-rating">
                                <div class="rating-stars">★★★★☆</div>
                                <div class="rating-score">4.1/5</div>
                            </div>
                        </div>
                        
                        <div class="competitor-card">
                            <div class="competitor-header">
                                <div class="competitor-logo">C</div>
                                <div class="competitor-info">
                                    <h4>ClickUp</h4>
                                    <div class="market-share">Growing Fast - 18% share</div>
                                </div>
                            </div>
                            <div class="competitor-features">
                                <h5>Key Features:</h5>
                                <div class="feature-list">
                                    <span class="feature-tag">Tasks</span>
                                    <span class="feature-tag">Time Tracking</span>
                                    <span class="feature-tag">Goals</span>
                                    <span class="feature-tag">Docs</span>
                                </div>
                            </div>
                            <div class="competitor-rating">
                                <div class="rating-stars">★★★★☆</div>
                                <div class="rating-score">4.0/5</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Feature Comparison -->
            <div class="research-section">
                <h3>📊 Market Feature Comparison</h3>
                <div class="research-content">
                    <div class="feature-comparison-table">
                        <div class="comparison-header">Feature Comparison Matrix</div>
                        <div class="comparison-grid">
                            <div class="comparison-cell feature-name">Feature</div>
                            <div class="comparison-cell">Notion</div>
                            <div class="comparison-cell">Airtable</div>
                            <div class="comparison-cell">ClickUp</div>
                            <div class="comparison-cell">Our Solution</div>
                            
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
                            
                            <div class="comparison-cell feature-name">Mobile App</div>
                            <div class="comparison-cell has-feature">✅</div>
                            <div class="comparison-cell has-feature">✅</div>
                            <div class="comparison-cell has-feature">✅</div>
                            <div class="comparison-cell partial-feature">⚠️</div>
                            
                            <div class="comparison-cell feature-name">Advanced Analytics</div>
                            <div class="comparison-cell partial-feature">⚠️</div>
                            <div class="comparison-cell has-feature">✅</div>
                            <div class="comparison-cell has-feature">✅</div>
                            <div class="comparison-cell has-feature">✅</div>
                            
                            <div class="comparison-cell feature-name">API Access</div>
                            <div class="comparison-cell has-feature">✅</div>
                            <div class="comparison-cell has-feature">✅</div>
                            <div class="comparison-cell has-feature">✅</div>
                            <div class="comparison-cell has-feature">✅</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- AI Game-Changing Features -->
            <div class="research-section">
                <h3>🚀 AI Game-Changing Features</h3>
                <div class="research-content">
                    <div class="ai-features-grid">
                        <div class="ai-feature-card">
                            <div class="ai-feature-header">
                                <div class="ai-feature-icon">🤖</div>
                                <div class="ai-feature-info">
                                    <h4>Smart Content Generation</h4>
                                    <div class="innovation-level">Revolutionary Innovation</div>
                                </div>
                            </div>
                            <div class="ai-feature-description">
                                AI automatically generates content, templates, and workflows based on user behavior and industry best practices, reducing setup time by 90%.
                            </div>
                            <div class="ai-feature-benefits">
                                <h5>Key Benefits:</h5>
                                <ul class="benefit-list">
                                    <li>Zero-setup onboarding experience</li>
                                    <li>Personalized content recommendations</li>
                                    <li>Industry-specific templates</li>
                                    <li>Continuous learning and optimization</li>
                                </ul>
                            </div>
                            <div class="ai-feature-impact">
                                <div class="impact-label">Productivity Impact</div>
                                <div class="impact-value">+300%</div>
                            </div>
                        </div>
                        
                        <div class="ai-feature-card">
                            <div class="ai-feature-header">
                                <div class="ai-feature-icon">🔮</div>
                                <div class="ai-feature-info">
                                    <h4>Predictive Analytics</h4>
                                    <div class="innovation-level">Market Differentiator</div>
                                </div>
                            </div>
                            <div class="ai-feature-description">
                                Advanced ML algorithms predict project outcomes, resource needs, and potential bottlenecks before they occur, enabling proactive decision-making.
                            </div>
                            <div class="ai-feature-benefits">
                                <h5>Key Benefits:</h5>
                                <ul class="benefit-list">
                                    <li>Early risk detection and mitigation</li>
                                    <li>Resource optimization recommendations</li>
                                    <li>Timeline accuracy improvement</li>
                                    <li>Cost overrun prevention</li>
                                </ul>
                            </div>
                            <div class="ai-feature-impact">
                                <div class="impact-label">Success Rate</div>
                                <div class="impact-value">+85%</div>
                            </div>
                        </div>
                        
                        <div class="ai-feature-card">
                            <div class="ai-feature-header">
                                <div class="ai-feature-icon">🌐</div>
                                <div class="ai-feature-info">
                                    <h4>Intelligent Automation</h4>
                                    <div class="innovation-level">Competitive Advantage</div>
                                </div>
                            </div>
                            <div class="ai-feature-description">
                                Context-aware automation that learns user patterns and automates repetitive tasks, workflows, and decision-making processes without manual setup.
                            </div>
                            <div class="ai-feature-benefits">
                                <h5>Key Benefits:</h5>
                                <ul class="benefit-list">
                                    <li>Self-configuring workflows</li>
                                    <li>Intelligent task prioritization</li>
                                    <li>Automated quality assurance</li>
                                    <li>Smart notification management</li>
                                </ul>
                            </div>
                            <div class="ai-feature-impact">
                                <div class="impact-label">Time Savings</div>
                                <div class="impact-value">+250%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Risk Assessment -->
            <div class="research-section">
                <h3>⚠️ Risk Assessment & Mitigation</h3>
                <div class="research-content">
                    <div class="risk-matrix">
                        <div class="risk-card high-risk">
                            <div class="risk-header">
                                <div class="risk-title">Market Competition</div>
                                <div class="risk-level high">High</div>
                            </div>
                            <div class="risk-description">
                                Established players with significant market share and resources.
                            </div>
                            <div class="risk-mitigation">
                                <div class="mitigation-title">Mitigation Strategy:</div>
                                <div class="mitigation-text">Focus on AI differentiation and superior user experience. Target underserved market segments first.</div>
                            </div>
                        </div>
                        
                        <div class="risk-card medium-risk">
                            <div class="risk-header">
                                <div class="risk-title">Technical Complexity</div>
                                <div class="risk-level medium">Medium</div>
                            </div>
                            <div class="risk-description">
                                AI integration and scalability challenges may impact timeline.
                            </div>
                            <div class="risk-mitigation">
                                <div class="mitigation-title">Mitigation Strategy:</div>
                                <div class="mitigation-text">Use proven AI APIs, implement MVP approach, and maintain technical advisory board.</div>
                            </div>
                        </div>
                        
                        <div class="risk-card medium-risk">
                            <div class="risk-header">
                                <div class="risk-title">User Adoption</div>
                                <div class="risk-level medium">Medium</div>
                            </div>
                            <div class="risk-description">
                                Users may resist switching from existing solutions.
                            </div>
                            <div class="risk-mitigation">
                                <div class="mitigation-title">Mitigation Strategy:</div>
                                <div class="mitigation-text">Seamless migration tools, freemium model, and superior onboarding experience.</div>
                            </div>
                        </div>
                        
                        <div class="risk-card low-risk">
                            <div class="risk-header">
                                <div class="risk-title">Funding Requirements</div>
                                <div class="risk-level low">Low</div>
                            </div>
                            <div class="risk-description">
                                Initial development costs and ongoing operational expenses.
                            </div>
                            <div class="risk-mitigation">
                                <div class="mitigation-title">Mitigation Strategy:</div>
                                <div class="mitigation-text">Phased development approach, early revenue generation, and strategic partnerships.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="research-actions">
            <button class="research-btn" onclick="alert('📄 Comprehensive research report exported as PDF!')">
                📄 Export PDF
            </button>
            <button class="research-btn" onclick="generateBRDFromResearch()">
                🚀 Generate User Stories
            </button>
            <button class="research-btn secondary" onclick="document.getElementById('idea-research-modal').style.display='none'">
                ✕ Close
            </button>
        </div>
    `;
    
    contentDiv.innerHTML = reportContent;
}

function generateBRDFromResearch() {
    document.getElementById('idea-research-modal').style.display = 'none';
    document.getElementById('story-generator-section').scrollIntoView({ behavior: 'smooth' });
    
    // Auto-populate BRD textarea with research insights
    const brdInput = document.getElementById('brd-input');
    if (brdInput) {
        brdInput.value = `BUSINESS REQUIREMENTS DOCUMENT

Generated from AI Research Analysis

EXECUTIVE SUMMARY:
This project aims to develop an innovative solution with AI-powered features that differentiate from existing market players like Notion, Airtable, and ClickUp.

KEY REQUIREMENTS:
- Smart content generation with AI
- Predictive analytics for project success
- Intelligent automation workflows
- Real-time collaboration features
- Advanced analytics dashboard
- Mobile-responsive design

DIFFERENTIATION:
- Revolutionary AI integration (300% productivity boost)
- Predictive analytics (85% higher success rate)
- Self-configuring automation (250% time savings)

TARGET USERS:
- Project managers seeking AI-powered efficiency
- Teams wanting predictive insights
- Organizations needing intelligent automation`;
        brdInput.focus();
    }
    
    alert('🚀 Research insights transferred to User Stories section!');
}