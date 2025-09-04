# Architecture Story Feature

## Overview

The Architecture Story feature is a comprehensive 6-step workflow that guides users through creating complete architecture solutions from requirements to deployment. It integrates AI-powered pattern generation, diagram creation, and code generation.

## Workflow Steps

### Step 1: Cloud Selection
- **Purpose**: Choose deployment preference and add custom requirements
- **Features**:
  - Dropdown to select cloud provider (AWS, Azure, GCP, On-Premise, Cloud Agnostic)
  - Optional custom prompt input for specific requirements
  - BRD (Business Requirements Document) context integration

### Step 2: Architecture Pattern Generation
- **Purpose**: Generate and select architecture patterns using AI
- **Features**:
  - Uses Gemini API with BRD context to generate patterns
  - Displays multiple architecture options with:
    - Pattern name and description
    - Reference links for learning
    - Cost estimation from AWS Cost API
    - Pros and cons analysis
  - Radio button selection for choosing one pattern
  - Accept or regenerate options
  - Custom prompt for regeneration

### Step 3: Diagram Editor
- **Purpose**: Generate and edit architecture diagrams
- **Features**:
  - End-to-end architecture diagram
  - Sequence diagram
  - ER (Entity Relationship) diagram
  - Interactive diagram editor for modifications
  - Mermaid.js integration for diagram rendering

