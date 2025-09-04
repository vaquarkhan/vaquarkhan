# 🚀 TurboAgile Enhanced - Full-Stack Development Platform

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Version](https://img.shields.io/badge/Version-2.0.0-green.svg)](https://github.com/vaquarkhan/TurboAgile-Agentic-AI-MCP)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)](https://github.com/vaquarkhan/TurboAgile-Agentic-AI-MCP)

> **Enhanced AI-native platform with Spring Boot backend, PostgreSQL database, and advanced story management for 100x engineering productivity.**

## 🌟 **What's New in Version 2.0**

### 🏗️ **Full-Stack Architecture**
- **Spring Boot Backend**: Enterprise-grade Java backend with RESTful APIs
- **PostgreSQL Database**: Robust relational database with Docker support
- **Enhanced Frontend**: React/TypeScript with advanced story management
- **Docker Integration**: Complete containerized development environment

### 📋 **Advanced Story Management**
- **Jira Scrum Integration**: Full Scrum methodology support
- **Story Types**: Story, Bug, Task, Epic with proper categorization
- **Story Points**: Fibonacci scale estimation (1, 2, 3, 5, 8, 13, 21)
- **Sprint Management**: Plan, track, and manage sprints effectively
- **Advanced Filtering**: Search, filter by status, type, and priority

### 🎯 **Architecture Wizard**
- **Interactive Wizard**: Step-by-step architecture creation
- **Multiple Diagram Types**: System, Component, Sequence, ER, Data Flow
- **AI-Powered Generation**: Intelligent diagram creation based on requirements
- **Compliance Support**: Built-in support for GDPR, HIPAA, SOX, PCI DSS

## 🚀 **Quick Start**

### **Prerequisites**
- Docker and Docker Compose
- Java 17 or higher
- Node.js 16 or higher
- Maven 3.6 or higher

### **1. Clone and Setup**
```bash
git clone https://github.com/vaquarkhan/TurboAgile-Agentic-AI-MCP.git
cd TurboAgile-Agentic-AI-MCP
```

### **2. Start the Backend Services**
```bash
# Start PostgreSQL and Spring Boot backend
docker-compose up -d

# Wait for services to be ready (check logs)
docker-compose logs -f
```

### **3. Start the Frontend**
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### **4. Access the Application**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api
- **Swagger Docs**: http://localhost:8080/api/swagger-ui.html
- **Database**: localhost:5432 (turboagile/turboagile123)

## 🔧 **Detailed Application Setup & Startup Guide**

### **Step-by-Step Application Startup**

#### **Option 1: Automated Startup (Recommended)**

**For Windows:**
```cmd
# Run the automated startup script
start.bat

# Or manually execute each step:
# 1. Check prerequisites
docker --version
docker-compose --version
java -version
node --version
npm --version

# 2. Start Docker services
docker-compose up -d

# 3. Wait for services to be ready
timeout /t 30 /nobreak
# Or manually wait until you see "Started TurboAgileApplication" in logs

# 4. Install frontend dependencies
npm install

# 5. Start frontend development server
npm run dev
```

**For Linux/Mac:**
```bash
# Run the automated startup script
chmod +x start.sh
./start.sh

# Or manually execute each step:
# 1. Check prerequisites
docker --version
docker-compose --version
java -version
node --version
npm --version

# 2. Start Docker services
docker-compose up -d

# 3. Wait for services to be ready
sleep 30
# Or manually wait until you see "Started TurboAgileApplication" in logs

# 4. Install frontend dependencies
npm install

# 5. Start frontend development server
npm run dev
```

#### **Option 2: Manual Step-by-Step Startup**

**Phase 1: Environment Verification**
```bash
# Verify Docker installation
docker --version
docker-compose --version

# Verify Java installation
java -version
javac -version

# Verify Node.js installation
node --version
npm --version

# Verify Maven installation
mvn --version
# Or use Maven wrapper
./backend/mvnw --version
```

**Phase 2: Database & Backend Startup**
```bash
# Navigate to project root
cd TurboAgile-Agentic-AI-MCP

# Start PostgreSQL database
docker-compose up postgres -d

# Wait for database to be ready (check logs)
docker-compose logs postgres

# Verify database connection
docker exec -it turboagile-postgres psql -U turboagile -d turboagile -c "\l"

# Start Spring Boot backend
docker-compose up spring-backend -d

# Monitor backend startup
docker-compose logs -f spring-backend

# Wait for backend to be ready (look for "Started TurboAgileApplication")
# This typically takes 30-60 seconds
```

**Phase 3: Frontend Startup**
```bash
# Install frontend dependencies
npm install

# Verify all dependencies are installed
npm list --depth=0

# Start development server
npm run dev

# The frontend will be available at http://localhost:5173
```

**Phase 4: Verification & Testing**
```bash
# Check all services are running
docker-compose ps

# Test backend health
curl http://localhost:8080/api/actuator/health

# Test database connection
curl http://localhost:8080/api/projects

# Check frontend is accessible
curl http://localhost:5173
```

### **Troubleshooting Common Startup Issues**

#### **Docker Issues**
```bash
# If Docker services fail to start
docker-compose down
docker system prune -f
docker-compose up -d

# Check Docker logs
docker-compose logs

# Restart Docker service (Windows)
net stop docker
net start docker

# Restart Docker service (Linux/Mac)
sudo systemctl restart docker
```

#### **Database Connection Issues**
```bash
# Check PostgreSQL status
docker-compose logs postgres

# Reset database (WARNING: This will delete all data)
docker-compose down -v
docker-compose up -d

# Check database connectivity
docker exec -it turboagile-postgres psql -U turboagile -d turboagile -c "SELECT version();"
```

#### **Backend Startup Issues**
```bash
# Check Spring Boot logs
docker-compose logs spring-backend

# Verify Java version compatibility
docker exec turboagile-spring-backend java -version

# Check application configuration
docker exec turboagile-spring-backend cat /app/application.yml

# Restart backend service
docker-compose restart spring-backend
```

#### **Frontend Issues**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for port conflicts
netstat -an | grep 5173
# Or on Windows:
netstat -an | findstr 5173

# Use different port if needed
npm run dev -- --port 3000
```

### **Service Status Commands**

```bash
# Check all running services
docker-compose ps

# View service logs
docker-compose logs -f [service-name]

# Check service health
docker-compose exec spring-backend curl localhost:8080/api/actuator/health

# Monitor resource usage
docker stats

# Check network connectivity
docker network ls
docker network inspect turboagile_turboagile-network
```

### **Development Workflow Commands**

```bash
# Backend development
cd backend
./mvnw spring-boot:run

# Frontend development
npm run dev

# Build for production
npm run build

# Run tests
npm test
./backend/mvnw test

# Database management
docker-compose exec postgres psql -U turboagile -d turboagile

# API testing
curl -X GET http://localhost:8080/api/projects
curl -X POST http://localhost:8080/api/projects -H "Content-Type: application/json" -d '{"name":"Test Project","description":"Test Description"}'
```

### **Environment Variables & Configuration**

```bash
# Check current environment
echo $JAVA_HOME
echo $PATH

# Set Java home if needed (Windows)
set JAVA_HOME=C:\Program Files\Java\jdk-17

# Set Java home if needed (Linux/Mac)
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk
export PATH=$JAVA_HOME/bin:$PATH

# Check Docker environment
docker info

# Verify Docker Compose version
docker-compose version
```

### **Performance Optimization Commands**

```bash
# Increase Docker memory (Windows)
# Edit Docker Desktop settings: Resources > Memory > 8GB+

# Increase Docker memory (Linux/Mac)
# Edit /etc/docker/daemon.json
{
  "default-shm-size": "2G",
  "storage-driver": "overlay2"
}

# Restart Docker after changes
sudo systemctl restart docker

# Monitor application performance
docker stats --no-stream
docker-compose exec spring-backend jstat -gc 1
```

## 🏗️ **Architecture Overview**

### **System Architecture**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Spring Boot   │    │   PostgreSQL    │
│   (React/TS)    │◄──►│   Backend       │◄──►│   Database      │
│   Port: 5173    │    │   Port: 8080    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Technology Stack**

#### **Frontend**
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for modern UI components
- **React Hooks** for state management

#### **Backend**
- **Spring Boot 3.2** with Java 17
- **Spring Data JPA** for database operations
- **Spring Security** for authentication
- **PostgreSQL** with advanced indexing
- **Docker** for containerization

#### **Database Schema**
- **Organizations**: Multi-tenant support
- **Projects**: Project management and organization
- **Stories**: Jira-compatible user stories
- **Sprints**: Scrum sprint management
- **Architecture Diagrams**: Various diagram types
- **Connectors**: External tool integrations

## 📋 **Story Management Features**

### **Jira Scrum Integration**
- **Story Types**: Story, Bug, Task, Epic
- **Status Workflow**: Backlog → To-Do → In-Progress → Review → Done
- **Priority Levels**: Low, Medium, High, Critical
- **Story Points**: Fibonacci estimation scale
- **Sprint Assignment**: Link stories to sprints
- **Epic Linking**: Organize stories under epics

### **Advanced Features**
- **Real-time Updates**: Instant status changes
- **Advanced Filtering**: Multi-criteria search and filtering
- **Bulk Operations**: Mass story updates
- **History Tracking**: Complete audit trail
- **Export Options**: Multiple format support

## 🏗️ **Architecture Wizard**

### **Wizard Steps**
1. **Project Information**: Basic project details and description
2. **Architecture Type**: Choose diagram type and purpose
3. **Technical Details**: Technology stack and deployment model
4. **Security & Compliance**: Security requirements and standards
5. **Integration & APIs**: External system integration needs

### **Supported Diagram Types**
- **System Architecture**: High-level system overview
- **Component Diagram**: Detailed component relationships
- **Sequence Diagram**: Process flow and interactions
- **Entity Relationship**: Database schema design
- **Data Flow Diagram**: Information flow visualization
- **Network Topology**: Infrastructure layout
- **Deployment Diagram**: Runtime deployment view
- **Class Diagram**: Object-oriented design

### **AI-Powered Generation**
- **Intelligent Components**: Automatic component detection
- **Technology Mapping**: Smart technology stack mapping
- **Security Integration**: Built-in security patterns
- **Compliance Templates**: Pre-built compliance frameworks

## 🔧 **Development Setup**

### **Backend Development**
```bash
cd backend

# Run with Maven
./mvnw spring-boot:run

# Or build and run
./mvnw clean package
java -jar target/turboagile-backend-1.0.0.jar
```

### **Frontend Development**
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check
```

### **Database Management**
```bash
# Access PostgreSQL
docker exec -it turboagile-postgres psql -U turboagile -d turboagile

# View logs
docker-compose logs postgres

# Reset database
docker-compose down -v
docker-compose up -d
```

## 📊 **API Endpoints**

### **Core APIs**
```
GET    /api/projects                    # List projects
POST   /api/projects                    # Create project
GET    /api/projects/{id}              # Get project details
PUT    /api/projects/{id}              # Update project
DELETE /api/projects/{id}              # Delete project

GET    /api/projects/{id}/stories      # List project stories
POST   /api/projects/{id}/stories      # Create story
PUT    /api/projects/{id}/stories/{id} # Update story
DELETE /api/projects/{id}/stories/{id} # Delete story

GET    /api/projects/{id}/sprints      # List project sprints
POST   /api/projects/{id}/sprints      # Create sprint
PUT    /api/projects/{id}/sprints/{id} # Update sprint

GET    /api/projects/{id}/architecture-diagrams  # List diagrams
POST   /api/projects/{id}/architecture-diagrams  # Create diagram
```

### **Authentication**
```
POST   /api/auth/login                  # User login
POST   /api/auth/register              # User registration
POST   /api/auth/refresh               # Refresh token
POST   /api/auth/logout                # User logout
```

## 🐳 **Docker Configuration**

### **Services**
- **PostgreSQL 15**: Production-ready database
- **Spring Boot**: Java backend application
- **Custom Networks**: Isolated container communication
- **Volume Persistence**: Data persistence across restarts

### **Environment Variables**
```env
# Database
POSTGRES_DB=turboagile
POSTGRES_USER=turboagile
POSTGRES_PASSWORD=turboagile123

# Spring Boot
SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/turboagile
SPRING_DATASOURCE_USERNAME=turboagile
SPRING_DATASOURCE_PASSWORD=turboagile123
```

## 🔒 **Security Features**

### **Authentication & Authorization**
- **JWT Tokens**: Secure stateless authentication
- **Role-based Access**: User, Developer, Manager, Admin roles
- **Password Hashing**: BCrypt password encryption
- **Session Management**: Secure session handling

### **Data Protection**
- **Input Validation**: Comprehensive input sanitization
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Cross-site scripting prevention
- **CORS Configuration**: Controlled cross-origin access

## 📈 **Performance & Scalability**

### **Database Optimization**
- **Indexing Strategy**: Optimized query performance
- **Connection Pooling**: Efficient database connections
- **Query Optimization**: Optimized SQL queries
- **Caching Layer**: Redis integration ready

### **Application Performance**
- **Async Processing**: Non-blocking operations
- **Connection Pooling**: Database connection management
- **Response Caching**: API response caching
- **Load Balancing**: Horizontal scaling support

## 🧪 **Testing Strategy**

### **Backend Testing**
```bash
cd backend

# Unit tests
./mvnw test

# Integration tests
./mvnw verify

# Test coverage
./mvnw jacoco:report
```

### **Frontend Testing**
```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:coverage
```

## 🚀 **Deployment**

### **Production Deployment**
```bash
# Build and deploy
docker-compose -f docker-compose.prod.yml up -d

# Environment-specific configs
cp .env.production .env
docker-compose up -d
```

### **Cloud Deployment**
- **AWS**: ECS, EKS, RDS
- **Azure**: Container Instances, AKS, Azure SQL
- **GCP**: Cloud Run, GKE, Cloud SQL
- **Kubernetes**: Full K8s deployment support

## 📚 **Documentation**

### **API Documentation**
- **Swagger UI**: Interactive API documentation
- **OpenAPI Spec**: Machine-readable API specification
- **Postman Collection**: Ready-to-use API testing
- **Code Examples**: Multiple language examples

### **User Guides**
- **Story Management**: Complete story workflow guide
- **Architecture Wizard**: Step-by-step wizard usage
- **API Integration**: External system integration
- **Admin Guide**: System administration

## 🤝 **Contributing**

### **Development Workflow**
1. Fork the repository
2. Create a feature branch
3. Follow coding standards
4. Add tests for new features
5. Submit a pull request

### **Code Standards**
- **Java**: Google Java Style Guide
- **TypeScript**: ESLint + Prettier
- **Database**: PostgreSQL best practices
- **API**: RESTful API design principles

## 📞 **Support & Community**

### **Getting Help**
- **Documentation**: Comprehensive guides and tutorials
- **Issues**: GitHub issue tracking
- **Discussions**: Community forum
- **Email**: enterprise@turboagile.ai

### **Community**
- **Discord**: Real-time chat and support
- **GitHub**: Code collaboration and issues
- **Stack Overflow**: Q&A community
- **Blog**: Latest updates and tutorials

## 🔮 **Roadmap**

### **Q1 2024**
- [x] Spring Boot backend implementation
- [x] PostgreSQL database integration
- [x] Advanced story management
- [x] Architecture wizard
- [ ] Real-time collaboration
- [ ] Advanced analytics

### **Q2 2024**
- [ ] AI-powered code generation
- [ ] Advanced workflow automation
- [ ] Mobile application
- [ ] Enterprise SSO integration

### **Q3 2024**
- [ ] Multi-language support
- [ ] Advanced security features
- [ ] Performance optimization
- [ ] Global deployment

## 📄 **License**

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Spring Team**: For the excellent Spring Boot framework
- **PostgreSQL Community**: For the robust database system
- **React Team**: For the powerful frontend framework
- **Open Source Community**: For inspiration and tools

---

**Ready to transform your development workflow?** [Start building with TurboAgile Enhanced today!](https://turboagile.ai)

*Built with ❤️ by the TurboAgile team*


