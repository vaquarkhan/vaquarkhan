// Configuration file for API keys and settings
export const CONFIG = {
    GEMINI_API_KEY: 'your_gemini_api_key_here',
    
    // Database configuration
    DATABASE_TYPE: 'sqlite', // 'sqlite' or 'mysql'
    MYSQL_CONFIG: {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'turboagile'
    },
    
    // Other configuration options
    APP_NAME: 'Turbo Agile',
    VERSION: '1.0.0',
    
    // API endpoints
    ENDPOINTS: {
        GEMINI: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
    }
};