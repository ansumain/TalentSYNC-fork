import { Request, Response } from 'express';
import { badRequestError } from '@talentsync/types';
import { addAJob, deleteExistingJob, getJobById, getAllJobs, updateExistingJob } from '../services/job.service';
import { CreateJob } from '../types/Job.type';
import { parsePaginationParams } from '../utils/parsePaginationParams';

export class JobController {

    // add job
    static async addAJob(req: Request, res: Response): Promise<void> {
        try {

            if (!req.body.title ||
                !req.body.description ||
                req.body.openings === undefined ||
                !req.body.location ||
                !req.body.jobType
            ) throw badRequestError('missing required field', 'MISSING_REQUIRED_FIELD');

            const userId = req.userInfo.sub as string;

            const { title, description, location, jobType, openings, skillIds } = req.body;

            if (!Number.isInteger(openings) || openings < 1) {
                throw badRequestError('invalid openings', 'INVALID_OPENINGS');
            }

            const newJob = {
                title: title.trim(),
                description: description.trim(),
                location: location.trim(),
                jobType: jobType.trim(),
                openings,
                createdBy: userId.trim(),
                skillIds: Array.isArray(skillIds) ? skillIds : [],
            }

            for (const key of Object.keys(newJob) as Array<keyof typeof newJob>)
                if (typeof newJob[key] === 'string' && newJob[key].length === 0) {
                    throw badRequestError('missing required field', 'MISSING_REQUIRED_FIELD');
                }

            const newJobCreated = await addAJob(newJob);

            if (newJobCreated) {
                res.status(201).json(newJobCreated);
            }

        } catch (error) {
            throw error;
        }
    }

    // get all jobs
    static async getAllJobs(req: Request, res: Response): Promise<void> {
        try {
            const { page, limit, sortBy, sortOrder, search } = parsePaginationParams(req.query);

            const result = await getAllJobs({ page, limit, sortBy, sortOrder, search });

            res.status(200).json({
                currentJobs: result.data,
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages,
            });
        } catch (error) {
            throw error;
        }
    }

    // get job by job Id
    static async getJobById(req: Request, res: Response): Promise<void> {
        try {

            if (!req.params.jobId) throw badRequestError('Missing required field', 'MISSING_REQUIRED_FIELD');
            const jobId = req.params.jobId as string;

            const job = await getJobById(jobId);

            if (job) {
                res.status(200).json({ job });
            }

        } catch (error) {
            throw error;
        }
    }

    // update job
    static async updateExistingJob(req: Request, res: Response): Promise<void> {
        try {
            if (!req.params.jobId) throw badRequestError('Missing required field', 'MISSING_REQUIRED_FIELD');
            const jobId = req.params.jobId as string;

            const { title, description, location, jobType, openings } = req.body;

            let fieldsToUpdate: Partial<CreateJob> = {};
            if (title) fieldsToUpdate.title = title.trim();
            if (description) fieldsToUpdate.description = description.trim();
            if (location) fieldsToUpdate.location = location.trim();
            if (jobType) fieldsToUpdate.jobType = jobType.trim();

            if (openings !== undefined) {
                if (!Number.isInteger(openings) || openings < 1) {
                    throw badRequestError('invalid openings', 'INVALID_OPENINGS');
                }
                fieldsToUpdate.openings = openings;
            }

            if (Object.keys(fieldsToUpdate).length === 0) {
                throw badRequestError('no input', 'NO_INPUT');
            }

            const updatedJob = await updateExistingJob(jobId, fieldsToUpdate);

            if (updatedJob) {
                res.status(200).json(updatedJob);
            }

        } catch (error) {
            throw error;
        }
    }

    // delete job
    static async deleteExistingJob(req: Request, res: Response): Promise<void> {
        try {

            if (!req.params.jobId) throw badRequestError('Missing required field', 'MISSING_REQUIRED_FIELD');
            const jobId = req.params.jobId as string;

            const deleteJob = await deleteExistingJob(jobId);
            if (deleteJob) res.status(204).send();

        } catch (error) {
            throw error;
        }
    }
}