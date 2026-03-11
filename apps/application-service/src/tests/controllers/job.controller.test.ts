import { Request, Response } from 'express';
import { JobController } from '../../controllers/job.controller';
import { addAJob, getAllJobs, getJobById, updateExistingJob, deleteExistingJob } from '../../services/job.service';

jest.mock('../../services/job.service');
jest.mock('../../utils/parsePaginationParams', () => ({
    parsePaginationParams: jest.fn(() => ({
        page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'DESC', search: undefined,
    })),
}));

describe('JobController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        jest.clearAllMocks();
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
        };
        mockRequest = {
            userInfo: { sub: 'manager-1', role: { name: 'manager' } } as any,
            body: {},
            params: {},
            query: {},
        };
    });

    // --- addAJob ---
    describe('addAJob', () => {
        const validJobBody = {
            title: 'Backend Developer',
            description: 'Node.js developer role',
            openings: 2,
            location: 'Remote',
            jobType: 'full-time',
            skillIds: ['skill-1'],
        };

        it('201 - creates a job with valid data', async () => {
            mockRequest.body = { ...validJobBody };
            const mockJob = { id: 'j1', ...validJobBody };
            (addAJob as jest.Mock).mockResolvedValue(mockJob);

            await JobController.addAJob(mockRequest as Request, mockResponse as Response);

            expect(addAJob).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(mockJob);
        });

        it('400 - returns error for missing required field', async () => {
            mockRequest.body = { description: 'desc', openings: 1, location: 'Remote', jobType: 'full-time' }; // missing title

            await JobController.addAJob(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
        });

        it('400 - returns error for invalid openings (zero)', async () => {
            mockRequest.body = { ...validJobBody, openings: 0 };

            await JobController.addAJob(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'invalid openings' });
        });

        it('400 - returns error for non-integer openings', async () => {
            mockRequest.body = { ...validJobBody, openings: 1.5 };

            await JobController.addAJob(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
        });

        it('500 - returns error on service failure', async () => {
            mockRequest.body = { ...validJobBody };
            (addAJob as jest.Mock).mockRejectedValue(new Error('DB error'));

            await JobController.addAJob(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
        });
    });

    // --- getAllJobs ---
    describe('getAllJobs', () => {
        it('200 - returns paginated list of jobs', async () => {
            const mockResult = {
                data: [{ id: 'j1', title: 'Backend Developer' }],
                total: 1, page: 1, limit: 10, totalPages: 1,
            };
            (getAllJobs as jest.Mock).mockResolvedValue(mockResult);

            await JobController.getAllJobs(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                currentJobs: mockResult.data,
                total: 1, page: 1, limit: 10, totalPages: 1,
            });
        });

        it('500 - returns error on failure', async () => {
            (getAllJobs as jest.Mock).mockRejectedValue(new Error('DB error'));

            await JobController.getAllJobs(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
        });
    });

    // --- getJobById ---
    describe('getJobById', () => {
        it('200 - returns job by id', async () => {
            const mockJob = { id: 'j1', title: 'Backend Developer' };
            mockRequest.params = { jobId: 'j1' };
            (getJobById as jest.Mock).mockResolvedValue(mockJob);

            await JobController.getJobById(mockRequest as Request, mockResponse as Response);

            expect(getJobById).toHaveBeenCalledWith('j1');
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ job: mockJob });
        });

        it('404 - returns not found when job missing', async () => {
            mockRequest.params = { jobId: 'missing' };
            (getJobById as jest.Mock).mockRejectedValue(new Error('job not found'));

            await JobController.getJobById(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'job not found' });
        });
    });

    // --- updateExistingJob ---
    describe('updateExistingJob', () => {
        it('200 - updates job with valid data', async () => {
            mockRequest.params = { jobId: 'j1' };
            mockRequest.body = { title: 'Senior Backend Developer' };
            (updateExistingJob as jest.Mock).mockResolvedValue({ id: 'j1', title: 'Senior Backend Developer' });

            await JobController.updateExistingJob(mockRequest as Request, mockResponse as Response);

            expect(updateExistingJob).toHaveBeenCalledWith('j1', expect.objectContaining({ title: 'Senior Backend Developer' }));
            expect(mockResponse.status).toHaveBeenCalledWith(200);
        });

        it('500 - returns error on failure', async () => {
            mockRequest.params = { jobId: 'j1' };
            mockRequest.body = { title: 'Updated Title' };
            (updateExistingJob as jest.Mock).mockRejectedValue(new Error('DB error'));

            await JobController.updateExistingJob(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
        });
    });

    // --- deleteExistingJob ---
    describe('deleteExistingJob', () => {
        it('200 - deletes job successfully', async () => {
            mockRequest.params = { jobId: 'j1' };
            (deleteExistingJob as jest.Mock).mockResolvedValue(true);

            await JobController.deleteExistingJob(mockRequest as Request, mockResponse as Response);

            expect(deleteExistingJob).toHaveBeenCalledWith('j1');
            expect(mockResponse.status).toHaveBeenCalledWith(204);
        });

        it('500 - returns error on failure', async () => {
            mockRequest.params = { jobId: 'j1' };
            (deleteExistingJob as jest.Mock).mockRejectedValue(new Error('DB error'));

            await JobController.deleteExistingJob(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
        });
    });
});
