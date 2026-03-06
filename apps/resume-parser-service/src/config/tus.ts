import { Server } from '@tus/server';
import { FileStore } from '@tus/file-store';
import path from 'path';
import fs from 'fs';
import { AsyncLocalStorage } from 'async_hooks';
import { Request, Response } from 'express';
import { addToResumeData } from '../repository/resume.repository';
import { publishToQueue } from './rabbitmq';
import { config } from './env';

export const uploadPath = path.join(process.cwd(), 'uploads');

// Ensure the uploads directory exists before FileStore tries to use it
fs.mkdirSync(uploadPath, { recursive: true });

// Propagates userId across the entire async call stack of tusServer.handle()
const userStorage = new AsyncLocalStorage<string>();

const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

// Bridges userId from onUploadCreate to onUploadFinish via upload.id
const uploadUserMap = new Map<string, string>();

const tusServer = new Server({
    path: '/api/resume/upload',
    relativeLocation: true,
    datastore: new FileStore({
        directory: uploadPath
    }),

    onUploadCreate: async (req, upload) => {
        const { filename, filetype } = upload.metadata ?? {};

        // console.log('(onUploadCreate) - filename:', filename);
        // console.log('(onUploadCreate) - filetype:', filetype);

        if (!filename || !filetype) {
            throw { status_code: 400, body: 'Missing upload metadata' };
        }

        if (!allowedTypes.includes(filetype)) {
            throw { status_code: 400, body: 'Unsupported file type' };
        }

        // Read userId from AsyncLocalStorage — set by tusHandler before calling handle()
        const userId = userStorage.getStore();
        if (!userId) throw { status_code: 401, body: 'Unauthorized upload' };

        uploadUserMap.set(upload.id, userId);

        return {};
    },

    onUploadFinish: async (req, upload) => {
        try {
            const { filename, filetype } = upload.metadata ?? {};

            // console.log('(onUploadFinish) - filename:', filename);
            // console.log('(onUploadFinish) - filetype:', filetype);

            if (!filename || !filetype) {
                throw { status_code: 500, body: 'Missing upload metadata on finish' };
            }

            const userId = uploadUserMap.get(upload.id);
            uploadUserMap.delete(upload.id);

            if (!userId) {
                throw { status_code: 401, body: 'Unauthorized upload' };
            }

            const fileURL = path.join(process.cwd(), 'uploads', upload.id);

            const resumeId = await addToResumeData({
                userId,
                fileName: filename,
                mimeType: filetype,
                fileURL,
                status: 'queued'
            });

            await publishToQueue(config.queues.resumeParse, { resumeId }, 0);

            return {};
        } catch (error) {
            console.error('onUploadFinish error:', error);
            throw error;
        }
    }
});

export const tusHandler = (req: Request, res: Response) => {
    const userId = (req as any).userInfo?.sub;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized upload' });
        return;
    }
    // Run tusServer.handle inside userStorage context — propagates userId
    // to ALL async callbacks (onUploadCreate, onUploadFinish) regardless of req wrapping
    userStorage.run(userId, () => {
        tusServer.handle(req, res);
    });
};