import { Request, Response } from 'express';
import { badRequestError } from '@talentsync/types';
import { uploadResume } from '../services/uploadResume.service';
import { UploadedFileModel } from '../types/UploadedFile.type';

export class ResumeUploaderController {
    // upload resume controller
    static async uploadResume(req: Request, res: Response): Promise<void> {
        try {
            if (!req.files || (req.files as any).length === 0) {
                throw badRequestError('No File Uploaded', 'NO_FILE_UPLOADED');
            }
            const userId = req.userInfo.sub as string;
            const roleName = req.userInfo.role.name;

            const files = req.files as unknown as UploadedFileModel[];

            const result = await uploadResume(files, userId, roleName);
            if (result) {
                res.status(201).json({
                    message: 'File upload successful'
                });
            }

        } catch (error) {
            throw error;
        }
    }
}