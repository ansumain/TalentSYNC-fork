import express, { Request, Response, NextFunction, Application } from 'express';
import morgan from 'morgan';
import resumeRoutes from './routes/resume.routes'
import cors from 'cors'

const app: Application = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

app.use(express.json(), morgan('dev'));

app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'OK',
        service: 'resume-parser-service',
        currentTime: `${new Date().toISOString()}`,
    });
});

app.use('/api/resume', resumeRoutes);

app.use('/files', express.static('uploads'))

/* eslint-disable @typescript-eslint/no-unused-vars */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).json({ error: 'Resume-Parser - Internal server error' });
});

export default app;
