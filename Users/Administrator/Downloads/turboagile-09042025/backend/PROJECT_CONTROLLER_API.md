# Project Controller API Documentation

## Overview
The Project Controller provides RESTful API endpoints for managing projects within the TurboAgile system. It supports CRUD operations, project lifecycle management, and various query operations.

## Base URL
```
/api/v1/projects
```

## Authentication
All endpoints require proper authentication (to be implemented based on your security configuration).

## Endpoints

### 1. Create Project
- **POST** `/api/v1/projects`
- **Description**: Creates a new project
- **Request Body**: Project object
- **Response**: 201 Created with the created project
- **Example**:
```json
{
  "name": "My New Project",
  "description": "A sample project description",
  "key": "MNP",
  "organization": {
    "id": "uuid-here"
  }
}
```

### 2. Get Project by ID
- **GET** `/api/v1/projects/{id}`
- **Description**: Retrieves a project by its unique identifier
- **Path Parameters**: `id` (UUID)
- **Response**: 200 OK with project data or 404 Not Found

### 3. Get Project by Key
- **GET** `/api/v1/projects/key/{key}`
- **Description**: Retrieves a project by its key
- **Path Parameters**: `key` (String)
- **Response**: 200 OK with project data or 404 Not Found

### 4. Get Projects by Organization
- **GET** `/api/v1/projects/organization/{organizationId}`
- **Description**: Retrieves all projects for a specific organization with pagination
- **Path Parameters**: `organizationId` (UUID)
- **Query Parameters**: Standard pagination parameters (page, size, sort)
- **Response**: 200 OK with paginated project data

### 5. Get All Projects by Organization
- **GET** `/api/v1/projects/organization/{organizationId}/all`
- **Description**: Retrieves all projects for a specific organization as a list
- **Path Parameters**: `organizationId` (UUID)
- **Response**: 200 OK with list of projects

### 6. Get Active Projects by Organization
- **GET** `/api/v1/projects/organization/{organizationId}/active`
- **Description**: Retrieves active projects for a specific organization
- **Path Parameters**: `organizationId` (UUID)
- **Response**: 200 OK with list of active projects

### 7. Get Projects by Status
- **GET** `/api/v1/projects/status/{status}`
- **Description**: Retrieves projects by status
- **Path Parameters**: `status` (ProjectStatus enum)
- **Response**: 200 OK with list of projects

### 8. Get Projects by Organization and Status
- **GET** `/api/v1/projects/organization/{organizationId}/status/{status}`
- **Description**: Retrieves projects by organization and status
- **Path Parameters**: 
  - `organizationId` (UUID)
  - `status` (ProjectStatus enum)
- **Response**: 200 OK with list of projects

### 9. Get Overdue Projects
- **GET** `/api/v1/projects/overdue`
- **Description**: Retrieves projects with overdue end dates
- **Response**: 200 OK with list of overdue projects

### 10. Get Projects by Tag
- **GET** `/api/v1/projects/tag/{tag}`
- **Description**: Retrieves projects by tag
- **Path Parameters**: `tag` (String)
- **Response**: 200 OK with list of projects

### 11. Get High Priority Projects
- **GET** `/api/v1/projects/high-priority`
- **Description**: Retrieves high priority projects
- **Response**: 200 OK with list of high priority projects

### 12. Update Project
- **PUT** `/api/v1/projects/{id}`
- **Description**: Updates an existing project
- **Path Parameters**: `id` (UUID)
- **Request Body**: Updated project object
- **Response**: 200 OK with updated project

### 13. Delete Project
- **DELETE** `/api/v1/projects/{id}`
- **Description**: Soft deletes a project (sets status to CANCELLED)
- **Path Parameters**: `id` (UUID)
- **Response**: 204 No Content

### 14. Start Project
- **POST** `/api/v1/projects/{id}/start`
- **Description**: Starts a project (changes status to ACTIVE)
- **Path Parameters**: `id` (UUID)
- **Response**: 200 OK with started project

### 15. Complete Project
- **POST** `/api/v1/projects/{id}/complete`
- **Description**: Completes a project (changes status to COMPLETED)
- **Path Parameters**: `id` (UUID)
- **Response**: 200 OK with completed project

### 16. Put Project on Hold
- **POST** `/api/v1/projects/{id}/hold`
- **Description**: Puts a project on hold (changes status to ON_HOLD)
- **Path Parameters**: `id` (UUID)
- **Response**: 200 OK with project on hold

### 17. Cancel Project
- **POST** `/api/v1/projects/{id}/cancel`
- **Description**: Cancels a project (changes status to CANCELLED)
- **Path Parameters**: `id` (UUID)
- **Response**: 200 OK with cancelled project

### 18. Check Project Key Exists
- **GET** `/api/v1/projects/check/key/{key}`
- **Description**: Checks if a project key is already taken
- **Path Parameters**: `key` (String)
- **Response**: 200 OK with boolean value

### 19. Count Projects by Organization
- **GET** `/api/v1/projects/count/organization/{organizationId}`
- **Description**: Counts projects for a specific organization
- **Path Parameters**: `organizationId` (UUID)
- **Response**: 200 OK with count

### 20. Count Projects by Status
- **GET** `/api/v1/projects/count/status/{status}`
- **Description**: Counts projects by status
- **Path Parameters**: `status` (ProjectStatus enum)
- **Response**: 200 OK with count

## Project Status Values
- `PLANNING` - Project is in planning phase
- `ACTIVE` - Project is currently active
- `ON_HOLD` - Project is temporarily paused
- `COMPLETED` - Project has been completed
- `CANCELLED` - Project has been cancelled

## Error Handling
- **400 Bad Request**: Invalid request data
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side error

## Pagination
For endpoints that support pagination, use the following query parameters:
- `page`: Page number (0-based)
- `size`: Page size
- `sort`: Sort criteria (e.g., `name,asc`)

## Example Usage

### Create a new project
```bash
curl -X POST http://localhost:8080/api/v1/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sample Project",
    "description": "This is a sample project",
    "key": "SP",
    "organization": {
      "id": "123e4567-e89b-12d3-a456-426614174000"
    }
  }'
```

### Get projects by organization
```bash
curl -X GET "http://localhost:8080/api/v1/projects/organization/123e4567-e89b-12d3-a456-426614174000?page=0&size=10"
```

### Start a project
```bash
curl -X POST http://localhost:8080/api/v1/projects/123e4567-e89b-12d3-a456-426614174000/start
```

## Notes
- All timestamps are in ISO-8601 format
- UUIDs are used for all ID fields
- The API supports CORS for cross-origin requests
- All endpoints are documented with Swagger/OpenAPI annotations
