import path from 'path';

export const getMimeTypeFromExtension = (filename: string): string => {
    const ext = path.extname(filename).toLowerCase();

    switch (ext) {
        case '.pdf':
            return 'application/pdf';
        case '.docx':
            return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        case '.doc':
            return 'application/msword';
        case '.jpeg':
        case '.jpg':
            return 'image/jpeg';
        case '.png':
            return 'image/png';
        case '.webp':
            return 'image/webp';
        default:
            return 'application/octet-stream';
    }
};