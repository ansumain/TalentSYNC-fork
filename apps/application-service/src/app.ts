import express, { Request, Response, Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import candidateRoutes from './routes/candidate.routes';
import jobRoutes from './routes/job.routes';
import interviewRoutes from './routes/interview.routes';
import jobApplicationRoutes from './routes/jobApplication.routes';
import skillRoutes from './routes/skill.routes';
import docsRouter from './docs/index';
import { toApiErrorResponse, AppError } from '@talentsync/types';
import { notFoundHandler, globalErrorHandler } from '@talentsync/auth-middlewares';

const app: Application = express();

app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: 'Too many requests! Please try again after some time',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res, _next, options) => {
        const message = typeof options.message === 'string' ? options.message : 'Too many requests! Please try again after sometime';

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

const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:4003',
    'http://localhost',
];

app.use(cors({
    // origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) callback(null, true);
        else callback(new Error('not allowed by CORS'));
    },
    credentials: true
}));

app.use(express.json(), cookieParser(), morgan('dev'));

app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
        status: 'OK',
        service: 'application-service',
        currentTime: `${new Date().toISOString()}`,
    });
});

app.use('/api/candidate', candidateRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/applications', jobApplicationRoutes);
app.use('/api/skills', skillRoutes);

if (process.env.NODE_ENV !== 'production') {
    app.use('/docs', docsRouter);
}

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
