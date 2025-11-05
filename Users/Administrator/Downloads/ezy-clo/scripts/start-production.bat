@echo off
echo Starting EzyCLO Card Benefits Platform...

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

REM Stop any existing containers
echo Stopping existing containers...
docker-compose down

REM Build and start all services
echo Building and starting services...
docker-compose up --build -d

REM Wait for services to be ready
echo Waiting for services to start...
timeout /t 30 /nobreak >nul

REM Check service health
echo Checking service health...
docker-compose ps

echo.
echo ========================================
echo EzyCLO Card Benefits Platform Started!
echo ========================================
echo.
echo Frontend:     http://localhost:3001
echo Backend API:  http://localhost:8081/api
echo Database:     localhost:3307
echo Redis:        localhost:6380
echo.
echo To view logs: docker-compose logs -f
echo To stop:      docker-compose down
echo.
echo Starting development tools...
docker-compose --profile tools up -d

echo.
echo Development Tools:
echo Database Admin: http://localhost:8082
echo Redis Admin:    http://localhost:8083
echo.

pause