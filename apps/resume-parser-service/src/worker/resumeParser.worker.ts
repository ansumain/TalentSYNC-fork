import { connectRabbitMQ, consumeQueue } from "../config/rabbitmq";
import { config } from "../config/env";
import { parseResume } from "../services/parseResume.service";
import { getResumeByResumeId, updateAfterParsing, updateStatusByResumeId } from "../repository/resume.repository";
import { linkOrCreateUserForResume } from "../utils/linkOrCreateUserForResume";
import { cleanupTempFile, downloadResumeObjectToTempFile, getObjectKeyFromFileURL } from "../services/minio-storage.service";
import { logger } from "@talentsync/config";

// function to start the worker - resume parising worker
const startWorker = async () => {
    // connects to rabbitMQ
    await connectRabbitMQ().catch((err) => {
        logger.info(`Initial Connection Failed! Reconnecting... : ${err}`);
    });

    logger.info('Worker starting consuming')
    // starts the consumption of the messages from the queue
    await consumeQueue(config.queues.resumeParse, async ({ resumeId }) => {
        try {
            // update resume status to processing
            await updateStatusByResumeId(resumeId, 'processing');

            // get the resume data from the consumed message - resumeId
            const resume = await getResumeByResumeId(resumeId);
            if (!resume) throw new Error(`Resume not found`);

            const objectKey = getObjectKeyFromFileURL(resume.fileURL);
            if (!objectKey) {
                throw new Error('Invalid MinIO file reference');
            }

            const tempFilePath = await downloadResumeObjectToTempFile(objectKey);
            let resumeData: Awaited<ReturnType<typeof parseResume>>;

            try {
                // calls the parsing functions passing the temporary path to parse the resumes
                resumeData = await parseResume({ fileURL: tempFilePath, mimeType: resume.mimeType });
            } finally {
                await cleanupTempFile(tempFilePath).catch((cleanupError) => {
                    logger.warn(`Temp file cleanup failed: ${cleanupError}`);
                });
            }

            await updateAfterParsing(resumeId, resumeData);

            // link resume to existing user or create user 
            await linkOrCreateUserForResume(resumeId, resume.userId, resumeData.parsedJSON).catch((linkError) => {
                logger.warn(`User linking skipped for resume ${resumeId}: ${linkError}`);
            });

            // update resume status to completed
            await updateStatusByResumeId(resumeId, 'completed');
        } catch (e: unknown) {
            // update resume status to failed
            const errorMessage = e instanceof Error ? e.message : 'parsing failed';
            await updateStatusByResumeId(resumeId, 'failed', errorMessage);
            throw e;
        }
    })

}

startWorker().catch(logger.error);