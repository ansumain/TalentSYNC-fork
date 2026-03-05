import { CreateJob } from "../types/Job.type";
import { Job, JobSkill } from '@talentsync/models';

const addJobRepository = async (job: CreateJob) => {
    try {
        const { skillIds, ...jobData } = job;
        const newJob = await Job.create(jobData);

        if (skillIds && skillIds.length > 0) {
            const jobSkills = skillIds.map(skillId => ({
                jobId: newJob.jobId,
                skillId,
            }));
            await JobSkill.bulkCreate(jobSkills);
        }

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