import { Request, Response } from 'express';
import { CandidateController } from '../../controllers/candidate.controller';
import {
    getCandiateParsedData,
    getCandidateDataFromResumeId,
    getCandidateDataFromUserId,
    getMyResumeStatus,
    getMyResumes,
} from '../../services/candidate.service';

jest.mock('../../services/candidate.service');
jest.mock('../../utils/parsePaginationParams', () => ({
    parsePaginationParams: jest.fn(() => ({
        page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'DESC', search: undefined,
    })),
}));

describe('CandidateController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        jest.clearAllMocks();
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        mockRequest = {
            userInfo: { sub: 'user-123', role: { name: 'admin' } } as any,
            body: {},
            query: {},
        };
    });

    // --- getMyResumeStatus ---
    describe('getMyResumeStatus', () => {
        it('200 - returns hasResume true when resume exists', async () => {
            (getMyResumeStatus as jest.Mock).mockResolvedValue(true);

            await CandidateController.getMyResumeStatus(mockRequest as Request, mockResponse as Response);

            expect(getMyResumeStatus).toHaveBeenCalledWith('user-123');
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ hasResume: true });
        });

        it('200 - returns hasResume false when no resume', async () => {
            (getMyResumeStatus as jest.Mock).mockResolvedValue(false);

            await CandidateController.getMyResumeStatus(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ hasResume: false });
        });

        it('500 - returns error on unexpected failure', async () => {
            (getMyResumeStatus as jest.Mock).mockRejectedValue(new Error('DB error'));

            await CandidateController.getMyResumeStatus(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'DB error' });
        });
    });

    // --- getCandidateJSONData ---
    describe('getCandidateJSONData', () => {
        it('200 - returns paginated candidate data', async () => {
            const mockResult = {
                data: [{ id: 'r1', parsedJSON: { name: 'Anshuman Panda' } }],
                total: 1, page: 1, limit: 10, totalPages: 1,
            };
            (getCandiateParsedData as jest.Mock).mockResolvedValue(mockResult);

            await CandidateController.getCandidateJSONData(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                candidateJSONData: mockResult.data,
                total: 1, page: 1, limit: 10, totalPages: 1,
            });
        });

        it('500 - returns error on service failure', async () => {
            (getCandiateParsedData as jest.Mock).mockRejectedValue(new Error('Query failed'));

            await CandidateController.getCandidateJSONData(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Query failed' });
        });
    });

    // --- getCandidateDataFromUserId ---
    describe('getCandidateDataFromUserId', () => {
        it('403 - denies access for candidate role', async () => {
            mockRequest.userInfo = { sub: 'user-123', role: { name: 'candidate' } } as any;

            await CandidateController.getCandidateDataFromUserId(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(403);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Access denied.' });
        });

        it('400 - returns error when userId query param missing', async () => {
            mockRequest.query = {};

            await CandidateController.getCandidateDataFromUserId(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'userId is required' });
        });

        it('200 - returns candidate data for valid userId', async () => {
            const mockData = [{ id: 'r1', parsedJSON: { name: 'Anshuman Panda' } }];
            mockRequest.query = { userId: 'user-456' };
            (getCandidateDataFromUserId as jest.Mock).mockResolvedValue(mockData);

            await CandidateController.getCandidateDataFromUserId(mockRequest as Request, mockResponse as Response);

            expect(getCandidateDataFromUserId).toHaveBeenCalledWith('user-456');
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ candidateData: mockData });
        });
    });

    // --- getMyResumes ---
    describe('getMyResumes', () => {
        it('200 - returns current user resumes', async () => {
            const mockResumes = [{ id: 'r1', fileName: 'cv.pdf' }];
            (getMyResumes as jest.Mock).mockResolvedValue(mockResumes);

            await CandidateController.getMyResumes(mockRequest as Request, mockResponse as Response);

            expect(getMyResumes).toHaveBeenCalledWith('user-123');
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ resumes: mockResumes });
        });

        it('500 - returns error on failure', async () => {
            (getMyResumes as jest.Mock).mockRejectedValue(new Error('DB error'));

            await CandidateController.getMyResumes(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
        });
    });

    // --- getCandidateDataFromResumeId ---
    describe('getCandidateDataFromResumeId', () => {
        it('200 - returns candidate data for a valid resumeId', async () => {
            const mockData = { id: 'r1', parsedJSON: { name: 'Anshuman Panda' } };
            mockRequest.body = { resumeId: 'r1' };
            (getCandidateDataFromResumeId as jest.Mock).mockResolvedValue(mockData);

            await CandidateController.getCandidateDataFromResumeId(mockRequest as Request, mockResponse as Response);

            expect(getCandidateDataFromResumeId).toHaveBeenCalledWith('r1');
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ candidateData: mockData });
        });

        it('500 - returns error on failure', async () => {
            mockRequest.body = { resumeId: 'r1' };
            (getCandidateDataFromResumeId as jest.Mock).mockRejectedValue(new Error('Not found'));

            await CandidateController.getCandidateDataFromResumeId(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
        });
    });
});
