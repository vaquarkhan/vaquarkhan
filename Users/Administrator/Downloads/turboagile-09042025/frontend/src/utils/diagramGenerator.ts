/**
 * Diagram Generator for TurboAgile
 * Based on: https://github.com/oscarismael47/diagram_generator
 */

export interface DiagramConfig {
    type: 'flowchart' | 'sequence' | 'class' | 'er' | 'gantt' | 'pie' | 'gitgraph';
    title?: string;
    theme?: 'default' | 'dark' | 'forest' | 'neutral';
}

export interface FlowchartNode {
    id: string;
    label: string;
    shape?: 'rect' | 'round' | 'diamond' | 'circle' | 'ellipse';
}

export interface FlowchartEdge {
    from: string;
    to: string;
    label?: string;
    style?: 'solid' | 'dashed' | 'dotted';
}

export class DiagramGenerator {
    private static instance: DiagramGenerator;
    
    public static getInstance(): DiagramGenerator {
        if (!DiagramGenerator.instance) {
            DiagramGenerator.instance = new DiagramGenerator();
        }
        return DiagramGenerator.instance;
    }

    /**
     * Generate Architecture Diagram from Story
     */
    generateArchitectureDiagram(story: any): string {
        const nodes: FlowchartNode[] = [
            { id: 'frontend', label: 'Frontend\n(React/TypeScript)', shape: 'rect' },
            { id: 'api', label: 'API Gateway\n(Express.js)', shape: 'rect' },
            { id: 'auth', label: 'Authentication\n(JWT)', shape: 'diamond' },
            { id: 'business', label: 'Business Logic\n(Services)', shape: 'rect' },
            { id: 'database', label: 'Database\n(PostgreSQL)', shape: 'round' },
            { id: 'cache', label: 'Cache\n(Redis)', shape: 'ellipse' },
            { id: 'monitoring', label: 'Monitoring\n(Logs/Metrics)', shape: 'rect' }
        ];

        const edges: FlowchartEdge[] = [
            { from: 'frontend', to: 'api', label: 'HTTPS/REST' },
            { from: 'api', to: 'auth', label: 'Validate Token' },
            { from: 'auth', to: 'business', label: 'Authorized' },
            { from: 'business', to: 'database', label: 'CRUD Operations' },
            { from: 'business', to: 'cache', label: 'Cache Layer' },
            { from: 'api', to: 'monitoring', label: 'Logs/Metrics' }
        ];

        return this.generateMermaidFlowchart(nodes, edges, {
            type: 'flowchart',
            title: `Architecture: ${story.title}`,
            theme: 'dark'
        });
    }

    /**
     * Generate System Flow Diagram
     */
    generateSystemFlowDiagram(story: any): string {
        const steps = this.extractWorkflowSteps(story);
        const nodes: FlowchartNode[] = [];
        const edges: FlowchartEdge[] = [];

        steps.forEach((step, index) => {
            const nodeId = `step${index + 1}`;
            nodes.push({
                id: nodeId,
                label: step.name,
                shape: step.type === 'decision' ? 'diamond' : 'rect'
            });

            if (index > 0) {
                edges.push({
                    from: `step${index}`,
                    to: nodeId,
                    label: step.condition || ''
                });
            }
        });

        return this.generateMermaidFlowchart(nodes, edges, {
            type: 'flowchart',
            title: `System Flow: ${story.title}`,
            theme: 'default'
        });
    }

    /**
     * Generate Database ER Diagram
     */
    generateERDiagram(story: any): string {
        const entities = this.extractEntities(story);
        
        let mermaid = `erDiagram\n`;
        
        entities.forEach(entity => {
            mermaid += `    ${entity.name} {\n`;
            entity.attributes.forEach(attr => {
                mermaid += `        ${attr.type} ${attr.name}\n`;
            });
            mermaid += `    }\n\n`;
        });

        // Add relationships
        const relationships = this.extractRelationships(entities);
        relationships.forEach(rel => {
            mermaid += `    ${rel.from} ${rel.type} ${rel.to} : ${rel.label}\n`;
        });

        return mermaid;
    }

