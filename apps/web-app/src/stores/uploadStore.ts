import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { resumeService } from '@/lib/api/resume.service';

export type UploadStatus = 'idle' | 'uploading' | 'completed' | 'error';

interface FileWithStatus {
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

// Serializable version for localStorage (no File objects)
interface SerializableFileData {
  name: string;
  size: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

interface UploadStore {
  files: FileWithStatus[];
  totalProgress: number;
  status: UploadStatus;
  uploadedCount: number;
  failedCount: number;
  
  // Actions
  addFiles: (newFiles: File[]) => void;
  removeFile: (index: number) => void;
  clearFiles: () => void;
  uploadFiles: () => Promise<void>;
  retryFailed: () => Promise<void>;
  reset: () => void;
}

const BATCH_SIZE = 50;

export const useUploadStore = create<UploadStore>()(
  persist(
    (set, get) => ({
      files: [],
      totalProgress: 0,
      status: 'idle',
      uploadedCount: 0,
      failedCount: 0,

      addFiles: (newFiles) => {
        const filesWithStatus: FileWithStatus[] = newFiles.map((file) => ({
          file,
          status: 'pending',
        }));
        set((state) => ({
          files: [...state.files, ...filesWithStatus],
          status: 'idle',
        }));
      },

      removeFile: (index) => {
        set((state) => ({
          files: state.files.filter((_, i) => i !== index),
        }));
      },

      clearFiles: () => {
        set({
          files: [],
          totalProgress: 0,
          status: 'idle',
          uploadedCount: 0,
          failedCount: 0,
        });
      },

      uploadFiles: async () => {
        const { files } = get();
        const pendingFiles = files.filter((f) => f.status === 'pending');
        
        if (pendingFiles.length === 0) return;

        set({ status: 'uploading', uploadedCount: 0, failedCount: 0 });

        const totalFiles = pendingFiles.length;
        let processedFiles = 0;

        // Process files in batches
        for (let i = 0; i < pendingFiles.length; i += BATCH_SIZE) {
          const batch = pendingFiles.slice(i, i + BATCH_SIZE);
          const batchFiles = batch.map((f) => f.file);

          // Mark batch as uploading
          set((state) => ({
            files: state.files.map((f) =>
              batch.some((bf) => bf.file === f.file) && f.status === 'pending'
                ? { ...f, status: 'uploading' }
                : f
            ),
          }));

          try {
            // Upload batch with progress tracking
            await resumeService.uploadResume(batchFiles, (progress) => {
              // Calculate overall progress considering all batches
              const previousBatchProgress = (processedFiles / totalFiles) * 100;
              const currentBatchWeight = (batch.length / totalFiles) * 100;
              const overallProgress = previousBatchProgress + (progress / 100) * currentBatchWeight;
              
              set({ totalProgress: Math.round(overallProgress) });
            });

            // Mark batch as success
            set((state) => {
              const uploaded = state.uploadedCount + batch.length;
              return {
                files: state.files.map((f) =>
                  batch.some((bf) => bf.file === f.file) && f.status === 'uploading'
                    ? { ...f, status: 'success' }
                    : f
                ),
                uploadedCount: uploaded,
              };
            });

            processedFiles += batch.length;
          } catch (error) {
            // Mark batch as error
            const errorMessage = error instanceof Error ? error.message : 'Upload failed';
            set((state) => {
              const failed = state.failedCount + batch.length;
              return {
                files: state.files.map((f) =>
                  batch.some((bf) => bf.file === f.file) && f.status === 'uploading'
                    ? { ...f, status: 'error', error: errorMessage }
                    : f
                ),
                failedCount: failed,
              };
            });

            processedFiles += batch.length;
          }
        }

        // Set final status
        const { failedCount } = get();
        set({
          status: failedCount > 0 ? 'error' : 'completed',
          totalProgress: 100,
        });
      },

      retryFailed: async () => {
        // Reset failed files to pending
        set((state) => ({
          files: state.files.map((f) =>
            f.status === 'error' ? { ...f, status: 'pending', error: undefined } : f
          ),
          failedCount: 0,
        }));

        // Upload again
        await get().uploadFiles();
      },

      reset: () => {
        set({
          files: [],
          totalProgress: 0,
          status: 'idle',
          uploadedCount: 0,
          failedCount: 0,
        });
      },
    }),
    {
      name: 'upload-storage',
      partialize: (state) => ({
        // Store file metadata for display after refresh
        filesData: state.files.map((f) => ({
          name: f.file.name,
          size: f.file.size,
          status: f.status,
          error: f.error,
        })) as SerializableFileData[],
        totalProgress: state.totalProgress,
        status: state.status,
        uploadedCount: state.uploadedCount,
        failedCount: state.failedCount,
      }),
      // Custom merge function to reconstruct state from storage
      merge: (persistedState: any, currentState) => {
        if (!persistedState?.filesData) {
          return currentState;
        }
        
        // Convert stored metadata back to FileWithStatus format
        const restoredFiles: FileWithStatus[] = persistedState.filesData.map((data: SerializableFileData) => {
          // Create a dummy blob with correct size for display
          const blob = new Blob([new ArrayBuffer(data.size)]);
          const file = new File([blob], data.name, { 
            type: 'application/octet-stream',
          });
          
          // Mark the file object - restored 
          Object.defineProperty(file, 'isRestored', { value: true, writable: false });
          
          return {
            file,
            status: data.status,
            error: data.error,
          };
        });

        return {
          ...currentState,
          files: restoredFiles,
          totalProgress: persistedState.totalProgress ?? 0,
          status: persistedState.status ?? 'idle',
          uploadedCount: persistedState.uploadedCount ?? 0,
          failedCount: persistedState.failedCount ?? 0,
        };
      },
    }
  )
);
