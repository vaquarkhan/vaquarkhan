@echo off
chcp 65001 >nul
echo 🚀 Starting TurboAgile Enhanced...
echo ==================================

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker and try again.
    pause
    exit /b 1
)

REM Check if Docker Compose is available
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose and try again.
    pause
    exit /b 1
)

REM Check if Node.js is available
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js and try again.
    pause
    exit /b 1
)

REM Check if Java is available
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Java is not installed. Please install Java 17+ and try again.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed!

REM Start backend services
echo 🐳 Starting PostgreSQL and Spring Boot backend...
docker-compose up -d

REM Wait for services to be ready
echo ⏳ Waiting for services to be ready...
timeout /t 10 /nobreak >nul

REM Check if services are running
docker-compose ps | findstr "Up" >nul
if %errorlevel% neq 0 (
    echo ❌ Failed to start services. Check logs with: docker-compose logs
    pause
    exit /b 1
)

echo ✅ Backend services started successfully!

REM Install frontend dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing frontend dependencies...
    npm install
)

echo 🌐 Starting frontend development server...
echo.
echo 🎯 Application URLs:
echo    Frontend: http://localhost:5173
echo    Backend API: http://localhost:8080/api
echo    Swagger Docs: http://localhost:8080/api/swagger-ui.html
echo    Database: localhost:5432
echo.
echo 📋 Default credentials:
echo    Username: admin
echo    Password: admin123
echo.
echo 🔄 To stop the application, close this window and run: docker-compose down
echo.

REM Start frontend
npm run dev

pause


