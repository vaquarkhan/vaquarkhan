import React, { useState } from 'react';

interface IaCTemplate {
  id: string;
  name: string;
  provider: 'terraform' | 'cloudformation' | 'kubernetes' | 'docker-compose';
  description: string;
  template: string;
  variables: Record<string, any>;
}

interface InfrastructureCodeGeneratorProps {
  architecture: any;
  cloudProvider: string;
  onCodeGenerated: (code: IaCTemplate[]) => void;
}

const InfrastructureCodeGenerator: React.FC<InfrastructureCodeGeneratorProps> = ({
  architecture,
  cloudProvider,
  onCodeGenerated
}) => {
  const [selectedProvider, setSelectedProvider] = useState<string>('terraform');
  const [generatedTemplates, setGeneratedTemplates] = useState<IaCTemplate[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const providers = [
    { id: 'terraform', name: 'Terraform', icon: '🏗️', description: 'Multi-cloud infrastructure' },
    { id: 'cloudformation', name: 'CloudFormation', icon: '☁️', description: 'AWS native IaC' },
    { id: 'kubernetes', name: 'Kubernetes', icon: '⚓', description: 'Container orchestration' },
    { id: 'docker-compose', name: 'Docker Compose', icon: '🐳', description: 'Local development' }
  ];

  const generateInfrastructureCode = async () => {
    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const templates = generateTemplatesForProvider(selectedProvider, architecture, cloudProvider);
      setGeneratedTemplates(templates);
      onCodeGenerated(templates);
    } catch (error) {
      console.error('Failed to generate infrastructure code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateTemplatesForProvider = (provider: string, arch: any, cloud: string): IaCTemplate[] => {
    switch (provider) {
      case 'terraform':
        return generateTerraformTemplates(arch, cloud);
      case 'cloudformation':
        return generateCloudFormationTemplates(arch);
      case 'kubernetes':
        return generateKubernetesTemplates(arch);
      case 'docker-compose':
        return generateDockerComposeTemplates(arch);
      default:
        return [];
    }
  };

  const generateTerraformTemplates = (arch: any, cloud: string): IaCTemplate[] => [
    {
      id: 'main-tf',
      name: 'main.tf',
      provider: 'terraform',
      description: 'Main Terraform configuration',
      variables: { region: 'us-east-1', environment: 'production' },
      template: `# Terraform Configuration for ${arch?.name || 'Architecture'}
terraform {
  required_version = ">= 1.0"
  required_providers {
    ${cloud === 'aws' ? 'aws' : cloud === 'azure' ? 'azurerm' : 'google'} = {
      source  = "${cloud === 'aws' ? 'hashicorp/aws' : cloud === 'azure' ? 'hashicorp/azurerm' : 'hashicorp/google'}"
      version = "~> 5.0"
    }
  }
}

# Provider Configuration
${cloud === 'aws' ? `provider "aws" {
  region = var.aws_region
}` : cloud === 'azure' ? `provider "azurerm" {
  features {}
}` : `provider "google" {
  project = var.project_id
  region  = var.region
}`}

# Variables
variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "${cloud === 'aws' ? 'aws_region' : 'region'}" {
  description = "Region for resources"
  type        = string
  default     = "${cloud === 'aws' ? 'us-east-1' : cloud === 'azure' ? 'East US' : 'us-central1'}"
}

# VPC/Network Configuration
${cloud === 'aws' ? `resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = {
    Name        = "\${var.environment}-vpc"
    Environment = var.environment
  }
}

resource "aws_subnet" "public" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.\${count.index + 1}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]
  
  map_public_ip_on_launch = true
  
  tags = {
    Name = "\${var.environment}-public-subnet-\${count.index + 1}"
  }
}` : '# Network configuration for ' + cloud}

# Application Load Balancer
${cloud === 'aws' ? `resource "aws_lb" "main" {
  name               = "\${var.environment}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = aws_subnet.public[*].id
  
  enable_deletion_protection = false
  
  tags = {
    Environment = var.environment
  }
}` : '# Load balancer configuration'}

# Auto Scaling Group
${cloud === 'aws' ? `resource "aws_autoscaling_group" "app" {
  name                = "\${var.environment}-asg"
  vpc_zone_identifier = aws_subnet.public[*].id
  target_group_arns   = [aws_lb_target_group.app.arn]
  health_check_type   = "ELB"
  
  min_size         = 2
  max_size         = 10
  desired_capacity = 3
  
  launch_template {
    id      = aws_launch_template.app.id
    version = "$Latest"
  }
  
  tag {
    key                 = "Name"
    value               = "\${var.environment}-app-instance"
    propagate_at_launch = true
  }
}` : '# Auto scaling configuration'}

# Database
${cloud === 'aws' ? `resource "aws_db_instance" "main" {
  identifier = "\${var.environment}-database"
  
  engine         = "postgres"
  engine_version = "15.4"
  instance_class = "db.t3.micro"
  
  allocated_storage     = 20
  max_allocated_storage = 100
  storage_encrypted     = true
  
  db_name  = "appdb"
  username = "dbadmin"
  password = random_password.db_password.result
  
  vpc_security_group_ids = [aws_security_group.database.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  
  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  
  skip_final_snapshot = true
  
  tags = {
    Environment = var.environment
  }
}` : '# Database configuration'}

# Outputs
output "load_balancer_dns" {
  description = "DNS name of the load balancer"
  value       = ${cloud === 'aws' ? 'aws_lb.main.dns_name' : '"load-balancer-dns"'}
}

output "database_endpoint" {
  description = "Database endpoint"
  value       = ${cloud === 'aws' ? 'aws_db_instance.main.endpoint' : '"database-endpoint"'}
  sensitive   = true
}`
    },
    {
      id: 'security-tf',
      name: 'security.tf',
      provider: 'terraform',
      description: 'Security groups and IAM roles',
      variables: {},
      template: `# Security Groups
resource "aws_security_group" "alb" {
  name_prefix = "\${var.environment}-alb-"
  vpc_id      = aws_vpc.main.id
  
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = {
    Name = "\${var.environment}-alb-sg"
  }
}

resource "aws_security_group" "app" {
  name_prefix = "\${var.environment}-app-"
  vpc_id      = aws_vpc.main.id
  
  ingress {
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = {
    Name = "\${var.environment}-app-sg"
  }
}

resource "aws_security_group" "database" {
  name_prefix = "\${var.environment}-db-"
  vpc_id      = aws_vpc.main.id
  
  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.app.id]
  }
  
  tags = {
    Name = "\${var.environment}-db-sg"
  }
}

# Random password for database
resource "random_password" "db_password" {
  length  = 16
  special = true
}`
    }
  ];

  const generateKubernetesTemplates = (arch: any): IaCTemplate[] => [
    {
      id: 'deployment-yaml',
      name: 'deployment.yaml',
      provider: 'kubernetes',
      description: 'Kubernetes deployment configuration',
      variables: { replicas: 3, image: 'app:latest' },
      template: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-deployment
  labels:
    app: ${arch?.name?.toLowerCase() || 'myapp'}
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ${arch?.name?.toLowerCase() || 'myapp'}
  template:
    metadata:
      labels:
        app: ${arch?.name?.toLowerCase() || 'myapp'}
    spec:
      containers:
      - name: app
        image: ${arch?.name?.toLowerCase() || 'myapp'}:latest
        ports:
        - containerPort: 8080
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: app-service
spec:
  selector:
    app: ${arch?.name?.toLowerCase() || 'myapp'}
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
  type: LoadBalancer
---
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  database-url: <base64-encoded-database-url>
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: app-deployment
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80`
    }
  ];

  const generateCloudFormationTemplates = (arch: any): IaCTemplate[] => [
    {
      id: 'cloudformation-yaml',
      name: 'infrastructure.yaml',
      provider: 'cloudformation',
      description: 'AWS CloudFormation template',
      variables: { InstanceType: 't3.micro', Environment: 'production' },
      template: `AWSTemplateFormatVersion: '2010-09-09'
Description: 'Infrastructure for ${arch?.name || 'Application'}'

Parameters:
  Environment:
    Type: String
    Default: production
    Description: Environment name
  
  InstanceType:
    Type: String
    Default: t3.micro
    Description: EC2 instance type

Resources:
  # VPC
  VPC:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: 10.0.0.0/16
      EnableDnsHostnames: true
      EnableDnsSupport: true
      Tags:
        - Key: Name
          Value: !Sub '\${Environment}-vpc'

  # Internet Gateway
  InternetGateway:
    Type: AWS::EC2::InternetGateway
    Properties:
      Tags:
        - Key: Name
          Value: !Sub '\${Environment}-igw'

  # Attach Gateway
  AttachGateway:
    Type: AWS::EC2::VPCGatewayAttachment
    Properties:
      VpcId: !Ref VPC
      InternetGatewayId: !Ref InternetGateway

  # Public Subnets
  PublicSubnet1:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      CidrBlock: 10.0.1.0/24
      AvailabilityZone: !Select [0, !GetAZs '']
      MapPublicIpOnLaunch: true
      Tags:
        - Key: Name
          Value: !Sub '\${Environment}-public-subnet-1'

  PublicSubnet2:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      CidrBlock: 10.0.2.0/24
      AvailabilityZone: !Select [1, !GetAZs '']
      MapPublicIpOnLaunch: true
      Tags:
        - Key: Name
          Value: !Sub '\${Environment}-public-subnet-2'

  # Application Load Balancer
  ApplicationLoadBalancer:
    Type: AWS::ElasticLoadBalancingV2::LoadBalancer
    Properties:
      Name: !Sub '\${Environment}-alb'
      Scheme: internet-facing
      Type: application
      Subnets:
        - !Ref PublicSubnet1
        - !Ref PublicSubnet2
      SecurityGroups:
        - !Ref ALBSecurityGroup

  # Auto Scaling Group
  AutoScalingGroup:
    Type: AWS::AutoScaling::AutoScalingGroup
    Properties:
      AutoScalingGroupName: !Sub '\${Environment}-asg'
      VPCZoneIdentifier:
        - !Ref PublicSubnet1
        - !Ref PublicSubnet2
      LaunchTemplate:
        LaunchTemplateId: !Ref LaunchTemplate
        Version: !GetAtt LaunchTemplate.LatestVersionNumber
      MinSize: 2
      MaxSize: 10
      DesiredCapacity: 3
      TargetGroupARNs:
        - !Ref TargetGroup

  # RDS Database
  Database:
    Type: AWS::RDS::DBInstance
    Properties:
      DBInstanceIdentifier: !Sub '\${Environment}-database'
      DBInstanceClass: db.t3.micro
      Engine: postgres
      EngineVersion: '15.4'
      AllocatedStorage: 20
      StorageEncrypted: true
      DBName: appdb
      MasterUsername: dbadmin
      MasterUserPassword: !Ref DatabasePassword
      VPCSecurityGroups:
        - !Ref DatabaseSecurityGroup
      DBSubnetGroupName: !Ref DBSubnetGroup

Outputs:
  LoadBalancerDNS:
    Description: DNS name of the load balancer
    Value: !GetAtt ApplicationLoadBalancer.DNSName
    Export:
      Name: !Sub '\${Environment}-LoadBalancerDNS'

  DatabaseEndpoint:
    Description: Database endpoint
    Value: !GetAtt Database.Endpoint.Address
    Export:
      Name: !Sub '\${Environment}-DatabaseEndpoint'`
    }
  ];

  const generateDockerComposeTemplates = (arch: any): IaCTemplate[] => [
    {
      id: 'docker-compose-yml',
      name: 'docker-compose.yml',
      provider: 'docker-compose',
      description: 'Docker Compose for local development',
      variables: { appPort: 8080, dbPort: 5432 },
      template: `version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/appdb
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped
    networks:
      - app-network

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=appdb
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    restart: unless-stopped
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped
    networks:
      - app-network

volumes:
  postgres_data:
  redis_data:

networks:
  app-network:
    driver: bridge`
    }
  ];

  const downloadTemplate = (template: IaCTemplate) => {
    const blob = new Blob([template.template], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = template.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">
          🏗️ Infrastructure as Code Generator
        </h3>
        <button
          onClick={generateInfrastructureCode}
          disabled={isGenerating}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i>
              Generating...
            </>
          ) : (
            <>
              <i className="fas fa-code mr-2"></i>
              Generate IaC
            </>
          )}
        </button>
      </div>

      {/* Provider Selection */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {providers.map(provider => (
          <div
            key={provider.id}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              selectedProvider === provider.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => setSelectedProvider(provider.id)}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">{provider.icon}</div>
              <div className="font-semibold">{provider.name}</div>
              <div className="text-xs text-gray-500">{provider.description}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Generated Templates */}
      {generatedTemplates.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Generated Templates</h4>
          
          {/* Template Tabs */}
          <div className="flex space-x-2 border-b">
            {generatedTemplates.map((template, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
                  activeTab === index
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {template.name}
              </button>
            ))}
          </div>

          {/* Template Content */}
          {generatedTemplates[activeTab] && (
            <div className="bg-gray-900 text-white rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h5 className="font-semibold">{generatedTemplates[activeTab].name}</h5>
                  <p className="text-sm text-gray-400">{generatedTemplates[activeTab].description}</p>
                </div>
                <button
                  onClick={() => downloadTemplate(generatedTemplates[activeTab])}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                >
                  <i className="fas fa-download mr-1"></i>
                  Download
                </button>
              </div>
              <pre className="text-sm overflow-x-auto">
                <code>{generatedTemplates[activeTab].template}</code>
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InfrastructureCodeGenerator;