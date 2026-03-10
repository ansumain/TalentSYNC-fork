import multer, { FileFilterCallback } from 'multer'
import { Request, RequestHandler } from 'express'
import path from 'path';
import fs from 'fs';
import { allowedMimeTypes } from '@talentsync/config';

// uploaded file directory
const uploadDir = '/data/uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

// destination specification + renaming
const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const suffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + suffix + path.extname(file.originalname));
    }
});

// accepts only allowed formats
const FileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (allowedMimeTypes.IMAGE.includes(file.mimetype) || allowedMimeTypes.PDF.includes(file.mimetype) || allowedMimeTypes.DOC.includes(file.mimetype) || allowedMimeTypes.DOCX.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error(`Invalid document type`) as any, false);
    }
}

// multer instance
const resumeUpload: RequestHandler = multer({
    storage,
    fileFilter: FileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024   // 10MB
    }
}).array('resume')

export { resumeUpload };