import express, { Request, Response, NextFunction, Application } from 'express';
import morgan from 'morgan';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit'
import path from 'path';
import { AppError, badRequestError, notFoundError, toApiErrorResponse } from '@talentsync/types';
import resumeRoutes from './routes/resume.routes'
import { authenticationMiddleware, globalErrorHandler, notFoundHandler } from '@talentsync/auth-middlewares'
import { getResumeObjectContentType, getResumeObjectStream } from './services/minio-storage.service';
import { getMimeTypeFromExtension } from './utils/getMimitypeFromExtension';

// import { tusHandler } from './config/tus';


const app: Application = express();

app.use(cookieParser())
app.use(helmet());
// app.use(cors({
//     origin: 'http://localhost:5173',
//     credentials: true,
//     methods: ['GET', 'POST', 'PATCH', 'OPTIONS', 'HEAD', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization', 'Tus-Resumable', 'Upload-Length', 'Upload-Metadata', 'Upload-Offset'],
//     exposedHeaders: ['Location', 'Upload-Offset', 'Upload-Length']
// }));

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:4003', 'http://localhost'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Tus-Resumable',
        'Upload-Length',
        'Upload-Metadata',
        'Upload-Offset',
        'X-HTTP-Method-Override'
    ],
    exposedHeaders: ['Location', 'Upload-Offset', 'Upload-Length', 'Tus-Resumable']
}));


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10000,
    message: 'Too many requests! Please try again after some time',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res, _next, options) => {
        const message =
            typeof options.message === 'string'
                ? options.message
                : 'Too many requests! Please try again after some time';

        res.status(options.statusCode).json(
            toApiErrorResponse(
                new AppError({
                    message,
                    code: 'TOO_MANY_REQUESTS',
                    statusCode: options.statusCode,
                })
            )
        );
    },
})

app.use(limiter);

// app.use(cors({
//     origin: process.env.FRONTEND_URL || 'http://localhost:5173',
//     credentials: true
// }));


app.use(morgan('dev'), express.json());

app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
        status: 'OK',
        service: 'resume-parser-service',
        currentTime: `${new Date().toISOString()}`,
    });
});

app.use('/api/resume', resumeRoutes);
// app.all('/api/resume/upload', authenticationMiddleware, tusHandler);
// app.all('/api/resume/upload/:id', authenticationMiddleware, tusHandler);

app.get('/files/:filename', authenticationMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    const filename = path.basename(req.params.filename as string);
    if (!filename) {
        next(badRequestError('Invalid filename', 'INVALID_FILENAME'));
        return;
    }

    try {
        const contentTypeFromObject = await getResumeObjectContentType(filename).catch(() => null);
        const contentType = contentTypeFromObject || getMimeTypeFromExtension(filename);
        const fileStream = await getResumeObjectStream(filename);

        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
        res.setHeader('X-Content-Type-Options', 'nosniff');

        fileStream.on('error', () => {
            if (!res.headersSent) {
                next(notFoundError('File not found', 'FILE_NOT_FOUND'));
            } else {
                res.destroy();
            }
        });

        fileStream.pipe(res);
    } catch {
        next(notFoundError('File not found', 'FILE_NOT_FOUND'));
    }
});

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;