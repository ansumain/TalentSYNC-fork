import { config } from "../config/env";
import { publishToQueue } from "../config/rabbitmq";
import { badRequestError, internalServerError, isAppError } from '@talentsync/types';
import { addToResumeData } from "../repository/resume.repository";
import { ResumeModel } from "../types/ResumeModel.type";
import { UploadedFileModel } from "../types/UploadedFile.type";
import path from 'node:path';

// upload resume service
const uploadResume = async (files: UploadedFileModel[], userId: string, roleName: string): Promise<boolean> => {
    try {
        if (roleName === 'candidate' && files.length > 1) {
            throw badRequestError(
                'Candidates can only upload one resume at a time.',
                'MAX_ONE_RESUME_FOR_CANDIDATE'
            );
        }

        for (const file of files) {
            const resumeData = {
                userId,
                fileName: file.filename,
                mimeType: file.mimetype,
                fileURL: path.isAbsolute(file.path) ? file.path : path.join('/data', file.path),
                status: 'queued'
            } as ResumeModel
            const resumeId = await addToResumeData(resumeData);

            await publishToQueue(config.queues.resumeParse, { resumeId }, config.queues.retry)
        }

        return true;

    } catch (error: unknown) {
        if (isAppError(error)) {
            throw error;
        }

        throw internalServerError('Error uploading file(s)', 'UPLOAD_RESUME_FAILED');
    }
}

export { uploadResume }