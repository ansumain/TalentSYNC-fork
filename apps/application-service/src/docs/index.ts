import swaggerUi from 'swagger-ui-express';
import { Router } from 'express';
import authSpec from './auth.spec';
import resumeSpec from './resume.spec';
import applicationSpec from './application.spec';

const mergedSpec = {
    openapi: '3.0.0',
    info: {
        title: 'TalentSYNC',
        version: '1.0.0',
        // description: 'Unified API documentation for all TalentSYNC services. Authentication uses HTTP-only cookies (access_token). Log in via POST /api/auth/login first, then all authenticated endpoints work automatically.',
    },
    servers: [
        { url: 'http://localhost', description: 'Nginx' }
    ],
    components: {
        securitySchemes: {
            cookieAuth: {
                type: 'apiKey',
                in: 'cookie',
                name: 'access_token',
            },
        },
    },
    security: [{ cookieAuth: [] }],
    paths: {
        ...authSpec.paths,
        ...resumeSpec.paths,
        ...applicationSpec.paths,
    },
};

const docsRouter: Router = Router();

docsRouter.use('/', swaggerUi.serve);
docsRouter.get('/', swaggerUi.setup(mergedSpec, {
    customSiteTitle: 'TalentSYNC API Docs',
    swaggerOptions: {
        withCredentials: true
    }
}));

docsRouter.get('/json', (_req, res) => {
    res.json(mergedSpec);
});

export default docsRouter;
