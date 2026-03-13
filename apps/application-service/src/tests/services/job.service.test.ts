import { addAJob, getAllJobs, getJobById, updateExistingJob, deleteExistingJob } from '../../services/job.service';
import {
    addJobRepository,
    getAllJobsRepository,
    getJobByIdRepository,
    updateExistingJobRepository,
    deleteExistingJobRepository,
} from '../../repository/job.repository';

jest.mock('../../repository/job.repository');

describe('JobService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // --- addAJob ---
    describe('addAJob', () => {
        it('creates and returns the new job', async () => {
            const jobData = {
                title: 'Backend Developer',
                description: 'Node.js role',
                openings: 2,
                location: 'Remote',
                jobType: 'full-time',
                createdBy: 'manager-1',
                skillIds: ['s1'],
            };
            const mockJob = { id: 'j1', ...jobData };
            (addJobRepository as jest.Mock).mockResolvedValue(mockJob);

            const result = await addAJob(jobData);

            expect(addJobRepository).toHaveBeenCalledWith(jobData);
            expect(result).toEqual(mockJob);
        });

        it('propagates repository errors', async () => {
            (addJobRepository as jest.Mock).mockRejectedValue(new Error('DB error'));

            await expect(addAJob({} as any)).rejects.toThrow('DB error');
        });
    });

    // --- getAllJobs ---
    describe('getAllJobs', () => {
        it('returns paginated job list', async () => {
            const params = { page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'DESC' as const };
            const mockResult = { data: [{ id: 'j1' }], total: 1, page: 1, limit: 10, totalPages: 1 };
            (getAllJobsRepository as jest.Mock).mockResolvedValue(mockResult);

            const result = await getAllJobs(params);

            expect(getAllJobsRepository).toHaveBeenCalledWith(params);
            expect(result).toEqual(mockResult);
        });

        it('returns empty result when no jobs', async () => {
            (getAllJobsRepository as jest.Mock).mockResolvedValue({ data: [], total: 0, page: 1, limit: 10, totalPages: 0 });

            const result = await getAllJobs({ page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'DESC' });

            expect(result.data).toHaveLength(0);
        });
    });

    // --- getJobById ---
    describe('getJobById', () => {
        it('returns job for valid id', async () => {
            const mockJob = { id: 'j1', title: 'Backend Developer' };
            (getJobByIdRepository as jest.Mock).mockResolvedValue(mockJob);

            const result = await getJobById('j1');

            expect(getJobByIdRepository).toHaveBeenCalledWith('j1');
            expect(result).toEqual(mockJob);
        });

        it('returns null when job not found', async () => {
            (getJobByIdRepository as jest.Mock).mockResolvedValue(null);

            const result = await getJobById('missing');

            expect(result).toBeNull();
        });
    });

    // --- updateExistingJob ---
    describe('updateExistingJob', () => {
        it('updates and returns the job', async () => {
            const updated = { id: 'j1', title: 'Senior Backend Developer' };
            (updateExistingJobRepository as jest.Mock).mockResolvedValue(updated);

            const result = await updateExistingJob('j1', { title: 'Senior Backend Developer' });

            expect(updateExistingJobRepository).toHaveBeenCalledWith('j1', { title: 'Senior Backend Developer' });
            expect(result).toEqual(updated);
        });

        it('propagates error on failure', async () => {
            (updateExistingJobRepository as jest.Mock).mockRejectedValue(new Error('DB error'));

            await expect(updateExistingJob('j1', {})).rejects.toThrow('DB error');
        });
    });

    // --- deleteExistingJob ---
    describe('deleteExistingJob', () => {
        it('returns truthy on successful delete', async () => {
            (deleteExistingJobRepository as jest.Mock).mockResolvedValue(1);

            const result = await deleteExistingJob('j1');

            expect(deleteExistingJobRepository).toHaveBeenCalledWith('j1');
            expect(result).toBeTruthy();
        });

        it('returns undefined when job not found to delete', async () => {
            (deleteExistingJobRepository as jest.Mock).mockResolvedValue(0);

            const result = await deleteExistingJob('missing');

            expect(result).toBeUndefined();
        });

        it('propagates error on failure', async () => {
            (deleteExistingJobRepository as jest.Mock).mockRejectedValue(new Error('DB error'));

            await expect(deleteExistingJob('j1')).rejects.toThrow('DB error');
        });
    });
});
