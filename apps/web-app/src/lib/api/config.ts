export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_URL || '/api',
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
    }
}