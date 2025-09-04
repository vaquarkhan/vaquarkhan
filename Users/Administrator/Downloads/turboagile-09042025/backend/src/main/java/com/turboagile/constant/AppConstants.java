package com.turboagile.constant;

/**
 * Application Constants
 * Centralized constants for the TurboAgile application
 * 
 * @author TurboAgile Team
 * @version 2.0.0
 */
public final class AppConstants {

    private AppConstants() {
        // Private constructor to prevent instantiation
    }

    // Application Information
    public static final String APP_NAME = "TurboAgile Enhanced";
    public static final String APP_VERSION = "2.0.0";
    public static final String APP_DESCRIPTION = "Enhanced AI-native platform for 100x engineering productivity";

    // API Constants
    public static final String API_BASE_PATH = "/api";
    public static final String API_VERSION = "/v1";
    public static final String SWAGGER_UI_PATH = "/swagger-ui.html";
    public static final String API_DOCS_PATH = "/api-docs";

    // HTTP Constants
    public static final String CONTENT_TYPE_JSON = "application/json";
    public static final String CONTENT_TYPE_XML = "application/xml";
    public static final String AUTHORIZATION_HEADER = "Authorization";
    public static final String BEARER_PREFIX = "Bearer ";

    // Security Constants
    public static final String ROLE_ADMIN = "ROLE_ADMIN";
    public static final String ROLE_MANAGER = "ROLE_MANAGER";
    public static final String ROLE_DEVELOPER = "ROLE_DEVELOPER";
    public static final String ROLE_USER = "ROLE_USER";
    
    public static final int PASSWORD_MIN_LENGTH = 8;
    public static final int PASSWORD_MAX_LENGTH = 128;
    public static final int USERNAME_MIN_LENGTH = 3;
    public static final int USERNAME_MAX_LENGTH = 50;

    // Pagination Constants
    public static final int DEFAULT_PAGE_SIZE = 20;
    public static final int MAX_PAGE_SIZE = 100;
    public static final String DEFAULT_SORT_FIELD = "createdAt";
    public static final String DEFAULT_SORT_DIRECTION = "DESC";

    // Cache Constants
    public static final String CACHE_USER = "user";
    public static final String CACHE_PROJECT = "project";
    public static final String CACHE_STORY = "story";
    public static final String CACHE_SPRINT = "sprint";
    public static final String CACHE_ARCHITECTURE_DIAGRAM = "architectureDiagram";

    // File Upload Constants
    public static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    public static final String[] ALLOWED_FILE_TYPES = {
        "jpg", "jpeg", "png", "gif", "pdf", "doc", "docx", "xls", "xlsx"
    };

    // Validation Constants
    public static final int TITLE_MIN_LENGTH = 3;
    public static final int TITLE_MAX_LENGTH = 255;
    public static final int DESCRIPTION_MAX_LENGTH = 1000;
    public static final int LABEL_MAX_LENGTH = 100;

    // Business Logic Constants
    public static final int MAX_STORY_POINTS = 21;
    public static final int MAX_SPRINT_DURATION_DAYS = 30;
    public static final int MAX_PROJECTS_PER_ORGANIZATION = 100;
    public static final int MAX_STORIES_PER_PROJECT = 1000;

    // Time Constants
    public static final long ONE_DAY_MILLIS = 24 * 60 * 60 * 1000L;
    public static final long ONE_WEEK_MILLIS = 7 * ONE_DAY_MILLIS;
    public static final long ONE_MONTH_MILLIS = 30 * ONE_DAY_MILLIS;

    // Error Messages
    public static final String ERROR_RESOURCE_NOT_FOUND = "Resource not found";
    public static final String ERROR_UNAUTHORIZED = "Unauthorized access";
    public static final String ERROR_FORBIDDEN = "Access forbidden";
    public static final String ERROR_VALIDATION_FAILED = "Validation failed";
    public static final String ERROR_INTERNAL_SERVER = "Internal server error";
    public static final String ERROR_BAD_REQUEST = "Bad request";

    // Success Messages
    public static final String SUCCESS_CREATED = "Resource created successfully";
    public static final String SUCCESS_UPDATED = "Resource updated successfully";
    public static final String SUCCESS_DELETED = "Resource deleted successfully";
    public static final String SUCCESS_OPERATION = "Operation completed successfully";

    // Database Constants
    public static final String DB_SCHEMA = "turboagile";
    public static final String DB_TABLE_PREFIX = "ta_";
    
    // Audit Constants
    public static final String AUDIT_CREATED_BY = "createdBy";
    public static final String AUDIT_CREATED_AT = "createdAt";
    public static final String AUDIT_UPDATED_BY = "updatedBy";
    public static final String AUDIT_UPDATED_AT = "updatedAt";
    public static final String AUDIT_VERSION = "version";

    // Notification Constants
    public static final String NOTIFICATION_EMAIL = "email";
    public static final String NOTIFICATION_SLACK = "slack";
    public static final String NOTIFICATION_WEBHOOK = "webhook";
    
    // Integration Constants
    public static final String INTEGRATION_JIRA = "jira";
    public static final String INTEGRATION_GITHUB = "github";
    public static final String INTEGRATION_SLACK = "slack";
    public static final String INTEGRATION_EMAIL = "email";
}