### Step 4: Technology Stack Selection
- **Purpose**: Choose programming language and framework
- **Features**:
  - Language selection (Java, JavaScript, Python, C#, Go, Rust)
  - Framework selection based on chosen language:
    - Java: Spring Boot, Spring MVC, Quarkus, Micronaut
    - JavaScript: Node.js + Express, Next.js, Nest.js, React
    - Python: Django, Flask, FastAPI, Pyramid
    - C#: .NET Core, ASP.NET, .NET Framework, Blazor
    - Go: Gin, Echo, Fiber, Chi
    - Rust: Actix, Rocket, Warp, Axum

### Step 5: Code Generation
- **Purpose**: Generate complete code based on architecture and technology choices
- **Features**:
  - AI-powered code generation
  - Multiple file generation (controllers, services, models, config)
  - Code editor with syntax highlighting
  - Download functionality for generated code
  - Framework-specific templates

### Step 6: Final Steps
- **Purpose**: Complete the architecture story with deployment preparation
- **Features**:
  - Test generation (unit and integration tests)
  - Git workflow setup (CI/CD pipeline)
  - Cloud deployment configuration
  - Final architecture story completion

## Technical Implementation

### Backend Components

#### Controllers
- `ArchitectureController.java`: Main REST controller for architecture operations
- Endpoints:
  - `POST /api/architecture/generate-patterns`: Generate architecture patterns
  - `POST /api/architecture/generate-diagrams`: Generate diagrams
  - `POST /api/architecture/generate-code`: Generate code
  - `GET /api/architecture/cost-estimation/{patternId}`: Get cost estimation

#### Services
- `ArchitectureService.java`: Interface for architecture operations
- `ArchitectureServiceImpl.java`: Implementation with AI integration and mock data

#### DTOs
- `ArchitecturePatternRequest.java`: Request for pattern generation
- `ArchitecturePatternResponse.java`: Response with pattern details
- `DiagramGenerationRequest.java`: Request for diagram generation
- `DiagramGenerationResponse.java`: Response with diagram data
- `CodeGenerationRequest.java`: Request for code generation
- `CodeGenerationResponse.java`: Response with generated code

#### Entities
- Updated `StoryType.java` enum to include `ARCHITECTURE` type

### Frontend Components

#### React Components
- `ArchitectureStory.tsx`: Main component with complete workflow
- `ArchitectureWizard.tsx`: Enhanced wizard component

#### Services
- `architecture-story-service.js`: API service with mock data fallbacks

#### Pages
- `architecture-story.html`: Standalone HTML page with complete implementation

### Integration Points

#### AI Services
- **Gemini API**: For architecture pattern generation and code generation
- **BRD Context**: Business Requirements Document integration
- **Custom Prompts**: User-defined requirements processing

#### External APIs
- **AWS Cost API**: For cost estimation of architecture patterns
- **Cloud Provider APIs**: For deployment and resource management

#### Diagram Generation
- **Mermaid.js**: For rendering architecture, sequence, and ER diagrams
- **Interactive Editor**: For diagram modifications

## Usage Instructions

### For Users

1. **Start Architecture Story**: Click "Create Architecture Story" button
2. **Select Cloud**: Choose your preferred deployment option
3. **Add Requirements**: Optionally add custom requirements
4. **Review Patterns**: Select from AI-generated architecture patterns
5. **Edit Diagrams**: Modify generated diagrams as needed
6. **Choose Technology**: Select programming language and framework
7. **Review Code**: Examine and download generated code
8. **Deploy**: Complete with testing, Git setup, and deployment

### For Developers

#### Adding New Cloud Providers
```java
// Add to ArchitectureServiceImpl.java
case "new-cloud":
    patterns.add(createNewCloudPattern());
    break;
```

#### Adding New Languages/Frameworks
```java
// Add to generateCode method
case "new-language":
    files = generateNewLanguageCode(request);
    break;
```

#### Customizing Patterns
```java
private ArchitecturePatternResponse createCustomPattern() {
    return new ArchitecturePatternResponse(
        "custom-id",
        "Custom Pattern Name",
        "Description",
        "Reference Link",
        estimatedCost,
        pros,
        cons
    );
}
```

## Configuration

### Backend Configuration
```yaml
# application.yml
architecture:
  gemini:
    api-key: ${GEMINI_API_KEY}
    endpoint: https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
  aws:
    cost-api:
      access-key: ${AWS_ACCESS_KEY}
      secret-key: ${AWS_SECRET_KEY}
      region: us-east-1
```

### Frontend Configuration
```javascript
// config.js
const config = {
    apiBaseUrl: 'http://localhost:8080/api',
    geminiApiKey: process.env.REACT_APP_GEMINI_API_KEY,
    enableMockData: process.env.NODE_ENV === 'development'
};
```

## API Documentation

### Generate Architecture Patterns
```http
POST /api/architecture/generate-patterns
Content-Type: application/json

{
    "projectId": "string",
    "cloudChoice": "aws|azure|gcp|on-premise|cloud-agnostic",
    "customPrompt": "string (optional)",
    "brdContext": "string"
}
```

### Generate Diagrams
```http
POST /api/architecture/generate-diagrams
Content-Type: application/json

{
    "projectId": "string",
    "pattern": {
        "id": "string",
        "name": "string",
        "description": "string"
    },
    "cloudChoice": "string"
}
```

### Generate Code
```http
POST /api/architecture/generate-code
Content-Type: application/json

{
    "projectId": "string",
    "language": "java|javascript|python|csharp|go|rust",
    "framework": "string",
    "pattern": "ArchitecturePatternResponse",
    "diagrams": {
        "architectureDiagram": "string",
        "sequenceDiagram": "string",
        "erDiagram": "string"
    }
}
```

## Testing

### Unit Tests
- Test architecture pattern generation
- Test diagram generation
- Test code generation
- Test cost estimation

### Integration Tests
- Test complete workflow
- Test API endpoints
- Test AI service integration

### E2E Tests
- Test user workflow from start to finish
- Test error handling and edge cases

## Deployment

### Development
```bash
# Backend
cd backend
mvn spring-boot:run

# Frontend
cd frontend
npm start
```

### Production
```bash
# Build backend
mvn clean package

# Build frontend
npm run build

# Deploy with Docker
docker-compose up -d
```

## Future Enhancements

1. **Advanced AI Integration**
   - Multiple AI model support
   - Custom model training
   - Pattern learning from user feedback

2. **Enhanced Diagram Editor**
   - Drag-and-drop interface
   - Real-time collaboration
   - Version control for diagrams

3. **Extended Code Generation**
   - More languages and frameworks
   - Custom templates
   - Code optimization suggestions

4. **Advanced Cost Analysis**
   - Multi-cloud cost comparison
   - Resource optimization recommendations
   - Cost forecasting

5. **Deployment Automation**
   - One-click deployment
   - Infrastructure as Code generation
   - Monitoring and alerting setup

## Troubleshooting

### Common Issues

1. **Pattern Generation Fails**
   - Check Gemini API key configuration
   - Verify BRD context is available
   - Check network connectivity

2. **Diagram Rendering Issues**
   - Ensure Mermaid.js is loaded
   - Check diagram syntax
   - Verify browser compatibility

3. **Code Generation Errors**
   - Validate language/framework selection
   - Check template availability
   - Verify pattern data integrity

### Debug Mode
Enable debug logging in `application.yml`:
```yaml
logging:
  level:
    com.turboagile.service.impl.ArchitectureServiceImpl: DEBUG
```

## Support

For issues and questions:
- Create GitHub issues for bugs
- Check documentation for common solutions
- Contact development team for feature requests