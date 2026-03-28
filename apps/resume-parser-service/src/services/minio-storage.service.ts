import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import { config } from '../config/env';
import { minioClient } from '../config/minio';
import { UploadedFileModel } from '../types/UploadedFile.type';

const tempDir = '/data/temp';

const ensureTempDir = async (): Promise<void> => {
  await fsp.mkdir(tempDir, { recursive: true });
};

const buildMinioObjectKey = (originalName?: string): string => {
  const ext = originalName ? path.extname(originalName) : '';
  const suffix = `${Date.now()}-${randomUUID()}`;
  return `resume-${suffix}${ext}`;
};

const buildMinioFileURL = (objectKey: string): string => {
  return `minio://${config.minio.bucket}/${objectKey}`;
};

const getObjectKeyFromFileURL = (fileURL: string): string | null => {
  const prefix = `minio://${config.minio.bucket}/`;
  if (!fileURL.startsWith(prefix)) {
    return null;
  }

  const objectKey = fileURL.slice(prefix.length);
  return objectKey || null;
};

const uploadResumeObject = async (objectKey: string, file: UploadedFileModel): Promise<void> => {
  await minioClient.putObject(
    config.minio.bucket,
    objectKey,
    file.buffer,
    file.size,
    { 'Content-Type': file.mimetype }
  );
};

const getResumeObjectStream = async (objectKey: string) => {
  return minioClient.getObject(config.minio.bucket, objectKey);
};

const downloadResumeObjectToTempFile = async (objectKey: string): Promise<string> => {
  await ensureTempDir();

  const safeFileName = path.basename(objectKey);
  const tempFilePath = path.join(tempDir, `${Date.now()}-${randomUUID()}-${safeFileName}`);

  const stream = await minioClient.getObject(config.minio.bucket, objectKey);

  await new Promise<void>((resolve, reject) => {
    const writer = fs.createWriteStream(tempFilePath);

    stream.on('error', reject);
    writer.on('error', reject);
    writer.on('finish', () => resolve());

    stream.pipe(writer);
  });

  return tempFilePath;
};

const cleanupTempFile = async (filePath: string): Promise<void> => {
  await fsp.rm(filePath, { force: true });
};

export {
  buildMinioObjectKey,
  buildMinioFileURL,
  getObjectKeyFromFileURL,
  uploadResumeObject,
  getResumeObjectStream,
  downloadResumeObjectToTempFile,
  cleanupTempFile,
};
