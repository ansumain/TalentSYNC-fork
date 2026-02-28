"use client";

import { File, FileText, Upload as UploadIcon, X, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { ChangeEvent, DragEvent, useRef } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useUploadStore } from "@/stores/uploadStore";

export function FileUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    files,
    totalProgress,
    status,
    uploadedCount,
    failedCount,
    addFiles,
    removeFile,
    uploadFiles,
    retryFailed,
    reset,
  } = useUploadStore();

  const validFileTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  const validateAndAddFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    // const currentState = useUploadStore.getState();
    if (status === 'completed' || status === 'error') {
      reset();
    }

    const filesArray = Array.from(fileList);
    const validFiles = filesArray.filter((file) => {
      if (!validFileTypes.includes(file.type)) {
        toast.error(`${file.name} is not a valid file type`, {
          position: "bottom-right",
          duration: 3000,
        });
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 10MB limit`, {
          position: "bottom-right",
          duration: 3000,
        });
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      addFiles(validFiles);
      toast.success(`${validFiles.length} file(s) added`, {
        position: "bottom-right",
        duration: 1500,
      });
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    validateAndAddFiles(event.target.files);
    if (event.target) {
      event.target.value = "";
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    validateAndAddFiles(event.dataTransfer.files);
  };

  const handleUpload = async () => {
    try {
      await uploadFiles();

      // Get fresh state after upload completes
      const currentState = useUploadStore.getState();

      if (currentState.failedCount === 0) {
        toast.success("All resumes uploaded successfully!", {
          position: "bottom-right",
          duration: 2000,
        });
      } else {
        toast.error(`${currentState.failedCount} file(s) failed to upload`, {
          position: "bottom-right",
          duration: 3000,
        });
      }
    } catch (error) {
      toast.error("Upload failed. Please try again.", {
        position: "bottom-right",
        duration: 3000,
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const s = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, s)).toFixed(1)) + " " + sizes[s];
  };

  const getFileIcon = (fileName: string) => {
    const fileExt = fileName.split(".").pop()?.toLowerCase() || "";
    if (["pdf"].includes(fileExt)) {
      return <FileText className="h-5 w-5 text-red-500" />;
    }
    if (["doc", "docx"].includes(fileExt)) {
      return <FileText className="h-5 w-5 text-blue-500" />;
    }
    if (["jpg", "jpeg", "png", "webp"].includes(fileExt)) {
      return <File className="h-5 w-5 text-green-500" />;
    }
    return <File className="h-5 w-5 text-foreground" />;
  };

  const getStatusIcon = (fileStatus: string) => {
    switch (fileStatus) {
      case 'uploading':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const totalFiles = files.length;
  const pendingFiles = files.filter((f) => f.status === 'pending').length;

  // Check if any files are restored from localStorage
  const hasRestoredFiles = files.some((f) => (f.file as any).isRestored);
  const hasRestoredFailedFiles = files.some(
    (f) => f.status === 'error' && (f.file as any).isRestored
  );

  return (
    <div className="w-full">
      <div className="w-full max-w-3xl mx-auto">
        <div
          className="flex justify-center rounded-md border mt-2 border-dashed border-input px-6 py-12"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <UploadIcon
              className="mx-auto h-12 w-12 text-muted-foreground"
              aria-hidden={true}
            />
            <div className="mt-4 flex flex-col gap-2 text-sm leading-6 text-muted-foreground">
              <div className="flex justify-center items-center gap-1">
                <p>Drag and drop or</p>
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-sm font-medium text-primary hover:underline hover:underline-offset-4"
                >
                  <span>choose files</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".jpeg,.jpg,.png,.webp,.pdf,.doc,.docx"
                    multiple
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    disabled={status === 'uploading'}
                  />
                </label>
                <p>to upload</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-pretty mt-2 text-xs leading-5 text-muted-foreground sm:flex sm:items-center sm:justify-between">
          <span>
            Accepted file types: JPEG, PNG, PDF or DOCX files.
          </span>
          <span className="pl-1 sm:pl-0">Max. size: 10MB per file</span>
        </p>

        {totalFiles > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-foreground">
                  {status === 'uploading' && `Uploading ${uploadedCount}/${totalFiles} files`}
                  {status === 'completed' && `✓ ${uploadedCount}/${totalFiles} files uploaded`}
                  {status === 'error' && `${uploadedCount}/${totalFiles} uploaded, ${failedCount} failed`}
                  {status === 'idle' && `${totalFiles} file(s) ready`}
                </p>
                {/* {hasRestoredFiles && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Previously uploaded files (from last session)
                  </p>
                )} */}
              </div>
              {status !== 'uploading' && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={reset}
                  className="text-xs"
                >
                  Clear All
                </Button>
              )}
            </div>

            {status === 'uploading' && (
              <div className="flex items-center space-x-3 mb-4">
                <Progress value={totalProgress} className="h-2" />
                <span className="text-sm font-medium text-muted-foreground min-w-[3rem]">
                  {totalProgress}%
                </span>
              </div>
            )}

            <div className="max-h-[300px] overflow-y-auto rounded-md border p-4">
              <div className="space-y-2">
                {files.map((fileItem, index) => (
                  <Card
                    key={`${fileItem.file.name}-${index}`}
                    className="relative bg-muted p-3"
                  >
                    {fileItem.status === 'pending' && status !== 'uploading' && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="absolute right-1 top-1 text-muted-foreground hover:text-foreground"
                        aria-label="Remove"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4 shrink-0" aria-hidden={true} />
                      </Button>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5 flex-1 min-w-0">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-background shadow-sm ring-1 ring-inset ring-border">
                          {getFileIcon(fileItem.file.name)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground truncate">
                            {fileItem.file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(fileItem.file.size)}
                          </p>
                          {fileItem.error && (
                            <p className="text-xs text-red-500 truncate">
                              {fileItem.error}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="ml-2">{getStatusIcon(fileItem.status)}</div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center justify-end space-x-3">
          {status === 'error' && failedCount > 0 && !hasRestoredFailedFiles && (
            <Button
              type="button"
              variant="outline"
              onClick={retryFailed}
            >
              Retry Failed ({failedCount})
            </Button>
          )}

          {(status === 'completed' || status === 'error') && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                fileInputRef.current?.click();
              }}
            >
              Upload More
            </Button>
          )}

          {status !== 'completed' && (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={reset}
                disabled={status === 'uploading' || totalFiles === 0}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleUpload}
                disabled={status === 'uploading' || pendingFiles === 0 || hasRestoredFiles}
                title={hasRestoredFiles ? "Cannot upload these files. Please select the files again." : ""}
              >
                {status === 'uploading' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : 
                  `Upload ${pendingFiles > 0 ? `(${pendingFiles})` : ''}`
                }
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
