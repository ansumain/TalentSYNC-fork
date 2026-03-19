import express, { Request, Response, Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { AppError, forbiddenError, toApiErrorResponse } from '@talentsync/types';
import counterRoutes from './routes/counters.routes';
import graphRoutes from './routes/graphs.routes';
import tableRoutes from './routes/tables.routes';
import refreshRoutes from './routes/refresh.routes';
import exportRoutes from './routes/export.routes';
import { globalErrorHandler, notFoundHandler } from '@talentsync/auth-middlewares';

const app: Application = express();

app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
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

const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    // 'http://localhost:4003',
    'http://localhost',
];

app.use(cors({
    // origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) callback(null, true);
        else callback(forbiddenError('not allowed by CORS', 'CORS_NOT_ALLOWED'));
    },
    credentials: true
}));

app.use(express.json(), cookieParser(), morgan('dev'));

app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
        status: 'OK',
        service: 'analytics-service',
        currentTime: `${new Date().toISOString()}`,
    });
});

app.use('/api', counterRoutes);
app.use('/api', graphRoutes);
app.use('/api', tableRoutes);
app.use('/api', refreshRoutes);
app.use('/api', exportRoutes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
