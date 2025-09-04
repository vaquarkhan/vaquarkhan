/**
 * Architecture Story Service
 * Handles API calls for the architecture story workflow
 */

class ArchitectureStoryService {
    constructor() {
        this.baseURL = 'http://localhost:8080/api';
    }

    /**
     * Generate architecture patterns based on BRD context and user preferences
     */
    async generateArchitecturePatterns(request) {
        try {
            const response = await fetch(`${this.baseURL}/architecture/generate-patterns`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error generating architecture patterns:', error);
            // Return mock data for demo purposes
            return this.getMockPatterns(request.cloudChoice);
        }
    }

    /**
     * Generate diagrams for selected architecture pattern
     */
    async generateDiagrams(request) {
        try {
            const response = await fetch(`${this.baseURL}/architecture/generate-diagrams`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error generating diagrams:', error);
            // Return mock diagrams
            return this.getMockDiagrams();
        }
    }

    /**
     * Generate code based on architecture and technology choices
     */
    async generateCode(request) {
        try {
            const response = await fetch(`${this.baseURL}/architecture/generate-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error generating code:', error);
            // Return mock code
            return this.getMockCode(request.language, request.framework);
        }
    }

    /**
     * Get cost estimation for architecture pattern
     */
    async getCostEstimation(patternId) {
        try {
            const response = await fetch(`${this.baseURL}/architecture/cost-estimation/${patternId}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error getting cost estimation:', error);
            return 300.0; // Default cost
        }
    }

    /**
     * Fetch BRD context for a project
     */
    async fetchBRDContext(projectId) {
        try {
            const response = await fetch(`${this.baseURL}/v1/projects/${projectId}/brd`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.text();
        } catch (error) {
            console.error('Error fetching BRD context:', error);
            return this.getMockBRD();
        }
    }

    /**
     * Mock data methods for demo purposes
     */
    getMockPatterns(cloudChoice) {
        const basePatterns = {
            aws: [
                {
                    id: 'aws-microservices',
                    name: 'AWS Microservices Architecture',
                    description: 'Scalable microservices architecture using AWS ECS, API Gateway, and RDS',
                    referenceLink: 'https://aws.amazon.com/microservices/',
                    estimatedCost: 450.0,
                    pros: ['High scalability', 'Service isolation', 'Technology diversity', 'Fault tolerance'],
                    cons: ['Complex deployment', 'Network latency', 'Data consistency challenges']
                },
                {
                    id: 'aws-serverless',
                    name: 'AWS Serverless Architecture',
                    description: 'Event-driven serverless architecture using Lambda, API Gateway, and DynamoDB',
                    referenceLink: 'https://aws.amazon.com/serverless/',
                    estimatedCost: 120.0,
                    pros: ['No server management', 'Auto-scaling', 'Pay per use', 'Fast deployment'],
                    cons: ['Cold starts', 'Vendor lock-in', 'Limited execution time']
                },
                {
                    id: 'aws-monolith',
                    name: 'AWS Monolithic Architecture',
                    description: 'Traditional monolithic application deployed on EC2 with RDS',
                    referenceLink: 'https://aws.amazon.com/getting-started/hands-on/deploy-app-ec2/',
                    estimatedCost: 280.0,
                    pros: ['Simple deployment', 'Easy debugging', 'Strong consistency', 'Lower latency'],
                    cons: ['Limited scalability', 'Technology lock-in', 'Single point of failure']
                }
            ],
            azure: [
                {
                    id: 'azure-microservices',
                    name: 'Azure Microservices Architecture',
                    description: 'Microservices using Azure Container Instances and Azure SQL',
                    referenceLink: 'https://docs.microsoft.com/en-us/azure/architecture/microservices/',
                    estimatedCost: 420.0,
                    pros: ['Azure integration', 'Container orchestration', 'Service mesh', 'Monitoring'],
                    cons: ['Complexity', 'Cost management', 'Service discovery']
                },
                {
                    id: 'azure-serverless',
                    name: 'Azure Functions Architecture',
                    description: 'Serverless architecture using Azure Functions and Cosmos DB',
                    referenceLink: 'https://docs.microsoft.com/en-us/azure/azure-functions/',
                    estimatedCost: 110.0,
                    pros: ['Event-driven', 'Auto-scaling', 'Cost-effective', 'Quick development'],
                    cons: ['Cold starts', 'Debugging complexity', 'Vendor dependency']
                }
            ],
            gcp: [
                {
                    id: 'gcp-microservices',
                    name: 'GCP Kubernetes Architecture',
                    description: 'Microservices on Google Kubernetes Engine with Cloud SQL',
                    referenceLink: 'https://cloud.google.com/kubernetes-engine/docs/concepts/kubernetes-engine-overview',
                    estimatedCost: 400.0,
                    pros: ['Kubernetes native', 'Auto-scaling', 'Load balancing', 'Service mesh'],
                    cons: ['Learning curve', 'Resource management', 'Networking complexity']
                },
                {
                    id: 'gcp-serverless',
                    name: 'Google Cloud Functions Architecture',
                    description: 'Serverless architecture using Cloud Functions and Firestore',
                    referenceLink: 'https://cloud.google.com/functions/docs',
                    estimatedCost: 100.0,
                    pros: ['Event-driven', 'No infrastructure', 'Automatic scaling', 'Pay per use'],
                    cons: ['Cold starts', 'Execution limits', 'Vendor lock-in']
                }
            ],
            'cloud-agnostic': [
                {
                    id: 'cloud-agnostic',
                    name: 'Cloud Agnostic Architecture',
                    description: 'Portable architecture using Docker containers and standard APIs',
                    referenceLink: 'https://kubernetes.io/docs/concepts/overview/what-is-kubernetes/',
                    estimatedCost: 350.0,
                    pros: ['Vendor independence', 'Portability', 'Cost optimization', 'Flexibility'],
                    cons: ['Additional abstraction', 'Performance overhead', 'Complexity']
                },
                {
                    id: 'containerized',
                    name: 'Containerized Architecture',
                    description: 'Docker-based containerized application with orchestration',
                    referenceLink: 'https://docs.docker.com/get-started/overview/',
                    estimatedCost: 300.0,
                    pros: ['Consistency', 'Scalability', 'Resource efficiency', 'DevOps friendly'],
                    cons: ['Container management', 'Security concerns', 'Storage complexity']
                }
            ],
            'on-premise': [
                {
                    id: 'on-premise',
                    name: 'On-Premise Architecture',
                    description: 'Traditional on-premise deployment with load balancers and databases',
                    referenceLink: 'https://en.wikipedia.org/wiki/On-premises_software',
                    estimatedCost: 200.0,
                    pros: ['Full control', 'Data sovereignty', 'No cloud costs', 'Customization'],
                    cons: ['Infrastructure management', 'Scaling challenges', 'Maintenance overhead']
                },
                {
                    id: 'hybrid',
                    name: 'Hybrid Cloud Architecture',
                    description: 'Hybrid deployment combining on-premise and cloud resources',
                    referenceLink: 'https://aws.amazon.com/hybrid/',
                    estimatedCost: 380.0,
                    pros: ['Flexibility', 'Gradual migration', 'Data control', 'Cost optimization'],
                    cons: ['Complexity', 'Network latency', 'Security challenges']
                }
            ]
        };

        return basePatterns[cloudChoice] || [
            {
                id: 'generic',
                name: 'Generic Web Architecture',
                description: 'Standard three-tier web application architecture',
                referenceLink: 'https://en.wikipedia.org/wiki/Multitier_architecture',
                estimatedCost: 250.0,
                pros: ['Simple', 'Well understood', 'Easy to implement', 'Cost effective'],
                cons: ['Limited scalability', 'Monolithic', 'Single point of failure']
            }
        ];
    }

    getMockDiagrams() {
        return {
            architectureDiagram: `
graph TD
    A[User] --> B[Load Balancer]
    B --> C[Web Server]
    C --> D[Application Server]
    D --> E[Database]
    D --> F[Cache]
    D --> G[Message Queue]
            `,
            sequenceDiagram: `
sequenceDiagram
    participant U as User
    participant W as Web Server
    participant A as App Server
    participant D as Database
    U->>W: HTTP Request
    W->>A: Process Request
    A->>D: Query Data
    D-->>A: Return Data
    A-->>W: Response
    W-->>U: HTTP Response
            `,
            erDiagram: `
erDiagram
    USER {
        int id PK
        string name
        string email
        datetime created_at
    }
    PROJECT {
        int id PK
        string name
        string description
        int user_id FK
        datetime created_at
    }
    STORY {
        int id PK
        string title
        text description
        int project_id FK
        string status
        datetime created_at
    }
    USER ||--o{ PROJECT : owns
    PROJECT ||--o{ STORY : contains
            `
        };
    }

    getMockCode(language, framework) {
        const codeTemplates = {
            java: {
                'Spring Boot': {
                    'Application.java': `@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}`,
                    'Controller.java': `@RestController
@RequestMapping("/api")
public class ApiController {
    
    @Autowired
    private ApiService apiService;
    
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("OK");
    }
    
    @GetMapping("/data")
    public ResponseEntity<List<Data>> getData() {
        List<Data> data = apiService.getAllData();
        return ResponseEntity.ok(data);
    }
}`,
                    'Service.java': `@Service
public class ApiService {
    
    @Autowired
    private DataRepository dataRepository;
    
    public List<Data> getAllData() {
        return dataRepository.findAll();
    }
    
    public Data saveData(Data data) {
        return dataRepository.save(data);
    }
}`,
                    'pom.xml': `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.example</groupId>
    <artifactId>demo</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <packaging>jar</packaging>
    
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
    </dependencies>
</project>`
                }
            },
            javascript: {
                'Node.js + Express': {
                    'app.js': `const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'API Server Running' });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/data', (req, res) => {
    // Mock data
    const data = [
        { id: 1, name: 'Item 1', description: 'First item' },
        { id: 2, name: 'Item 2', description: 'Second item' }
    ];
    res.json(data);
});

app.listen(port, () => {
    console.log(\`Server running on port \${port}\`);
});`,
                    'package.json': `{
  "name": "api-server",
  "version": "1.0.0",
  "description": "Generated API server",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  },
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "nodemon": "^2.0.20"
  }
}`,
                    'routes/api.js': `const express = require('express');
const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Data endpoints
router.get('/data', (req, res) => {
    // In a real app, this would fetch from database
    const data = [
        { id: 1, name: 'Sample Data 1' },
        { id: 2, name: 'Sample Data 2' }
    ];
    res.json(data);
});

router.post('/data', (req, res) => {
    const newData = req.body;
    // In a real app, this would save to database
    res.status(201).json({ id: Date.now(), ...newData });
});

module.exports = router;`
                }
            },
            python: {
                'Django': {
                    'manage.py': `#!/usr/bin/env python
import os
import sys

if __name__ == '__main__':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)`,
                    'views.py': `from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
import json

class HealthView(View):
    def get(self, request):
        return JsonResponse({'status': 'OK'})

class DataView(View):
    def get(self, request):
        # Mock data
        data = [
            {'id': 1, 'name': 'Item 1', 'description': 'First item'},
            {'id': 2, 'name': 'Item 2', 'description': 'Second item'}
        ]
        return JsonResponse({'data': data})
    
    @method_decorator(csrf_exempt)
    def post(self, request):
        try:
            data = json.loads(request.body)
            # In a real app, save to database
            return JsonResponse({'id': 1, **data}, status=201)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)`,
                    'models.py': `from django.db import models

class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True

class DataModel(BaseModel):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.name`,
                    'requirements.txt': `Django==4.2.0
djangorestframework==3.14.0
psycopg2-binary==2.9.0
python-decouple==3.8
gunicorn==20.1.0`
                }
            },
            csharp: {
                '.NET Core': {
                    'Program.cs': `var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();`,
                    'Controllers/HealthController.cs': `using Microsoft.AspNetCore.Mvc;

namespace ApiServer.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new { Status = "OK", Timestamp = DateTime.UtcNow });
    }
}`,
                    'Controllers/DataController.cs': `using Microsoft.AspNetCore.Mvc;

namespace ApiServer.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DataController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        var data = new[]
        {
            new { Id = 1, Name = "Item 1", Description = "First item" },
            new { Id = 2, Name = "Item 2", Description = "Second item" }
        };
        return Ok(data);
    }
    
    [HttpPost]
    public IActionResult Post([FromBody] dynamic data)
    {
        // In a real app, save to database
        return CreatedAtAction(nameof(Get), new { id = 1 }, data);
    }
}`,
                    'appsettings.json': `{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=ApiDb;Trusted_Connection=true;"
  }
}`
                }
            }
        };

        return {
            language,
            framework,
            files: codeTemplates[language]?.[framework] || {
                'README.md': `# Generated Code for ${language} + ${framework}

This is a generated code template for your architecture.
Please customize it according to your specific requirements.

## Getting Started

1. Install dependencies
2. Configure your database
3. Run the application

## Architecture

This code follows the selected architecture pattern and implements:
- RESTful API endpoints
- Data models
- Service layer
- Configuration files

## Next Steps

- Add authentication
- Implement business logic
- Add tests
- Setup CI/CD pipeline`
            }
        };
    }

    getMockBRD() {
        return `Business Requirements Document
================================

Project: Sample Application
Description: A modern web application with user management and data processing capabilities

Functional Requirements:
- User authentication and authorization
- Data management and storage
- API endpoints for CRUD operations
- Real-time notifications
- Reporting and analytics

Non-Functional Requirements:
- Performance: Response time < 2 seconds
- Scalability: Support 1000+ concurrent users
- Security: Data encryption and secure authentication
- Availability: 99.9% uptime
- Compatibility: Cross-browser support

Technical Constraints:
- Must be cloud-deployable
- RESTful API architecture
- Database agnostic design
- Mobile-responsive interface`;
    }

    /**
     * Utility method to simulate API delay
     */
    async simulateDelay(ms = 1000) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ArchitectureStoryService;
} else if (typeof window !== 'undefined') {
    window.ArchitectureStoryService = ArchitectureStoryService;
}