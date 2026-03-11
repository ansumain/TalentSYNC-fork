import { uploadResume } from '../../services/uploadResume.service';
import { addToResumeData } from '../../repository/resume.repository';
import { publishToQueue } from '../../config/rabbitmq';

jest.mock('../../repository/resume.repository');
jest.mock('../../config/rabbitmq');
jest.mock('../../config/env', () => ({
    config: {
        queues: {
            resumeParse: 'resume.parse',
            retry: 3,
        },
    },
}));

describe('UploadResumeService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockFiles = (count: number) =>
        Array.from({ length: count }, (_, i) => ({
            filename: `cv${i + 1}.pdf`,
            mimetype: 'application/pdf',
            path: `uploads/cv${i + 1}.pdf`,
        }));

    // --- uploadResume ---
    describe('uploadResume', () => {
        it('returns true after successfully queuing a single resume', async () => {
            const files = mockFiles(1);
            (addToResumeData as jest.Mock).mockResolvedValue('resume-123');
            (publishToQueue as jest.Mock).mockResolvedValue(undefined);

            const result = await uploadResume(files as any, 'user-1', 'candidate');

            expect(addToResumeData).toHaveBeenCalledTimes(1);
            expect(publishToQueue).toHaveBeenCalledWith('resume.parse', { resumeId: 'resume-123' }, 3);
            expect(result).toBe(true);
        });

        it('queues multiple files when uploader is a manager', async () => {
            const files = mockFiles(3);
            (addToResumeData as jest.Mock)
                .mockResolvedValueOnce('r1')
                .mockResolvedValueOnce('r2')
                .mockResolvedValueOnce('r3');
            (publishToQueue as jest.Mock).mockResolvedValue(undefined);

            const result = await uploadResume(files as any, 'manager-1', 'manager');

            expect(addToResumeData).toHaveBeenCalledTimes(3);
            expect(publishToQueue).toHaveBeenCalledTimes(3);
            expect(result).toBe(true);
        });

        it('throws when candidate tries to upload more than one file', async () => {
            const files = mockFiles(2);

            await expect(uploadResume(files as any, 'user-1', 'candidate')).rejects.toThrow(
                'Error uploading file(s):'
            );
            expect(addToResumeData).not.toHaveBeenCalled();
        });

        it('throws when addToResumeData fails', async () => {
            const files = mockFiles(1);
            (addToResumeData as jest.Mock).mockRejectedValue(new Error('DB insert failed'));

            await expect(uploadResume(files as any, 'user-1', 'candidate')).rejects.toThrow(
                'Error uploading file(s):'
            );
        });

        it('throws when publishToQueue fails', async () => {
            const files = mockFiles(1);
            (addToResumeData as jest.Mock).mockResolvedValue('r1');
            (publishToQueue as jest.Mock).mockRejectedValue(new Error('RabbitMQ down'));

            await expect(uploadResume(files as any, 'user-1', 'candidate')).rejects.toThrow(
                'Error uploading file(s):'
            );
        });

        it('stores absolute file path as-is', async () => {
            const files = [{ filename: 'cv.pdf', mimetype: 'application/pdf', path: '/data/uploads/cv.pdf' }];
            (addToResumeData as jest.Mock).mockResolvedValue('r1');
            (publishToQueue as jest.Mock).mockResolvedValue(undefined);

            await uploadResume(files as any, 'user-1', 'admin');

            expect(addToResumeData).toHaveBeenCalledWith(
                expect.objectContaining({ fileURL: '/data/uploads/cv.pdf' })
            );
        });

        it('prefixes relative path with /data', async () => {
            const files = [{ filename: 'cv.pdf', mimetype: 'application/pdf', path: 'uploads/cv.pdf' }];
            (addToResumeData as jest.Mock).mockResolvedValue('r1');
            (publishToQueue as jest.Mock).mockResolvedValue(undefined);

            await uploadResume(files as any, 'user-1', 'admin');

            const call = (addToResumeData as jest.Mock).mock.calls[0][0];
            expect(call.fileURL).toMatch(/[\/\\]data[\/\\]uploads[\/\\]cv\.pdf$/);
        });
    });
});
