const applicationSpec = {
    paths: {
        // Candidate 
        '/api/candidate/resume-status': {
            get: {
                tags: ['Candidate'],
                summary: 'Check if current candidate has an uploaded resume',
                responses: {
                    200: {
                        description: 'Resume status',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: { hasResume: { type: 'boolean' } },
                                },
                            },
                        },
                    },
                    401: { description: 'Not authenticated' },
                },
            },
        },
        '/api/candidate/my-resumes': {
            get: {
                tags: ['Candidate'],
                summary: "Get current candidate's own resume uploads",
                responses: {
                    200: { description: 'List of resumes for current user' },
                    401: { description: 'Not authenticated' },
                },
            },
        },
        '/api/candidate/parsed': {
            get: {
                tags: ['Candidate'],
                summary: 'Get all candidates (deduplicated, paginated)',
                parameters: [
                    { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
                    { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } },
                    { in: 'query', name: 'sortBy', schema: { type: 'string', default: 'createdAt' } },
                    { in: 'query', name: 'sortOrder', schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' } },
                    { in: 'query', name: 'search', schema: { type: 'string' }, description: 'Search by name' },
                ],
                responses: {
                    200: { description: 'Paginated candidate list' },
                    401: { description: 'Not authenticated' },
                },
            },
        },
        '/api/candidate/parsed/userId': {
            get: {
                tags: ['Candidate'],
                summary: 'Get all resumes for a specific userId (manager/admin only)',
                parameters: [
                    { in: 'query', name: 'userId', required: true, schema: { type: 'string' } },
                ],
                responses: {
                    200: { description: 'Resume records for user' },
                    400: { description: 'userId is required' },
                    403: { description: 'Candidates cannot access this endpoint' },
                },
            },
        },
        '/api/candidate/parsed/resumeId': {
            get: {
                tags: ['Candidate'],
                summary: 'Get a specific resume by resumeId',
                parameters: [
                    { in: 'query', name: 'resumeId', required: true, schema: { type: 'string' } },
                ],
                responses: {
                    200: { description: 'Resume record' },
                    401: { description: 'Not authenticated' },
                },
            },
        },

        // Jobs
        '/api/jobs': {
            get: {
                tags: ['Jobs'],
                summary: 'Get all jobs (paginated)',
                parameters: [
                    { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
                    { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } },
                    { in: 'query', name: 'sortBy', schema: { type: 'string' } },
                    { in: 'query', name: 'sortOrder', schema: { type: 'string', enum: ['asc', 'desc'] } },
                    { in: 'query', name: 'search', schema: { type: 'string' } },
                ],
                responses: { 200: { description: 'Paginated job list' } },
            },
            post: {
                tags: ['Jobs'],
                summary: 'Create a new job',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['title', 'description', 'location', 'jobType', 'openings'],
                                properties: {
                                    title: { type: 'string' },
                                    description: { type: 'string' },
                                    location: { type: 'string' },
                                    jobType: { type: 'string' },
                                    openings: { type: 'integer' },
                                    skillIds: { type: 'array', items: { type: 'string' } },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: { description: 'Job created' },
                    401: { description: 'Not authenticated' },
                },
            },
        },
        '/api/jobs/{jobId}': {
            get: {
                tags: ['Jobs'],
                summary: 'Get a job by ID',
                parameters: [{ in: 'path', name: 'jobId', required: true, schema: { type: 'string' } }],
                responses: { 200: { description: 'Job details' }, 404: { description: 'Not found' } },
            },
            patch: {
                tags: ['Jobs'],
                summary: 'Update a job',
                parameters: [{ in: 'path', name: 'jobId', required: true, schema: { type: 'string' } }],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: { type: 'object', properties: { title: { type: 'string' }, openings: { type: 'integer' } } },
                        },
                    },
                },
                responses: { 200: { description: 'Job updated' } },
            },
            delete: {
                tags: ['Jobs'],
                summary: 'Delete a job',
                parameters: [{ in: 'path', name: 'jobId', required: true, schema: { type: 'string' } }],
                responses: { 200: { description: 'Job deleted' } },
            },
        },

        // Skills
        '/api/skills': {
            get: {
                tags: ['Skills'],
                summary: 'Get all skills',
                responses: { 200: { description: 'List of skills' } },
            },
        },

        // Job Applications
        '/api/applications': {
            get: {
                tags: ['Applications'],
                summary: 'Get all applications (manager/admin, paginated)',
                parameters: [
                    { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
                    { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } },
                    { in: 'query', name: 'sortBy', schema: { type: 'string' } },
                    { in: 'query', name: 'sortOrder', schema: { type: 'string', enum: ['asc', 'desc'] } },
                ],
                responses: { 200: { description: 'Paginated application list' } },
            },
        },
        '/api/applications/user/me': {
            get: {
                tags: ['Applications'],
                summary: "Get current candidate's own applications",
                responses: { 200: { description: 'Applications for current user' } },
            },
        },
        '/api/applications/job/{jobId}/ranked': {
            get: {
                tags: ['Applications'],
                summary: 'Get ranked applicants for a job',
                parameters: [{ in: 'path', name: 'jobId', required: true, schema: { type: 'string' } }],
                responses: { 200: { description: 'Ranked applicant list' } },
            },
        },
        '/api/applications/job/{jobId}': {
            get: {
                tags: ['Applications'],
                summary: 'Get all applications for a job',
                parameters: [{ in: 'path', name: 'jobId', required: true, schema: { type: 'string' } }],
                responses: { 200: { description: 'Applications for job' } },
            },
        },
        '/api/applications/{jobId}': {
            post: {
                tags: ['Applications'],
                summary: 'Apply for a job',
                parameters: [{ in: 'path', name: 'jobId', required: true, schema: { type: 'string' } }],
                responses: {
                    201: { description: 'Application submitted' },
                    409: { description: 'Already applied' },
                },
            },
        },
        '/api/applications/{applicationId}': {
            get: {
                tags: ['Applications'],
                summary: 'Get a specific application by ID',
                parameters: [{ in: 'path', name: 'applicationId', required: true, schema: { type: 'string' } }],
                responses: { 200: { description: 'Application details' } },
            },
            patch: {
                tags: ['Applications'],
                summary: 'Update application status',
                parameters: [{ in: 'path', name: 'applicationId', required: true, schema: { type: 'string' } }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['status'],
                                properties: {
                                    status: { type: 'string', enum: ['applied', 'shortlisted', 'interviewing', 'hired', 'rejected'] },
                                },
                            },
                        },
                    },
                },
                responses: { 200: { description: 'Status updated' } },
            },
            delete: {
                tags: ['Applications'],
                summary: 'Delete an application',
                parameters: [{ in: 'path', name: 'applicationId', required: true, schema: { type: 'string' } }],
                responses: { 200: { description: 'Application deleted' } },
            },
        },

        // Interviews
        '/api/interviews/interviewers/available': {
            get: {
                tags: ['Interviews'],
                summary: 'Get available interviewers',
                responses: { 200: { description: 'List of available interviewers' } },
            },
        },
        '/api/interviews': {
            get: {
                tags: ['Interviews'],
                summary: 'Get all interviews',
                responses: { 200: { description: 'List of interviews' } },
            },
            post: {
                tags: ['Interviews'],
                summary: 'Schedule an interview',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['applicationId', 'interviewerId', 'scheduledAt'],
                                properties: {
                                    applicationId: { type: 'string' },
                                    interviewerId: { type: 'string' },
                                    scheduledAt: { type: 'string', format: 'date-time' },
                                },
                            },
                        },
                    },
                },
                responses: { 201: { description: 'Interview scheduled' } },
            },
        },
        '/api/interviews/{interviewId}': {
            get: {
                tags: ['Interviews'],
                summary: 'Get interview by ID',
                parameters: [{ in: 'path', name: 'interviewId', required: true, schema: { type: 'string' } }],
                responses: { 200: { description: 'Interview details' } },
            },
            patch: {
                tags: ['Interviews'],
                summary: 'Update an interview',
                parameters: [{ in: 'path', name: 'interviewId', required: true, schema: { type: 'string' } }],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: { type: 'object', properties: { scheduledAt: { type: 'string', format: 'date-time' } } },
                        },
                    },
                },
                responses: { 200: { description: 'Interview updated' } },
            },
            delete: {
                tags: ['Interviews'],
                summary: 'Delete an interview',
                parameters: [{ in: 'path', name: 'interviewId', required: true, schema: { type: 'string' } }],
                responses: { 200: { description: 'Interview deleted' } },
            },
        },
        '/api/interviews/job/{jobId}': {
            get: {
                tags: ['Interviews'],
                summary: 'Get all interviews for a job',
                parameters: [{ in: 'path', name: 'jobId', required: true, schema: { type: 'string' } }],
                responses: { 200: { description: 'Interviews for job' } },
            },
        },
    },
};

export default applicationSpec;