    /**
     * Generate Sequence Diagram for User Interactions
     */
    generateSequenceDiagram(story: any): string {
        const actors = ['User', 'Frontend', 'API', 'Database'];
        const interactions = this.extractUserInteractions(story);

        let mermaid = `sequenceDiagram\n`;
        
        actors.forEach(actor => {
            mermaid += `    participant ${actor}\n`;
        });
        mermaid += `\n`;

        interactions.forEach((interaction, index) => {
            mermaid += `    ${interaction.from}->>+${interaction.to}: ${interaction.message}\n`;
            if (interaction.response) {
                mermaid += `    ${interaction.to}-->>-${interaction.from}: ${interaction.response}\n`;
            }
            if (index < interactions.length - 1) {
                mermaid += `\n`;
            }
        });

        return mermaid;
    }

    /**
     * Generate Class Diagram for Code Structure
     */
    generateClassDiagram(story: any): string {
        const classes = this.extractClasses(story);
        
        let mermaid = `classDiagram\n`;
        
        classes.forEach(cls => {
            mermaid += `    class ${cls.name} {\n`;
            
            // Properties
            cls.properties.forEach(prop => {
                mermaid += `        ${prop.visibility}${prop.type} ${prop.name}\n`;
            });
            
            // Methods
            cls.methods.forEach(method => {
                mermaid += `        ${method.visibility}${method.name}(${method.params}) ${method.returnType}\n`;
            });
            
            mermaid += `    }\n\n`;
        });

        // Add relationships
        const classRelations = this.extractClassRelationships(classes);
        classRelations.forEach(rel => {
            mermaid += `    ${rel.from} ${rel.type} ${rel.to}\n`;
        });

        return mermaid;
    }

