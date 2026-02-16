import express, { NextFunction } from 'express';
import authRoutes from './routes/auth.routes';
import { Request, Response } from 'express';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    service: 'auth-service',
    currentTime: `${new Date().toISOString()}`,
  });
});

app.use('/auth', authRoutes);

/* eslint-disable @typescript-eslint/no-unused-vars */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
