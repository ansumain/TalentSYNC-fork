import { config } from "../config/env";
import { publishToQueue } from "../config/rabbitmq";
import { addToResumeData } from "../repository/resume.repository";
import { ResumeModel } from "../types/ResumeModel.type";
import { UploadedFileModel } from "../types/UploadedFile.type";

const uploadResume = async (files: UploadedFileModel[]): Promise<boolean> => {
    try {
        const userId = '49c7305a-daeb-4f16-84ee-35928c25619a';

        for (const file of files) {
            const resumeData = {
                userId,
                fileName: file.filename,
                mimeType: file.mimetype,
                fileURL: file.path,
                status: 'queued'
            } as ResumeModel
            const resumeId = await addToResumeData(resumeData);

            await publishToQueue(config.queues.resumeParse, { resumeId }, config.queues.retry)
        }

        return true;

    } catch (e: any) {
        throw new Error('Error uploading file(s):', e);
    }
}

export { uploadResume }