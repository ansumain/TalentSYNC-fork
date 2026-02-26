import express, { Request, Response, NextFunction, Application } from 'express';
import morgan from 'morgan';
import candidateRoutes from './routes/candidate.routes';

const app: Application = express();

app.use(express.json(), morgan('dev'));

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
