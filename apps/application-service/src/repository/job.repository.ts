import { CreateJob } from "../types/Job.type";
import { Job } from '@talentsync/models';

const addJobRepository = async (job: CreateJob) => {
    try {
        const newJob = await Job.create(job);
        return newJob;
    } catch {
        throw new Error('uable to create new job');
    }
};

export { addJobRepository }