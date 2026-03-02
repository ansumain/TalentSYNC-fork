import { getAllJobsRepository, addJobRepository } from "../repository/job.repository";
import { CreateJob } from "../types/Job.type";

const addAJob = async (job: CreateJob) => {
    const currentJobs = await addJobRepository(job);
    return currentJobs;
}

const getAllJobs = async () => {
    const currentJobs = await getAllJobsRepository();
    return currentJobs;
}

export { addAJob, getAllJobs };