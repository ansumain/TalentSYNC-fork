import { Request, Response } from 'express';
import { InterviewController } from '../../controllers/interview.controller';
import {
    getAvailableInterviewers,
    scheduleInterview,
    getAllInterviews,
    getInterviewById,
    deleteExistingInterview,
} from '../../services/interview.service';

jest.mock('../../services/interview.service');

describe('InterviewController', () => {
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

    // --- getAvailableInterviewers ---
    describe('getAvailableInterviewers', () => {
        it('200 - returns available interviewers', async () => {
            const mockInterviewers = [{ id: 'u1', name: 'Interviewer One' }];
            mockRequest.body = { date: '2026-03-15', applicationId: 'app-1' };
            (getAvailableInterviewers as jest.Mock).mockResolvedValue(mockInterviewers);

            await InterviewController.getAvailableInterviewers(mockRequest as Request, mockResponse as Response);

            expect(getAvailableInterviewers).toHaveBeenCalledWith('2026-03-15', 'app-1');
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ availableInterviewers: mockInterviewers });
        });

        it('500 - returns error on failure', async () => {
            mockRequest.body = { date: '2026-03-15', applicationId: 'app-1' };
            (getAvailableInterviewers as jest.Mock).mockRejectedValue(new Error('DB error'));

            await InterviewController.getAvailableInterviewers(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'DB error' });
        });
    });

    // --- scheduleInterview ---
    describe('scheduleInterview', () => {
        const validBody = {
            applicationId: 'app-1',
            interviewerId: 'interviewer-1',
            managerId: 'manager-1',
            scheduledAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
        };

        it('201 - schedules interview with valid data', async () => {
            mockRequest.body = { ...validBody };
            const mockInterview = { id: 'i1', ...validBody };
            (scheduleInterview as jest.Mock).mockResolvedValue(mockInterview);

            await InterviewController.scheduleInterview(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(mockInterview);
        });

        it('400 - returns error for missing required field', async () => {
            mockRequest.body = { applicationId: 'app-1' }; // missing interviewerId, managerId, scheduledAt

            await InterviewController.scheduleInterview(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'missing required field' });
        });

        it('400 - returns error for invalid date', async () => {
            mockRequest.body = { ...validBody, scheduledAt: 'not-a-date' };

            await InterviewController.scheduleInterview(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'invalid date' });
        });

        it('500 - returns error on service failure', async () => {
            mockRequest.body = { ...validBody };
            (scheduleInterview as jest.Mock).mockRejectedValue(new Error('DB error'));

            await InterviewController.scheduleInterview(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
        });
    });

    // --- getAllInterviews ---
    describe('getAllInterviews', () => {
        it('200 - returns all interviews', async () => {
            const mockInterviews = [{ id: 'i1' }, { id: 'i2' }];
            (getAllInterviews as jest.Mock).mockResolvedValue(mockInterviews);

            await InterviewController.getAllInterviews(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ scheduledInterviews: mockInterviews });
        });

        it('500 - returns error on failure', async () => {
            (getAllInterviews as jest.Mock).mockRejectedValue(new Error('DB error'));

            await InterviewController.getAllInterviews(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
        });
    });

    // --- getInterviewById ---
    describe('getInterviewById', () => {
        it('200 - returns interview by id', async () => {
            const mockInterview = { id: 'i1', applicationId: 'app-1' };
            mockRequest.params = { interviewId: 'i1' };
            (getInterviewById as jest.Mock).mockResolvedValue(mockInterview);

            await InterviewController.getInterviewById(mockRequest as Request, mockResponse as Response);

            expect(getInterviewById).toHaveBeenCalledWith('i1');
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ interview: mockInterview });
        });

        it('404 - returns not found when interview missing', async () => {
            mockRequest.params = { interviewId: 'missing' };
            (getInterviewById as jest.Mock).mockRejectedValue(new Error('interview not found'));

            await InterviewController.getInterviewById(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'interview not found' });
        });
    });

    // --- deleteExistingInterview ---
    describe('deleteExistingInterview', () => {
        it('200 - deletes interview successfully', async () => {
            mockRequest.params = { interviewId: 'i1' };
            (deleteExistingInterview as jest.Mock).mockResolvedValue(true);

            await InterviewController.deleteExistingInterview(mockRequest as Request, mockResponse as Response);

            expect(deleteExistingInterview).toHaveBeenCalledWith('i1');
            expect(mockResponse.status).toHaveBeenCalledWith(204);
        });

        it('500 - returns error on failure', async () => {
            mockRequest.params = { interviewId: 'i1' };
            (deleteExistingInterview as jest.Mock).mockRejectedValue(new Error('DB error'));

            await InterviewController.deleteExistingInterview(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
        });
    });
});
