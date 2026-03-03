import { CreateJob } from "../types/Job.type";
import { Job } from '@talentsync/models';

const addJobRepository = async (job: CreateJob) => {
    try {
        const newJob = await Job.create(job);
        return newJob;
    } catch (error: any) {
        throw error;
    }
};

const getAllJobsRepository = async () => {
    try {
        const currentJobs = await Job.findAll();
        return currentJobs;
    } catch (error: any) {
        throw error;
    }
};

const getJobByIdRepository = async (jobId: string) => {
    try {
        const job = await Job.findOne({ where: { jobId } });
        if (!job) throw new Error('job not found');
        return job;
    } catch (error: any) {
        throw error;
    }
}

const updateExistingJobRepository = async (jobId: string, job: Partial<CreateJob>) => {
    try {
        const existingJob = await Job.findOne({ where: { jobId } });
        if (!existingJob) throw new Error('job not found');

        await Job.update({ ...job }, { where: { jobId } });

        return { message: 'updated' };
    } catch (error: any) {
        throw error;
    }
};

const deleteExistingJobRepository = async (jobId: string) => {
    try {
        const existingJob = await Job.findOne({ where: { jobId } });
        if (!existingJob) throw new Error('job not found');

        await Job.destroy({ where: { jobId } });

        return { message: 'deleted' };
    } catch (error: any) {
        throw error;
    }

};

export { addJobRepository, getAllJobsRepository, getJobByIdRepository, updateExistingJobRepository, deleteExistingJobRepository }