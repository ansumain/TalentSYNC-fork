// import express, { Application, NextFunction } from 'express';
// import { Request, Response } from 'express';
// import cookieParser from 'cookie-parser';
// import morgan from 'morgan';
// import authRoutes from './routes/auth.routes';
// import userProfileRoutes from './routes/userProfile.routes';
// import roleRoutes from './routes/role.routes';
// import permissionRoutes from './routes/permissions.routes';
// import userRoleRoutes from './routes/userRole.routes';
// import rolePermissionRoutes from './routes/rolePermission.routes';
// import { config } from './config/env';
// import cors from 'cors';
// import helmet from 'helmet';
// import rateLimit from 'express-rate-limit';

// const app: Application = express();

// app.use(helmet());

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 300,
//   message: 'Too many requests! Please try again after some time',
//   standardHeaders: true,
//   legacyHeaders: false
// })

// app.use(limiter);

// app.use(cors({
//   origin: [config.frontendUrl, 'http://localhost:5173', 'http://localhost:4003', 'http://localhost'],
//   credentials: true
// }));

// app.use(express.json(), cookieParser(), morgan('dev'));

// app.get('/health', (req: Request, res: Response) => {
//   res.status(200).json({
//     status: 'OK',
//     service: 'auth-service',
//     currentTime: `${new Date().toISOString()}`,
//   });
// });

// // app.use('/api/auth', authRoutes);
// // app.use('/api/auth/users', userProfileRoutes);
// // app.use('/api/admin', roleRoutes);
// // app.use('/api/admin', permissionRoutes);
// // app.use('/api/admin', userRoleRoutes);
// // app.use('/api/admin', rolePermissionRoutes);

// app.use('/auth', authRoutes);
// app.use('/users', userProfileRoutes);
// app.use('/admin', roleRoutes);
// app.use('/admin', permissionRoutes);
// app.use('/admin', userRoleRoutes);
// app.use('/admin', rolePermissionRoutes);

// /* eslint-disable @typescript-eslint/no-unused-vars */
// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//   console.error(err);
//   res.status(500).json({ error: 'Internal server error' });
// });

// export default app;

import express, { Application, NextFunction } from 'express';
import { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes';
import userProfileRoutes from './routes/userProfile.routes';
import roleRoutes from './routes/role.routes';
import permissionRoutes from './routes/permissions.routes';
import userRoleRoutes from './routes/userRole.routes';
import rolePermissionRoutes from './routes/rolePermission.routes';
import { config } from './config/env';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app: Application = express();

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: 'Too many requests! Please try again after some time',
  standardHeaders: true,
  legacyHeaders: false
})

app.use(limiter);

app.use(cors({
  origin: [config.frontendUrl, 'http://localhost:5173', 'http://localhost:4003', 'http://localhost'],
  credentials: true
}));

app.use(express.json(), cookieParser(), morgan('dev'));

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    service: 'auth-service',
    currentTime: `${new Date().toISOString()}`,
  });
});

// app.use('/api/auth', authRoutes);
// app.use('/api/auth/users', userProfileRoutes);
// app.use('/api/admin', roleRoutes);
// app.use('/api/admin', permissionRoutes);
// app.use('/api/admin', userRoleRoutes);
// app.use('/api/admin', rolePermissionRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/users', userProfileRoutes);
app.use('/api/admin', roleRoutes);
app.use('/api/admin', permissionRoutes);
app.use('/api/admin', userRoleRoutes);
app.use('/api/admin', rolePermissionRoutes);

/* eslint-disable @typescript-eslint/no-unused-vars */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
