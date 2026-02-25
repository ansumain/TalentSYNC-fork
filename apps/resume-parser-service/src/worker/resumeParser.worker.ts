import { connectRabbitMQ, consumeQueue } from "../config/rabbitmq";
import { config } from "../config/env";
import { parseResume } from "../services/parseResume.service";
import { getResumeByResumeId, updateAfterParsing, updateStatusByResumeId } from "../repository/resume.repository";

const startWorker = async () => {
    await connectRabbitMQ();

    console.log('Worker starting consuming')
    await consumeQueue(config.queues.resumeParse, async ({ resumeId }) => {
        try {
            // update resume status to processing
            await updateStatusByResumeId(resumeId, 'processing');
            const resume = await getResumeByResumeId(resumeId);
            if (!resume) throw new Error(`Resume not found`)
            const resumeData = await parseResume({ fileURL: resume.fileURL, mimeType: resume.mimeType });
            await updateAfterParsing(resumeId, resumeData);
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