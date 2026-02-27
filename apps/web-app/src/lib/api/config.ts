export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_URL || '/api',
    AUTH_SERVICE_URL: import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:4001',
    RESUME_SERVICE_URL: import.meta.env.VITE_RESUME_SERVICE_URL || 'http://localhost:4002',
    APPLICATION_SERVICE_URL: import.meta.env.VITE_APPLICATION_SERVICE_URL || 'http://localhost:4003',
    TIMEOUT: 10000
};

export const API_ENDPOINTS = {
    AUTH: {
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh-token',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
    },
    USER: {
        PROFILE: '/users/me',
        UPDATE_PROFILE: '/users/me',
        UPDATE_PASSWORD: '/users/me/password',
    },
    RESUME: {
        UPLOAD: '/api/resume/upload'
    },
    CANDIDATE: {
        LISTALL: 'api/candidate/parsed',
        FILTERBYNAME: 'api/candidate/parsed/name',
        LISTBYUSERID: 'api/candidate/parsed/userId',
        LISTBYRESUMEID: 'api/candidate/parsed/resumeId'
    }
}