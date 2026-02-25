export interface ResumeModel {
    userId: string,
    fileName: string,
    mimeType: string,
    fileURL: string,
    status: 'queued' | 'processing' | 'completed' | 'failed'
}