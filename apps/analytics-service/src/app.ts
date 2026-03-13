import express, { Request, Response, NextFunction, Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import counterRoutes from './routes/counters.routes';
import graphRoutes from './routes/graphs.routes';
import tableRoutes from './routes/tables.routes';
import refreshRoutes from './routes/refresh.routes';
import exportRoutes from './routes/export.routes';

const app: Application = express();

app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 150,
    message: 'Too many requests! Please try again after some time',
    standardHeaders: true,
    legacyHeaders: false
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
        else callback(new Error('not allowed by CORS'));
    },
    credentials: true
}));

app.use(express.json(), cookieParser(), morgan('dev'));

app.get('/health', (req: Request, res: Response) => {
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

/* eslint-disable @typescript-eslint/no-unused-vars */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).json({ error: 'analytics-service - Internal server error' });
});

export default app;
