import { getAllJobsRepository, addJobRepository, getJobByIdRepository, updateExistingJobRepository, deleteExistingJobRepository } from "../repository/job.repository";
import { CreateJob } from "../types/Job.type";

// add job
const addAJob = async (job: CreateJob) => {
    const currentJobs = await addJobRepository(job);
    return currentJobs;
}

// get all jobs
const getAllJobs = async (params: {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'ASC' | 'DESC';
    search?: string;
}) => {
    return getAllJobsRepository(params);
}

// get job by Id
const getJobById = async (jobId: string) => {
    const job = await getJobByIdRepository(jobId);
    return job;
}

// update job
const updateExistingJob = async (jobId: string, job: Partial<CreateJob>) => {
    const updatedJobs = await updateExistingJobRepository(jobId, job);
    return updatedJobs;
}

// delete job
const deleteExistingJob = async (jobId: string) => {
    const isDeleted = await deleteExistingJobRepository(jobId);
    if (isDeleted) return isDeleted;
}

export { addAJob, getAllJobs, getJobById, updateExistingJob, deleteExistingJob };