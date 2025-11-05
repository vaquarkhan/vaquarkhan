# Card Linked Benefits Platform

A comprehensive banking application that enables issuer banks to manage and deliver personalized card benefits and offers to their customers. The system integrates with multiple payment schemes (Mastercard, Visa), supports various SSO providers, and provides a highly configurable admin system.

## 🏗️ Architecture

- **Frontend**: React.js with TypeScript, Tailwind CSS, and Vite
- **Backend**: Java Spring Boot with microservices architecture
- **Database**: MySQL for transactional data, Redis for caching
- **Deployment**: Docker containers with Docker Compose orchestration

## 🚀 Quick Start

### Prerequisites

- Docker Desktop
- Node.js 18+ (for local development)
- Java 17+ (for local development)
- Git

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ezy-clo
   ```

2. **Create environment configuration**
   ```bash
   copy .env.example .env
   ```
   Update the `.env` file with your configuration.

3. **Start the development environment**
   ```bash
   # Windows
   scripts\start-production.bat
   
   # Or manually with Docker Compose
   docker-compose up --build -d
   ```

4. **Access the applications**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:8081/api
   - Database Admin (Adminer): http://localhost:8082
   - Redis Admin: http://localhost:8083

### Development Tools

To start development tools (Adminer, Redis Commander):
```bash
docker-compose --profile tools up -d
```

### Quick Start Scripts

**Windows:**
- Start platform: `scripts\start-production.bat`
- Stop platform: `scripts\stop-all.bat`

**Manual Docker Commands:**
```bash
# Start all services
docker-compose up --build -d

# Start with development tools
docker-compose --profile tools up --build -d

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## 📁 Project Structure

```
card-linked-benefits-platform/
├── frontend/                 # React.js frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── auth/        # Authentication components
│   │   │   ├── dashboard/   # Dashboard components
│   │   │   ├── offers/      # Offer management components
│   │   │   └── admin/       # Admin console components
│   │   ├── i18n/           # Internationalization (EN/AR)
│   │   └── types/          # TypeScript type definitions
│   ├── Dockerfile
│   └── nginx.conf
├── backend/                 # Spring Boot backend application
│   ├── src/main/java/com/cardlinked/benefits/
│   │   ├── auth/           # Authentication services
│   │   ├── offers/         # Offer management services
│   │   ├── analytics/      # Analytics services
│   │   ├── admin/          # Admin services
│   │   └── config/         # Configuration classes
│   ├── Dockerfile
│   └── pom.xml
├── database/               # Database configuration and scripts
│   ├── init/              # Database initialization scripts
│   ├── config/            # MySQL configuration
│   └── redis/             # Redis configuration
├── scripts/               # Utility scripts
└── docker-compose.yml     # Docker orchestration
```

## 🔧 Configuration

### Environment Variables

Key environment variables (see `.env.example` for complete list):

- `DB_HOST`, `DB_PORT`, `DB_NAME` - Database connection
- `REDIS_HOST`, `REDIS_PORT` - Redis connection
- `JWT_SECRET` - JWT token secret (256-bit)
- `MASTERCARD_API_ENDPOINT` - Mastercard API configuration
- `VISA_API_ENDPOINT` - Visa API configuration

### Database Schema

The application uses a comprehensive database schema with:
- Customer golden records (ExyCLO methodology)
- Offer management with configurable rules
- Transaction ledger with audit trails
- Approval workflow (maker-checker-approver)
- Bank partner configurations

## 🔐 Security Features

- **PCI DSS Compliance**: Tokenization of sensitive card data
- **JWT Authentication**: Stateless authentication with configurable SSO
- **Data Encryption**: AES-256 encryption for data at rest, TLS 1.3 for data in transit
- **Input Validation**: Comprehensive sanitization and validation
- **Audit Trail**: Complete logging for compliance and monitoring
- **Rate Limiting**: API protection against abuse

## 🌐 Multi-Language Support

The platform supports English and Arabic languages:
- RTL (Right-to-Left) support for Arabic
- Localized content management
- Dynamic language switching

## 📊 Admin Features

- **Offer Management**: Create, modify, and manage offers with visual rule builder
- **Bank Integration**: Configure multiple bank partners and SSO providers
- **Rules Engine**: Define eligibility rules without code changes
- **Analytics Dashboard**: Real-time performance metrics and insights
- **Approval Workflow**: Maker-checker-approver process for all changes
- **Audit Trail**: Comprehensive compliance reporting

## 🔄 Development Workflow

### Running Tests

```bash
# Backend tests
cd backend
mvn test

# Frontend tests
cd frontend
npm test
```

### Building for Production

```bash
# Build all services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Deploy to production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Database Management

```bash
# Reset database (development only)
docker-compose down -v
docker-compose up -d

# Backup database
docker-compose exec mysql mysqldump -u benefits_user -p card_benefits_platform > backup.sql

# Restore database
docker-compose exec -T mysql mysql -u benefits_user -p card_benefits_platform < backup.sql
```

## 🚀 Deployment

### Production Deployment

1. **Update environment variables** for production
2. **Configure SSL certificates** in the nginx directory
3. **Set up monitoring** with Prometheus and Grafana
4. **Configure backup strategy** for database and Redis

### Scaling

The application supports horizontal scaling:
- Multiple backend instances behind load balancer
- Database read replicas for improved performance
- Redis clustering for high availability

## 📈 Monitoring

- **Health Checks**: Built-in health endpoints for all services
- **Metrics**: Prometheus metrics for monitoring
- **Logging**: Centralized logging with ELK stack
- **Alerting**: Configurable alerts for system health

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is proprietary software for banking institutions.

## 🆘 Support

For support and questions:
- Check the documentation in `/docs`
- Review the troubleshooting guide
- Contact the development team

---

**Note**: This is a banking application handling sensitive financial data. Ensure all security best practices are followed and compliance requirements are met before deployment.