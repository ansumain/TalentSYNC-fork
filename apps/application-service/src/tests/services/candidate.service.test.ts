import {
    getCandiateParsedData,
    getCandidateDataFromUserId,
    getCandidateDataFromResumeId,
    getMyResumeStatus,
    getMyResumes,
} from '../../services/candidate.service';
import {
    getAllCandidatesParsedJSONRepository,
    getCandidateDataFromUserIdRepository,
    getCandidateDataFromResumeIdRepository,
    getMyResumeStatusRepository,
} from '../../repository/candidate.repository';

jest.mock('../../repository/candidate.repository');

describe('CandidateService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // --- getCandiateParsedData ---
    describe('getCandiateParsedData', () => {
        it('returns paginated result from repository', async () => {
            const params = { page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'DESC' as const };
            const mockResult = { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
            (getAllCandidatesParsedJSONRepository as jest.Mock).mockResolvedValue(mockResult);

            const result = await getCandiateParsedData(params);

            expect(getAllCandidatesParsedJSONRepository).toHaveBeenCalledWith(params);
            expect(result).toEqual(mockResult);
        });

        it('propagates repository errors', async () => {
            (getAllCandidatesParsedJSONRepository as jest.Mock).mockRejectedValue(new Error('DB error'));

            await expect(getCandiateParsedData({ page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'DESC' }))
                .rejects.toThrow('DB error');
        });
    });

    // --- getCandidateDataFromUserId ---
    describe('getCandidateDataFromUserId', () => {
        it('returns candidate data for a valid userId', async () => {
            const mockData = [{ id: 'r1', parsedJSON: { name: 'Anshuman Panda' } }];
            (getCandidateDataFromUserIdRepository as jest.Mock).mockResolvedValue(mockData);

            const result = await getCandidateDataFromUserId('user-1');

            expect(getCandidateDataFromUserIdRepository).toHaveBeenCalledWith('user-1');
            expect(result).toEqual(mockData);
        });

        it('returns empty array when no resumes found', async () => {
            (getCandidateDataFromUserIdRepository as jest.Mock).mockResolvedValue([]);

            const result = await getCandidateDataFromUserId('user-none');

            expect(result).toEqual([]);
        });
    });

    // --- getCandidateDataFromResumeId ---
    describe('getCandidateDataFromResumeId', () => {
        it('returns candidate data for a valid resumeId', async () => {
            const mockData = { id: 'r1', parsedJSON: { name: 'Anshuman Panda' } };
            (getCandidateDataFromResumeIdRepository as jest.Mock).mockResolvedValue(mockData);

            const result = await getCandidateDataFromResumeId('r1');

            expect(getCandidateDataFromResumeIdRepository).toHaveBeenCalledWith('r1');
            expect(result).toEqual(mockData);
        });

        it('returns null when resume not found', async () => {
            (getCandidateDataFromResumeIdRepository as jest.Mock).mockResolvedValue(null);

            const result = await getCandidateDataFromResumeId('missing');

            expect(result).toBeNull();
        });
    });

    // --- getMyResumeStatus ---
    describe('getMyResumeStatus', () => {
        it('returns true when user has resumes', async () => {
            (getMyResumeStatusRepository as jest.Mock).mockResolvedValue(true);

            const result = await getMyResumeStatus('user-1');

            expect(getMyResumeStatusRepository).toHaveBeenCalledWith('user-1');
            expect(result).toBe(true);
        });

        it('returns false when user has no resumes', async () => {
            (getMyResumeStatusRepository as jest.Mock).mockResolvedValue(false);

            const result = await getMyResumeStatus('user-1');

            expect(result).toBe(false);
        });
    });

    // --- getMyResumes ---
    describe('getMyResumes', () => {
        it('returns all resumes for the user', async () => {
            const mockResumes = [{ id: 'r1', fileName: 'cv.pdf' }];
            (getCandidateDataFromUserIdRepository as jest.Mock).mockResolvedValue(mockResumes);

            const result = await getMyResumes('user-1');

            expect(getCandidateDataFromUserIdRepository).toHaveBeenCalledWith('user-1');
            expect(result).toEqual(mockResumes);
        });
    });
});
