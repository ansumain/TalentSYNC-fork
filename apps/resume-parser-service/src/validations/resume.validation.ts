import { z } from 'zod';

const uploadFilesSchema = z
  .array(
    z.object({
      originalname: z.string().min(1),
      mimetype: z.string().min(1),
      size: z.number().int().positive(),
      buffer: z.any(),
    })
  )
  .min(1, 'At least one file is required');

const fileParamsSchema = z.object({
  filename: z
    .string()
    .min(1, 'filename is required')
    .refine((value) => !value.includes('/') && !value.includes('\\'), 'Invalid filename'),
});

export { uploadFilesSchema, fileParamsSchema };
