@echo off
echo Stopping EzyCLO Card Benefits Platform...

REM Stop all containers and remove volumes
docker-compose --profile tools down
docker-compose down -v

echo.
echo Platform stopped successfully!
echo All containers and volumes have been removed.
echo.

pause