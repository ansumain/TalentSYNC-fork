import { config } from "../config/env";
import { publishToQueue } from "../config/rabbitmq";
import { badRequestError, internalServerError, isAppError } from '@talentsync/types';
import { addToResumeData } from "../repository/resume.repository";
import { ResumeModel } from "../types/ResumeModel.type";
import { UploadedFileModel } from "../types/UploadedFile.type";
import { buildMinioFileURL, buildMinioObjectKey, uploadResumeObject } from "./minio-storage.service";

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
            if (!file.buffer || file.buffer.length === 0) {
                throw badRequestError('Invalid upload payload', 'INVALID_UPLOAD_PAYLOAD');
            }

            const objectKey = buildMinioObjectKey(file.originalname);
            await uploadResumeObject(objectKey, file);

            const resumeData = {
                userId,
                fileName: objectKey,
                mimeType: file.mimetype,
                fileURL: buildMinioFileURL(objectKey),
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