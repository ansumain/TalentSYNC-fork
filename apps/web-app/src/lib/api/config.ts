// export const API_CONFIG = {
//     BASE_URL: import.meta.env.VITE_API_URL || '/api',
//     AUTH_SERVICE_URL: import.meta.env.VITE_AUTH_SERVICE_URL || '/auth',
//     RESUME_SERVICE_URL: import.meta.env.VITE_RESUME_SERVICE_URL || '/resume',
//     APPLICATION_SERVICE_URL: import.meta.env.VITE_APPLICATION_SERVICE_URL || '/candidate',
//     TIMEOUT: 10000
// };

// export const API_ENDPOINTS = {
//     AUTH: {
//         REGISTER: `${API_CONFIG.AUTH_SERVICE_URL}/register`,
//         LOGIN: `${API_CONFIG.AUTH_SERVICE_URL}/login`,
//         LOGOUT: `${API_CONFIG.AUTH_SERVICE_URL}/logout`,
//         REFRESH: `${API_CONFIG.AUTH_SERVICE_URL}/refresh-token`,
//         FORGOT_PASSWORD: `${API_CONFIG.AUTH_SERVICE_URL}/forgot-password`,
//         RESET_PASSWORD: `${API_CONFIG.AUTH_SERVICE_URL}/reset-password`,
//     },
//     USER: {
//         PROFILE: `${API_CONFIG.AUTH_SERVICE_URL}/users/me`,
//         UPDATE_PROFILE: `${API_CONFIG.AUTH_SERVICE_URL}/users/me`,
//         UPDATE_PASSWORD: `${API_CONFIG.AUTH_SERVICE_URL}/users/me/password`,
//     },
//     RESUME: {
//         UPLOAD:  `${API_CONFIG.RESUME_SERVICE_URL}/upload`
//     },
//     CANDIDATE: {
//         LISTALL: `${API_CONFIG.APPLICATION_SERVICE_URL}/parsed`,
//         FILTERBYNAME: `${API_CONFIG.APPLICATION_SERVICE_URL}/parsed/filter/name`,
//         LISTBYUSERID: `${API_CONFIG.APPLICATION_SERVICE_URL}/parsed/userId`,
//         LISTBYRESUMEID: `${API_CONFIG.APPLICATION_SERVICE_URL}/parsed/resumeId`
//     }
// }

// export const API_CONFIG = {
//     BASE_URL: import.meta.env.VITE_API_URL || '/api',
//     AUTH_SERVICE_URL: import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:4001',
//     RESUME_SERVICE_URL: import.meta.env.VITE_RESUME_SERVICE_URL || 'http://localhost:4002',
//     APPLICATION_SERVICE_URL: import.meta.env.VITE_APPLICATION_SERVICE_URL || 'http://localhost:4003',
//     TIMEOUT: 10000
// };

// export const API_ENDPOINTS = {
//     AUTH: {
//         REGISTER: '/auth/register',
//         LOGIN: '/auth/login',
//         LOGOUT: '/auth/logout',
//         REFRESH: '/auth/refresh-token',
//         FORGOT_PASSWORD: '/auth/forgot-password',
//         RESET_PASSWORD: '/auth/reset-password',
//     },
//     USER: {
//         PROFILE: '/users/me',
//         UPDATE_PROFILE: '/users/me',
//         UPDATE_PASSWORD: '/users/me/password',
//     },
//     RESUME: {
//         UPLOAD: '/api/resume/upload'
//     },
//     CANDIDATE: {
//         LISTALL: 'api/candidate/parsed',
//         FILTERBYNAME: '/api/candidate/parsed/filter/name',
//         LISTBYUSERID: '/api/candidate/parsed/userId',
//         LISTBYRESUMEID: '/api/candidate/parsed/resumeId'
//     }
// }



// export const API_CONFIG = {
//     BASE_URL: import.meta.env.VITE_API_URL || '/api',
//     AUTH_SERVICE_URL: import.meta.env.VITE_AUTH_SERVICE_URL || '/auth',
//     RESUME_SERVICE_URL: import.meta.env.VITE_RESUME_SERVICE_URL || '/resume',
//     APPLICATION_SERVICE_URL: import.meta.env.VITE_APPLICATION_SERVICE_URL || '/candidate',
//     TIMEOUT: 10000
// };

// export const API_ENDPOINTS = {
//     AUTH: {
//         REGISTER: `${API_CONFIG.AUTH_SERVICE_URL}/register`,
//         LOGIN: `${API_CONFIG.AUTH_SERVICE_URL}/login`,
//         LOGOUT: `${API_CONFIG.AUTH_SERVICE_URL}/logout`,
//         REFRESH: `${API_CONFIG.AUTH_SERVICE_URL}/refresh-token`,
//         FORGOT_PASSWORD: `${API_CONFIG.AUTH_SERVICE_URL}/forgot-password`,
//         RESET_PASSWORD: `${API_CONFIG.AUTH_SERVICE_URL}/reset-password`,
//     },
//     USER: {
//         PROFILE: `${API_CONFIG.AUTH_SERVICE_URL}/users/me`,
//         UPDATE_PROFILE: `${API_CONFIG.AUTH_SERVICE_URL}/users/me`,
//         UPDATE_PASSWORD: `${API_CONFIG.AUTH_SERVICE_URL}/users/me/password`,
//     },
//     RESUME: {
//         UPLOAD:  `${API_CONFIG.RESUME_SERVICE_URL}/upload`
//     },
//     CANDIDATE: {
//         LISTALL: `${API_CONFIG.APPLICATION_SERVICE_URL}/parsed`,
//         FILTERBYNAME: `${API_CONFIG.APPLICATION_SERVICE_URL}/parsed/filter/name`,
//         LISTBYUSERID: `${API_CONFIG.APPLICATION_SERVICE_URL}/parsed/userId`,
//         LISTBYRESUMEID: `${API_CONFIG.APPLICATION_SERVICE_URL}/parsed/resumeId`
//     }
// }

export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_URL || '/api',
    AUTH_SERVICE_URL: import.meta.env.VITE_AUTH_SERVICE_URL || '',
    RESUME_SERVICE_URL: import.meta.env.VITE_RESUME_SERVICE_URL || '',
    APPLICATION_SERVICE_URL: import.meta.env.VITE_APPLICATION_SERVICE_URL || '',
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
        UPLOAD: '/resume/upload'
    },
    CANDIDATE: {
        LISTALL: 'api/candidate/parsed',
        FILTERBYNAME: '/api/candidate/parsed/filter/name',
        LISTBYUSERID: '/api/candidate/parsed/userId',
        LISTBYRESUMEID: '/api/candidate/parsed/resumeId'
    }
}



