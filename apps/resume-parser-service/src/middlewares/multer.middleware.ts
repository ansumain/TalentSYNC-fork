import multer, { FileFilterCallback } from 'multer'
import { Request, RequestHandler } from 'express'
import { allowedMimeTypes } from '@talentsync/config';

// accepts only allowed formats
const FileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (allowedMimeTypes.IMAGE.includes(file.mimetype) || allowedMimeTypes.PDF.includes(file.mimetype) || allowedMimeTypes.DOC.includes(file.mimetype) || allowedMimeTypes.DOCX.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error(`Invalid document type`) as any, false);
    }
}

// multer instance
const resumeUpload: RequestHandler = multer({
    storage: multer.memoryStorage(),
    fileFilter: FileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024   // 10MB
    }
}).array('resume')

export { resumeUpload };