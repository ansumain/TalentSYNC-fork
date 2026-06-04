import { Request, Response } from 'express';
import { ResumeUploaderController } from '../../controllers/resume-upload.controller';
import { uploadResume } from '../../services/uploadResume.service';

jest.mock('../../services/uploadResume.service');

describe('ResumeUploaderController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        jest.clearAllMocks();
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        mockRequest = {
            userInfo: { sub: 'user-123', role: { name: 'candidate' } } as any,
            files: [],
            body: {},
        };
    });

    // --- uploadResume ---
    describe('uploadResume', () => {
        it('201 - uploads files successfully', async () => {
            mockRequest.files = [
                { filename: 'cv.pdf', mimetype: 'application/pdf', path: 'uploads/cv.pdf' },
            ] as any;
            (uploadResume as jest.Mock).mockResolvedValue(true);

            await ResumeUploaderController.uploadResume(mockRequest as Request, mockResponse as Response);

            expect(uploadResume).toHaveBeenCalledWith(
                mockRequest.files,
                'user-123',
                'candidate'
            );
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'File upload successful' });
        });

        it('500 - returns error when no files are uploaded', async () => {
            mockRequest.files = [] as any;

            await ResumeUploaderController.uploadResume(mockRequest as Request, mockResponse as Response);

            expect(uploadResume).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'No File Uploaded' });
        });

        it('500 - returns error when files is undefined', async () => {
            mockRequest.files = undefined as any;

            await ResumeUploaderController.uploadResume(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'No File Uploaded' });
        });

        it('500 - returns error when candidate uploads more than one file', async () => {
            mockRequest.files = [
                { filename: 'cv1.pdf', mimetype: 'application/pdf', path: 'uploads/cv1.pdf' },
                { filename: 'cv2.pdf', mimetype: 'application/pdf', path: 'uploads/cv2.pdf' },
            ] as any;
            (uploadResume as jest.Mock).mockRejectedValue(
                new Error('Candidates can only upload one resume at a time.')
            );

            await ResumeUploaderController.uploadResume(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Candidates can only upload one resume at a time.',
            });
        });

        it('500 - returns error on unexpected service failure', async () => {
            mockRequest.files = [
                { filename: 'cv.pdf', mimetype: 'application/pdf', path: 'uploads/cv.pdf' },
            ] as any;
            (uploadResume as jest.Mock).mockRejectedValue(new Error('Queue unavailable'));

            await ResumeUploaderController.uploadResume(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Queue unavailable' });
        });
    });
});
