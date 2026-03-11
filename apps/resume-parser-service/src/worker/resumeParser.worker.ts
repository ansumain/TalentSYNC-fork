import { connectRabbitMQ, consumeQueue } from "../config/rabbitmq";
import { config } from "../config/env";
import { parseResume } from "../services/parseResume.service";
import { getResumeByResumeId, updateAfterParsing, updateStatusByResumeId } from "../repository/resume.repository";
import { linkOrCreateUserForResume } from "../utils/linkOrCreateUserForResume";

// function to start the worker - resume parising worker
const startWorker = async () => {
    // connects to rabbitMQ
    await connectRabbitMQ().catch((err) => {
        console.log('Initial Connection Failed! Reconnecting...', err);
    });

    console.log('Worker starting consuming')
    // starts the consumption of the messages from the queue
    await consumeQueue(config.queues.resumeParse, async ({ resumeId }) => {
        try {
            // update resume status to processing
            await updateStatusByResumeId(resumeId, 'processing');

            // get the resume data from the consumed message - resumeId
            const resume = await getResumeByResumeId(resumeId);
            if (!resume) throw new Error(`Resume not found`);

            // calls the parsing functions passing the resume path to parse the resumes
            const resumeData = await parseResume({ fileURL: resume.fileURL, mimeType: resume.mimeType });
            await updateAfterParsing(resumeId, resumeData);

            // link resume to existing user or create user 
            await linkOrCreateUserForResume(resumeId, resume.userId, resumeData.parsedJSON);

            // update resume status to completed
            await updateStatusByResumeId(resumeId, 'completed');
        } catch (e: any) {
            // update resume status to failed
            await updateStatusByResumeId(resumeId, 'failed', e.message);
            throw e;
        }
    })

}

startWorker().catch(console.error);