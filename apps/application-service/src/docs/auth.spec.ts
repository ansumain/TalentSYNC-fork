const authSpec = {
    paths: {
        '/api/auth/register': {
            post: {
                tags: ['Auth'],
                summary: 'Register a new user',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['name', 'email', 'phone', 'password'],
                                properties: {
                                    name: { type: 'string', example: 'Ansuman Panda' },
                                    email: { type: 'string', example: 'admin@gmail.com' },
                                    phone: { type: 'string', example: '9876543210' },
                                    password: { type: 'string', example: 'password123' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: { description: 'User registered successfully' },
                    400: { description: 'Validation error' },
                    409: { description: 'Email already exists' },
                },
                security: [],
            },
        },
        '/api/auth/login': {
            post: {
                tags: ['Auth'],
                summary: 'Login and receive cookies',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['email', 'password'],
                                properties: {
                                    email: { type: 'string', example: 'admin@gmail.com' },
                                    password: { type: 'string', example: 'password123' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: 'Login successful, access_token set in cookie' },
                    401: { description: 'Invalid credentials' },
                },
                security: [],
            },
        },
        '/api/auth/logout': {
            post: {
                tags: ['Auth'],
                summary: 'Logout and clear cookies',
                responses: {
                    200: { description: 'Logged out successfully' },
                    401: { description: 'Not authenticated' },
                },
            },
        },
        '/api/auth/refresh-token': {
            post: {
                tags: ['Auth'],
                summary: 'Get a new access token using refresh token cookie',
                responses: {
                    200: { description: 'New access token issued' },
                    401: { description: 'Invalid or expired refresh token' },
                },
                security: [],
            },
        },
        '/api/auth/forgot-password': {
            post: {
                tags: ['Auth'],
                summary: 'Request a password reset OTP',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['email'],
                                properties: {
                                    email: { type: 'string', example: 'admin@gmail.com' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: 'OTP sent to email' },
                    404: { description: 'User not found' },
                },
                security: [],
            },
        },
        '/api/auth/reset-password': {
            post: {
                tags: ['Auth'],
                summary: 'Reset password using OTP',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['email', 'otp', 'newPassword'],
                                properties: {
                                    email: { type: 'string', example: 'admin@gmail.com' },
                                    otp: { type: 'string', example: '123456' },
                                    newPassword: { type: 'string', example: 'password123' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: 'Password reset successful' },
                    400: { description: 'Invalid or expired OTP' },
                },
                security: [],
            },
        },
        '/api/users/me': {
            get: {
                tags: ['User Profile'],
                summary: 'Get current user profile',
                responses: {
                    200: { description: 'User profile returned' },
                    401: { description: 'Not authenticated' },
                },
            },
            put: {
                tags: ['User Profile'],
                summary: 'Update current user profile',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string' },
                                    email: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: 'Profile updated' },
                    401: { description: 'Not authenticated' },
                },
            },
        },
        '/api/users/me/password': {
            patch: {
                tags: ['User Profile'],
                summary: 'Change password',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['currentPassword', 'newPassword'],
                                properties: {
                                    currentPassword: { type: 'string' },
                                    newPassword: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: 'Password changed' },
                    401: { description: 'Not authenticated' },
                },
            },
        },
        '/api/admin/roles': {
            get: {
                tags: ['Admin - Roles'],
                summary: 'Get all roles (admin only)',
                responses: {
                    200: { description: 'List of roles' },
                    403: { description: 'Forbidden' },
                },
            },
        },
        '/api/admin/role/{userId}': {
            get: {
                tags: ['Admin - Roles'],
                summary: 'Get role by userId (admin only)',
                parameters: [{ in: 'path', name: 'userId', required: true, schema: { type: 'string' } }],
                responses: {
                    200: { description: 'Role for user' },
                    403: { description: 'Forbidden' },
                },
            },
        },
        '/api/admin/role': {
            post: {
                tags: ['Admin - Roles'],
                summary: 'Create a role (admin only)',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['name'],
                                properties: { name: { type: 'string', example: 'interviewer' } },
                            },
                        },
                    },
                },
                responses: {
                    201: { description: 'Role created' },
                    403: { description: 'Forbidden' },
                },
            },
        },
        '/api/admin/role/{roleId}': {
            delete: {
                tags: ['Admin - Roles'],
                summary: 'Delete a role (admin only)',
                parameters: [{ in: 'path', name: 'roleId', required: true, schema: { type: 'string' } }],
                responses: {
                    200: { description: 'Role deleted' },
                    403: { description: 'Forbidden' },
                },
            },
        },
        '/api/admin/permissions': {
            get: {
                tags: ['Admin - Permissions'],
                summary: 'Get all permissions (admin only)',
                responses: { 200: { description: 'List of permissions' } },
            },
        },
        '/api/admin/permission': {
            post: {
                tags: ['Admin - Permissions'],
                summary: 'Create a permission (admin only)',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['name'],
                                properties: { name: { type: 'string' } },
                            },
                        },
                    },
                },
                responses: { 201: { description: 'Permission created' } },
            },
        },
        '/api/admin/permission/user/{userId}': {
            get: {
                tags: ['Admin - Permissions'],
                summary: 'Get permissions for a user (admin only)',
                parameters: [{ in: 'path', name: 'userId', required: true, schema: { type: 'string' } }],
                responses: { 200: { description: 'Permissions for user' } },
            },
        },
        '/api/admin/permission/role/{roleId}': {
            get: {
                tags: ['Admin - Permissions'],
                summary: 'Get permissions for a role (admin only)',
                parameters: [{ in: 'path', name: 'roleId', required: true, schema: { type: 'string' } }],
                responses: { 200: { description: 'Permissions for role' } },
            },
        },
        '/api/admin/permission/{permissionId}': {
            delete: {
                tags: ['Admin - Permissions'],
                summary: 'Delete a permission (admin only)',
                parameters: [{ in: 'path', name: 'permissionId', required: true, schema: { type: 'string' } }],
                responses: { 200: { description: 'Permission deleted' } },
            },
        },
        '/api/admin/assign-role/{userId}': {
            post: {
                tags: ['Admin - User Roles'],
                summary: 'Assign a role to a user (admin only)',
                parameters: [{ in: 'path', name: 'userId', required: true, schema: { type: 'string' } }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['roleId'],
                                properties: { roleId: { type: 'string' } },
                            },
                        },
                    },
                },
                responses: { 200: { description: 'Role assigned' } },
            },
        },
        '/api/admin/revoke-role/{userId}/{roleId}': {
            delete: {
                tags: ['Admin - User Roles'],
                summary: 'Revoke a role from a user (admin only)',
                parameters: [
                    { in: 'path', name: 'userId', required: true, schema: { type: 'string' } },
                    { in: 'path', name: 'roleId', required: true, schema: { type: 'string' } },
                ],
                responses: { 200: { description: 'Role revoked' } },
            },
        },
        '/api/admin/assign-permission/{roleId}': {
            post: {
                tags: ['Admin - Role Permissions'],
                summary: 'Assign a permission to a role (admin only)',
                parameters: [{ in: 'path', name: 'roleId', required: true, schema: { type: 'string' } }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['permissionId'],
                                properties: { permissionId: { type: 'string' } },
                            },
                        },
                    },
                },
                responses: { 200: { description: 'Permission assigned' } },
            },
        },
        '/api/admin/revoke-permission/{roleId}/{permissionId}': {
            delete: {
                tags: ['Admin - Role Permissions'],
                summary: 'Revoke a permission from a role (admin only)',
                parameters: [
                    { in: 'path', name: 'roleId', required: true, schema: { type: 'string' } },
                    { in: 'path', name: 'permissionId', required: true, schema: { type: 'string' } },
                ],
                responses: { 200: { description: 'Permission revoked' } },
            },
        },
    },
};

export default authSpec;
