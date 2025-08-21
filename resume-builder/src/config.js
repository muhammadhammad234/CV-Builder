// Configuration for the Resume Builder application
const config = {
    // Backend API configuration
    BACKEND_URL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001',
    API_TIMEOUT: parseInt(process.env.REACT_APP_API_TIMEOUT) || 60000,

    // Application settings
    APP_NAME: 'Resume Builder',
    APP_VERSION: '1.0.0',

    // API endpoints
    ENDPOINTS: {
        HEALTH: '/health',
        QUESTIONNAIRE: '/questionnaire',
        GENERATE_CV: '/generate-cv'
    }
};

export default config;
