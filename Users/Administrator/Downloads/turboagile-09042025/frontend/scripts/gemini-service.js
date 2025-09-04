// Gemini AI Service Integration
class GeminiService {
    constructor() {
        this.apiKey = null;
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
        this.init();
    }

    init() {
        // Try to get API key from environment or localStorage
        this.apiKey = localStorage.getItem('gemini_api_key') || 
                     document.querySelector('meta[name="gemini-api-key"]')?.content;
    }

    async generateContent(prompt) {
        if (!this.apiKey) {
            throw new Error('Gemini API key not configured');
        }

        const requestBody = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }]
        };

        try {
            const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`Gemini API error: ${response.status}`);
            }

            const data = await response.json();
            const generatedText = data.candidates[0]?.content?.parts[0]?.text;
            
            if (!generatedText) {
                throw new Error('No content generated');
            }

            // Try to parse as JSON if it looks like JSON
            try {
                return JSON.parse(generatedText);
            } catch {
                // If not JSON, return as structured object
                return this.parseTextResponse(generatedText);
            }

        } catch (error) {
            console.error('Gemini API call failed:', error);
            throw error;
        }
    }

    parseTextResponse(text) {
        // Simple parser for non-JSON responses
        const lines = text.split('\n').filter(line => line.trim());
        
        return {
            overview: this.extractSection(lines, 'overview') || 'AI-generated architecture overview',
            components: this.extractSection(lines, 'components') || ['Component 1', 'Component 2', 'Component 3'],
            techStack: this.extractSection(lines, 'tech') || 'Modern technology stack',
            mermaidDiagram: this.extractMermaidDiagram(text) || this.getDefaultDiagram(),
            costEstimate: this.extractSection(lines, 'cost') || '$300-500/month'
        };
    }

    extractSection(lines, keyword) {
        const sectionLine = lines.find(line => 
            line.toLowerCase().includes(keyword.toLowerCase())
        );
        
        if (sectionLine) {
            return sectionLine.split(':')[1]?.trim();
        }
        return null;
    }

    extractMermaidDiagram(text) {
        const mermaidMatch = text.match(/```mermaid\n([\s\S]*?)\n```/);
        if (mermaidMatch) {
            return mermaidMatch[1].trim();
        }
        
        // Look for graph patterns
        const graphMatch = text.match(/graph\s+\w+\n([\s\S]*?)(?=\n\n|\n#|\n```|$)/);
        if (graphMatch) {
            return 'graph TB\n' + graphMatch[1].trim();
        }
        
        return null;
    }

    getDefaultDiagram() {
        return `graph TB
    A[Client] --> B[API Gateway]
    B --> C[Service 1]
    B --> D[Service 2]
    C --> E[(Database)]
    D --> E`;
    }

    setApiKey(apiKey) {
        this.apiKey = apiKey;
        localStorage.setItem('gemini_api_key', apiKey);
    }

    hasApiKey() {
        return !!this.apiKey;
    }
}

// Initialize Gemini service
window.geminiService = new GeminiService();

// Add API key configuration UI
document.addEventListener('DOMContentLoaded', function() {
    if (!window.geminiService.hasApiKey()) {
        console.log('Gemini API key not configured. Using fallback architecture generation.');
    }
});