import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';

const app = express();

app.use(express.json(), morgan('dev'));

app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'OK',
        service: 'resume-parser-service',
        currentTime: `${new Date().toISOString()}`,
    });
});

/* eslint-disable @typescript-eslint/no-unused-vars */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).json({ error: 'Resume-Parser - Internal server error' });
});

export default app;
