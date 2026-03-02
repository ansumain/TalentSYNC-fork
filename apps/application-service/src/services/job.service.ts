import { getAllJobsRepository, addJobRepository, updateExistingJobRepository } from "../repository/job.repository";
import { CreateJob } from "../types/Job.type";

const addAJob = async (job: CreateJob) => {
    const currentJobs = await addJobRepository(job);
    return currentJobs;
}

const getAllJobs = async () => {
    const currentJobs = await getAllJobsRepository();
    return currentJobs;
}

const updateExistingJob = async (jobId: string, job: Partial<CreateJob>) => {
    const updatedJobs = await updateExistingJobRepository(jobId, job);
    return updatedJobs;
}

export { addAJob, getAllJobs, updateExistingJob };