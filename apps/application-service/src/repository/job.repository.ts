import { CreateJob } from "../types/Job.type";
import { Job, JobSkill, Skill } from '@talentsync/models';
import { Op } from 'sequelize';

const JOB_SORT_FIELDS = new Set(['title', 'location', 'jobType', 'openings', 'createdAt', 'updatedAt']);

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

const getAllJobsRepository = async (params: {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'ASC' | 'DESC';
    search?: string;
}) => {
    try {
        const { page, limit, sortOrder, search } = params;
        const sortBy = JOB_SORT_FIELDS.has(params.sortBy) ? params.sortBy : 'createdAt';
        const offset = (page - 1) * limit;

        const where: any = {};
        if (search) {
            where.title = { [Op.iLike]: `%${search}%` };
        }

        const { count, rows } = await Job.findAndCountAll({
            where,
            order: [[sortBy, sortOrder]],
            limit,
            offset,
        });

        return {
            data: rows,
            total: count as unknown as number,
            page,
            limit,
            totalPages: Math.ceil((count as unknown as number) / limit),
        };
    } catch (error: any) {
        throw error;
    }
};

const getJobByIdRepository = async (jobId: string) => {
    try {
        const job = await Job.findOne({ where: { jobId } });
        if (!job) throw new Error('job not found');

        const jobSkills = await JobSkill.findAll({
            where: { jobId },
            include: [{ model: Skill, as: 'skill', attributes: ['skillId', 'skillName'] }],
        });

        const skills = jobSkills.map((js: any) => js.skill);
        return { ...job.toJSON(), skills };
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