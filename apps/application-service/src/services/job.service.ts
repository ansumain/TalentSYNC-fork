import { getAllJobsRepository, addJobRepository, getJobByIdRepository, updateExistingJobRepository, deleteExistingJobRepository } from "../repository/job.repository";
import { CreateJob } from "../types/Job.type";

const addAJob = async (job: CreateJob) => {
    const currentJobs = await addJobRepository(job);
    return currentJobs;
}

const getAllJobs = async (params: {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'ASC' | 'DESC';
    search?: string;
}) => {
    return getAllJobsRepository(params);
}

const getJobById = async (jobId: string) => {
    const job = await getJobByIdRepository(jobId);
    return job;
}

const updateExistingJob = async (jobId: string, job: Partial<CreateJob>) => {
    const updatedJobs = await updateExistingJobRepository(jobId, job);
    return updatedJobs;
}

const deleteExistingJob = async (jobId: string) => {
    const isDeleted = await deleteExistingJobRepository(jobId);
    if (isDeleted) return isDeleted;
}

export { addAJob, getAllJobs, getJobById, updateExistingJob, deleteExistingJob };