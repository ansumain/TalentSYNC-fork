import { Request, Response } from 'express';
import { uploadResume } from '../services/uploadResume.service';
import { UploadedFileModel } from '../types/UploadedFile.type';

export class ResumeUploaderController {
    static async uploadResume(req: Request, res: Response): Promise<void> {
        try {
            if (!req.files || (req.files as any).length === 0) throw new Error('No File Uploaded');

            const files = req.files as unknown as UploadedFileModel[];

            const result = await uploadResume(files);
            if (result) {
                res.status(201).json({
                    message: 'File upload successful'
                });
            }

        } catch (e: any) {
            const errorMessage = e.message || 'Internal server error';
            res.status(500).json({ error: errorMessage });
        }
    }
}
