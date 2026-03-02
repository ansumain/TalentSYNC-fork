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

const getAllJobsRepository = async () => {
    try {
        const currentJobs = await Job.findAll();
        return currentJobs;
    } catch {
        throw new Error('unable to get all jobs');
    }
};

const updateExistingJobRepository = async (jobId: string, job: Partial<CreateJob>) => {
    try {
        const existingJob = Job.findOne({ where: { jobId } });
        if (!existingJob) throw new Error('job not found');

        await Job.update({ ...job }, { where: { jobId } });

        return { message: 'updated' };
    } catch {
        throw new Error('unable to update job');
    }
};

const deleteExistingJobRepository = async (jobId: string) => {
    try {
        const existingJob = Job.findOne({ where: { jobId } });
        if (!existingJob) throw new Error('job not found');

        await Job.destroy({ where: { jobId } });

        return { message: 'deleted' };
    } catch {
        throw new Error('unable to delete job!');
    }

};

export { addJobRepository, getAllJobsRepository, updateExistingJobRepository, deleteExistingJobRepository }