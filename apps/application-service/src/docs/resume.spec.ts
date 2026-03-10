const resumeSpec = {
    paths: {
        '/api/resume/upload': {
            post: {
                tags: ['Resume'],
                summary: 'Upload one or more resume files',
                description: 'Candidates can upload only 1 file. Managers/admins can upload multiple.',
                requestBody: {
                    required: true,
                    content: {
                        'multipart/form-data': {
                            schema: {
                                type: 'object',
                                required: ['resume'],
                                properties: {
                                    resume: {
                                        type: 'array',
                                        items: { type: 'string', format: 'binary' },
                                        description: 'Resume file(s) — PDF, DOCX, or image',
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: 'File(s) uploaded and queued for parsing' },
                    400: { description: 'Invalid file type or too many files' },
                    401: { description: 'Not authenticated' },
                },
            },
        },
        '/files/{filename}': {
            get: {
                tags: ['Resume'],
                summary: 'Download/view a resume file (authenticated)',
                parameters: [
                    {
                        in: 'path',
                        name: 'filename',
                        required: true,
                        schema: { type: 'string' },
                        description: 'The stored filename from the resume record',
                    },
                ],
                responses: {
                    200: { description: 'File content returned' },
                    401: { description: 'Not authenticated' },
                    404: { description: 'File not found' },
                },
            },
        },
    },
};

export default resumeSpec;
