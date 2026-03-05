import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// import { resumeService } from '@/lib/api/resume.service';
import * as tus from 'tus-js-client';

export type UploadStatus = 'idle' | 'uploading' | 'completed' | 'error';

// interface FileWithStatus {
//   file: File;
//   status: 'pending' | 'uploading' | 'success' | 'error';
//   error?: string;
// }

interface FileWithStatus {
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

// Serializable version for localStorage
interface SerializableFileData {
  name: string;
  size: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
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

const PARALLEL_UPLOADS = 4;

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
          progress: 0
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

        set({ status: 'uploading' });

        let index = 0;

        const uploadSingle = (fileEntry: FileWithStatus) =>
          new Promise<void>((resolve) => {

            const file = fileEntry.file;

            set((state) => ({
              files: state.files.map((f) =>
                f.file === file ? { ...f, status: 'uploading' } : f
              ),
            }));

            const upload = new tus.Upload(file, {
              endpoint: '/api/resume/upload',
              chunkSize: 5 * 1024 * 1024,
              withCredentials: true,

              metadata: {
                filename: file.name,
                filetype: file.type,
              },

              onError: (error: any) => {
                set((state) => ({
                  files: state.files.map((f) =>
                    f.file === file
                      ? { ...f, status: 'error', error: error.message }
                      : f
                  ),
                  failedCount: state.failedCount + 1,
                }));
                resolve();
              },

              onProgress: (uploaded: number, total: number) => {
                const progress = Math.round((uploaded / total) * 100);

                set((state) => {
                  const updatedFiles = state.files.map((f) =>
                    f.file === file ? { ...f, progress } : f
                  );

                  const totalProgress =
                    updatedFiles.reduce((sum, f) => sum + f.progress, 0) /
                    updatedFiles.length;

                  return {
                    files: updatedFiles,
                    totalProgress,
                  };
                });
              },

              onSuccess: () => {
                set((state) => {
                  const updatedFiles = state.files.map((f) =>
                    f.file === file
                      ? { ...f, status: 'success' as const, progress: 100 }
                      : f
                  );

                  const uploadedCount = state.uploadedCount + 1;

                  const allDone = updatedFiles.every(
                    (f) => f.status === 'success' || f.status === 'error'
                  );

                  return {
                    files: updatedFiles,
                    uploadedCount,
                    status: allDone ? ('completed' as UploadStatus) : state.status,
                  };
                });

                resolve();
              },
            } as any);

            upload.findPreviousUploads().then((prev) => {
              if (prev.length) upload.resumeFromPreviousUpload(prev[0]);
              upload.start();
            });
          });

        const workers = new Array(PARALLEL_UPLOADS).fill(null).map(async () => {
          while (index < pendingFiles.length) {
            const file = pendingFiles[index++];
            await uploadSingle(file);
          }
        });

        await Promise.all(workers);
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
          progress: f.progress,
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
            progress: data.progress ?? 0,
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
