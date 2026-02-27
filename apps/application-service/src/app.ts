import express, { Request, Response, NextFunction, Application } from 'express';
import morgan from 'morgan';
import candidateRoutes from './routes/candidate.routes';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app: Application = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

app.use(express.json(), cookieParser(), morgan('dev'));

app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'OK',
        service: 'application-service',
        currentTime: `${new Date().toISOString()}`,
    });
});

app.use('/api/candidate', candidateRoutes);

/* eslint-disable @typescript-eslint/no-unused-vars */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).json({ error: 'application-service - Internal server error' });
});

export default app;
