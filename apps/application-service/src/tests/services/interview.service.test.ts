import {
    getAvailableInterviewers,
    scheduleInterview,
    getAllInterviews,
    getInterviewById,
    getInterviewsByJobId,
    updateExistingInterview,
    deleteExistingInterview,
} from '../../services/interview.service';
import {
    getAvailableInterviewersRepository,
    getDatedInterviewCountRepository,
    checkInterviewerEligibilityRepository,
    scheduleInterviewRepository,
    getAllInterviewsRepository,
    getInterviewByIdRepository,
    getInterviewsByJobIdRepository,
    updateExistingInterviewRepository,
    deleteExistingInterviewRepository,
} from '../../repository/interview.repository';

jest.mock('../../repository/interview.repository');

describe('InterviewService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // --- getAvailableInterviewers ---
    describe('getAvailableInterviewers', () => {
        it('returns interviewers who are eligible and have < 10 interviews on the date', async () => {
            const mockInterviewers = [{ id: 'u1' }, { id: 'u2' }];
            (getAvailableInterviewersRepository as jest.Mock).mockResolvedValue(mockInterviewers);
            (getDatedInterviewCountRepository as jest.Mock).mockResolvedValue(5); // under limit
            (checkInterviewerEligibilityRepository as jest.Mock).mockResolvedValue(true);

            const result = await getAvailableInterviewers('2026-03-15', 'app-1');

            expect(getAvailableInterviewersRepository).toHaveBeenCalled();
            expect(result).toHaveLength(2);
        });

        it('excludes interviewers with 10+ interviews on the date', async () => {
            const mockInterviewers = [{ id: 'u1' }];
            (getAvailableInterviewersRepository as jest.Mock).mockResolvedValue(mockInterviewers);
            (getDatedInterviewCountRepository as jest.Mock).mockResolvedValue(11); // over limit

            const result = await getAvailableInterviewers('2026-03-15', 'app-1');

            expect(result).toHaveLength(0);
        });

        it('excludes interviewers who are not eligible for the application', async () => {
            const mockInterviewers = [{ id: 'u1' }];
            (getAvailableInterviewersRepository as jest.Mock).mockResolvedValue(mockInterviewers);
            (getDatedInterviewCountRepository as jest.Mock).mockResolvedValue(2);
            (checkInterviewerEligibilityRepository as jest.Mock).mockResolvedValue(false);

            const result = await getAvailableInterviewers('2026-03-15', 'app-1');

            expect(result).toHaveLength(0);
        });

        it('returns empty array when no interviewers exist', async () => {
            (getAvailableInterviewersRepository as jest.Mock).mockResolvedValue([]);

            const result = await getAvailableInterviewers('2026-03-15', 'app-1');

            expect(result).toEqual([]);
        });
    });

    // --- scheduleInterview ---
    describe('scheduleInterview', () => {
        it('creates and returns a new interview', async () => {
            const newInterviewData = {
                applicationId: 'app-1',
                interviewerId: 'u1',
                managerId: 'mgr-1',
                scheduledAt: new Date('2026-03-15T10:00:00Z'),
                scheduledBy: 'mgr-1',
            };
            const mockInterview = { id: 'i1', ...newInterviewData };
            (scheduleInterviewRepository as jest.Mock).mockResolvedValue(mockInterview);

            const result = await scheduleInterview(newInterviewData);

            expect(scheduleInterviewRepository).toHaveBeenCalledWith(newInterviewData);
            expect(result).toEqual(mockInterview);
        });

        it('propagates repository errors', async () => {
            (scheduleInterviewRepository as jest.Mock).mockRejectedValue(new Error('DB error'));

            await expect(scheduleInterview({} as any)).rejects.toThrow('DB error');
        });
    });

    // --- getAllInterviews ---
    describe('getAllInterviews', () => {
        it('returns all scheduled interviews', async () => {
            const mockInterviews = [{ id: 'i1' }, { id: 'i2' }];
            (getAllInterviewsRepository as jest.Mock).mockResolvedValue(mockInterviews);

            const result = await getAllInterviews();

            expect(getAllInterviewsRepository).toHaveBeenCalled();
            expect(result).toEqual(mockInterviews);
        });
    });

    // --- getInterviewById ---
    describe('getInterviewById', () => {
        it('returns interview for valid id', async () => {
            const mockInterview = { id: 'i1', applicationId: 'app-1' };
            (getInterviewByIdRepository as jest.Mock).mockResolvedValue(mockInterview);

            const result = await getInterviewById('i1');

            expect(getInterviewByIdRepository).toHaveBeenCalledWith('i1');
            expect(result).toEqual(mockInterview);
        });

        it('returns null when interview not found', async () => {
            (getInterviewByIdRepository as jest.Mock).mockResolvedValue(null);

            const result = await getInterviewById('missing');

            expect(result).toBeNull();
        });
    });

    // --- getInterviewsByJobId ---
    describe('getInterviewsByJobId', () => {
        it('returns interviews for a given jobId', async () => {
            const mockInterviews = [{ id: 'i1', jobId: 'job-1' }];
            (getInterviewsByJobIdRepository as jest.Mock).mockResolvedValue(mockInterviews);

            const result = await getInterviewsByJobId('job-1');

            expect(getInterviewsByJobIdRepository).toHaveBeenCalledWith('job-1');
            expect(result).toEqual(mockInterviews);
        });
    });

    // --- updateExistingInterview ---
    describe('updateExistingInterview', () => {
        it('updates and returns the interview', async () => {
            const updated = { id: 'i1', scheduledAt: new Date('2026-03-20T10:00:00Z') };
            (updateExistingInterviewRepository as jest.Mock).mockResolvedValue(updated);

            const result = await updateExistingInterview('i1', { scheduledAt: new Date('2026-03-20T10:00:00Z') });

            expect(updateExistingInterviewRepository).toHaveBeenCalledWith('i1', expect.any(Object));
            expect(result).toEqual(updated);
        });
    });

    // --- deleteExistingInterview ---
    describe('deleteExistingInterview', () => {
        it('returns truthy on successful delete', async () => {
            (deleteExistingInterviewRepository as jest.Mock).mockResolvedValue(1);

            const result = await deleteExistingInterview('i1');

            expect(deleteExistingInterviewRepository).toHaveBeenCalledWith('i1');
            expect(result).toBeTruthy();
        });

        it('returns undefined when interview not found', async () => {
            (deleteExistingInterviewRepository as jest.Mock).mockResolvedValue(0);

            const result = await deleteExistingInterview('missing');

            expect(result).toBeUndefined();
        });
    });
});