    /**
     * Generate Project Timeline (Gantt Chart)
     */
    generateTimelineDiagram(stories: any[]): string {
        let mermaid = `gantt\n`;
        mermaid += `    title Project Timeline\n`;
        mermaid += `    dateFormat  YYYY-MM-DD\n`;
        mermaid += `    section Development\n`;

        stories.forEach((story, index) => {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() + (index * 3));
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + (story.points || 3));

            const status = story.status === 'done' ? 'done' : 
                          story.status === 'in-progress' ? 'active' : 'crit';

            mermaid += `    ${story.title.replace(/[^a-zA-Z0-9\s]/g, '').substring(0, 30)} :${status}, ${startDate.toISOString().split('T')[0]}, ${endDate.toISOString().split('T')[0]}\n`;
        });

        return mermaid;
    }

    /**
     * Generate Deployment Diagram
     */
    generateDeploymentDiagram(story: any): string {
        const nodes: FlowchartNode[] = [
            { id: 'user', label: 'Users', shape: 'circle' },
            { id: 'cdn', label: 'CDN\n(CloudFront)', shape: 'rect' },
            { id: 'lb', label: 'Load Balancer\n(ALB)', shape: 'diamond' },
            { id: 'web1', label: 'Web Server 1\n(ECS)', shape: 'rect' },
            { id: 'web2', label: 'Web Server 2\n(ECS)', shape: 'rect' },
            { id: 'api1', label: 'API Server 1\n(ECS)', shape: 'rect' },
            { id: 'api2', label: 'API Server 2\n(ECS)', shape: 'rect' },
            { id: 'db', label: 'Database\n(RDS)', shape: 'round' },
            { id: 'cache', label: 'Cache\n(ElastiCache)', shape: 'ellipse' }
        ];

        const edges: FlowchartEdge[] = [
            { from: 'user', to: 'cdn', label: 'HTTPS' },
            { from: 'cdn', to: 'lb', label: 'Route' },
            { from: 'lb', to: 'web1', label: 'Balance' },
            { from: 'lb', to: 'web2', label: 'Balance' },
            { from: 'web1', to: 'api1', label: 'API Calls' },
            { from: 'web2', to: 'api2', label: 'API Calls' },
            { from: 'api1', to: 'db', label: 'Query' },
            { from: 'api2', to: 'db', label: 'Query' },
            { from: 'api1', to: 'cache', label: 'Cache' },
            { from: 'api2', to: 'cache', label: 'Cache' }
        ];

        return this.generateMermaidFlowchart(nodes, edges, {
            type: 'flowchart',
            title: `Deployment: ${story.title}`,
            theme: 'neutral'
        });
    }

    /**
     * Generate Mermaid Flowchart
     */
    private generateMermaidFlowchart(nodes: FlowchartNode[], edges: FlowchartEdge[], config: DiagramConfig): string {
        let mermaid = `flowchart TD\n`;
        
        // Add title if provided
        if (config.title) {
            mermaid = `---\ntitle: ${config.title}\n---\n${mermaid}`;
        }

        // Add nodes
        nodes.forEach(node => {
            const shape = this.getNodeShape(node.shape || 'rect');
            mermaid += `    ${node.id}${shape.start}"${node.label}"${shape.end}\n`;
        });

        mermaid += `\n`;

        // Add edges
        edges.forEach(edge => {
            const arrow = edge.style === 'dashed' ? '-.->|' : 
                         edge.style === 'dotted' ? '..->|' : '-->|';
            const label = edge.label ? `${edge.label}|` : '';
            mermaid += `    ${edge.from} ${arrow}${label} ${edge.to}\n`;
        });

        // Add styling
        mermaid += this.getThemeStyles(config.theme || 'default');

        return mermaid;
    }

    /**
     * Get node shape syntax for Mermaid
     */
    private getNodeShape(shape: string): { start: string; end: string } {
        const shapes = {
            'rect': { start: '[', end: ']' },
            'round': { start: '(', end: ')' },
            'diamond': { start: '{', end: '}' },
            'circle': { start: '((', end: '))' },
            'ellipse': { start: '([', end: '])' }
        };
        return shapes[shape] || shapes['rect'];
    }

    /**
     * Get theme styles for Mermaid
     */
    private getThemeStyles(theme: string): string {
        const themes = {
            'dark': `
    classDef default fill:#1f2937,stroke:#374151,stroke-width:2px,color:#f9fafb
    classDef primary fill:#6366f1,stroke:#4f46e5,stroke-width:2px,color:#ffffff
    classDef secondary fill:#10b981,stroke:#059669,stroke-width:2px,color:#ffffff`,
            'forest': `
    classDef default fill:#2d5a27,stroke:#4ade80,stroke-width:2px,color:#ffffff
    classDef primary fill:#16a34a,stroke:#15803d,stroke-width:2px,color:#ffffff`,
            'neutral': `
    classDef default fill:#f3f4f6,stroke:#6b7280,stroke-width:2px,color:#111827
    classDef primary fill:#3b82f6,stroke:#2563eb,stroke-width:2px,color:#ffffff`,
            'default': ''
        };
        return themes[theme] || themes['default'];
    }

    /**
     * Extract workflow steps from story
     */
    private extractWorkflowSteps(story: any): Array<{name: string, type: string, condition?: string}> {
        const steps = [
            { name: 'User Request', type: 'start' },
            { name: 'Validate Input', type: 'process' },
            { name: 'Authentication', type: 'decision', condition: 'Valid?' },
            { name: 'Process Request', type: 'process' },
            { name: 'Update Database', type: 'process' },
            { name: 'Return Response', type: 'end' }
        ];

        // Customize based on story content
        if (story.title.toLowerCase().includes('login')) {
            steps.splice(2, 0, { name: 'Check Credentials', type: 'decision', condition: 'Valid?' });
        }

        return steps;
    }

    /**
     * Extract entities from story for ER diagram
     */
    private extractEntities(story: any): Array<{name: string, attributes: Array<{name: string, type: string}>}> {
        const entities = [
            {
                name: 'User',
                attributes: [
                    { name: 'id', type: 'UUID' },
                    { name: 'email', type: 'VARCHAR' },
                    { name: 'password_hash', type: 'VARCHAR' },
                    { name: 'created_at', type: 'TIMESTAMP' }
                ]
            }
        ];

        // Add entities based on story content
        if (story.title.toLowerCase().includes('product') || story.title.toLowerCase().includes('item')) {
            entities.push({
                name: 'Product',
                attributes: [
                    { name: 'id', type: 'UUID' },
                    { name: 'name', type: 'VARCHAR' },
                    { name: 'price', type: 'DECIMAL' },
                    { name: 'description', type: 'TEXT' }
                ]
            });
        }

        return entities;
    }

    /**
     * Extract relationships between entities
     */
    private extractRelationships(entities: any[]): Array<{from: string, to: string, type: string, label: string}> {
        const relationships = [];
        
        if (entities.length > 1) {
            relationships.push({
                from: 'User',
                to: entities[1].name,
                type: '||--o{',
                label: 'owns'
            });
        }

        return relationships;
    }

    /**
     * Extract user interactions for sequence diagram
     */
    private extractUserInteractions(story: any): Array<{from: string, to: string, message: string, response?: string}> {
        return [
            { from: 'User', to: 'Frontend', message: 'Submit Form', response: 'Show Loading' },
            { from: 'Frontend', to: 'API', message: 'POST /api/data', response: 'Success Response' },
            { from: 'API', to: 'Database', message: 'INSERT Query', response: 'Record Created' },
            { from: 'Frontend', to: 'User', message: 'Show Success Message' }
        ];
    }

    /**
     * Extract classes for class diagram
     */
    private extractClasses(story: any): Array<{
        name: string,
        properties: Array<{name: string, type: string, visibility: string}>,
        methods: Array<{name: string, params: string, returnType: string, visibility: string}>
    }> {
        const componentName = story.title.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
        
        return [
            {
                name: `${componentName}Component`,
                properties: [
                    { name: 'state', type: 'State', visibility: '-' },
                    { name: 'props', type: 'Props', visibility: '+' }
                ],
                methods: [
                    { name: 'render', params: '', returnType: 'JSX.Element', visibility: '+' },
                    { name: 'handleSubmit', params: 'event: Event', returnType: 'void', visibility: '-' }
                ]
            },
            {
                name: `${componentName}Service`,
                properties: [
                    { name: 'apiClient', type: 'ApiClient', visibility: '-' }
                ],
                methods: [
                    { name: 'create', params: 'data: any', returnType: 'Promise<any>', visibility: '+' },
                    { name: 'update', params: 'id: string, data: any', returnType: 'Promise<any>', visibility: '+' }
                ]
            }
        ];
    }

    /**
     * Extract class relationships
     */
    private extractClassRelationships(classes: any[]): Array<{from: string, to: string, type: string}> {
        if (classes.length < 2) return [];
        
        return [
            { from: classes[0].name, to: classes[1].name, type: '-->' }
        ];
    }

    /**
     * Render diagram to HTML
     */
    renderDiagram(mermaidCode: string, containerId: string): void {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container ${containerId} not found`);
            return;
        }

        // Create mermaid container
        const mermaidDiv = document.createElement('div');
        mermaidDiv.className = 'mermaid';
        mermaidDiv.textContent = mermaidCode;
        
        container.innerHTML = '';
        container.appendChild(mermaidDiv);

        // Initialize mermaid if available
        if (typeof window !== 'undefined' && (window as any).mermaid) {
            (window as any).mermaid.init(undefined, mermaidDiv);
        } else {
            // Fallback: show code
            const pre = document.createElement('pre');
            pre.style.cssText = 'background: #1f2937; color: #f9fafb; padding: 1rem; border-radius: 6px; overflow-x: auto; font-size: 0.85rem;';
            pre.textContent = mermaidCode;
            container.innerHTML = '';
            container.appendChild(pre);
        }
    }

    /**
     * Export diagram as SVG
     */
    async exportDiagram(mermaidCode: string, format: 'svg' | 'png' = 'svg'): Promise<string> {
        // This would integrate with mermaid's export functionality
        // For now, return the mermaid code
        return mermaidCode;
    }
}

// Export singleton instance
export const diagramGenerator = DiagramGenerator.getInstance();