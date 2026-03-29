import { z } from 'zod';

const isValidDateString = (value: string) => !Number.isNaN(Date.parse(value));

const analyticsQuerySchema = z
  .object({
    fromDate: z.string().refine(isValidDateString, 'fromDate must be a valid date').optional(),
    toDate: z.string().refine(isValidDateString, 'toDate must be a valid date').optional(),
  })
  .passthrough();

const graphQuerySchema = analyticsQuerySchema.extend({
  top: z
    .coerce
    .number()
    .refine((value) => [3, 5, 10].includes(value), 'top must be 3, 5, or 10')
    .optional(),
});

const tableQuerySchema = analyticsQuerySchema.extend({
  jobId: z.string().uuid('jobId must be a valid UUID').optional(),
});

const exportRequestBodySchema = z.object({
  format: z.enum(['pdf', 'xlsx']),
  fromDate: z.string().refine(isValidDateString, 'fromDate must be a valid date').optional(),
  toDate: z.string().refine(isValidDateString, 'toDate must be a valid date').optional(),
  jobId: z.string().uuid('jobId must be a valid UUID').optional(),
  top: z
    .coerce
    .number()
    .refine((value) => [3, 5, 10].includes(value), 'top must be 3, 5, or 10')
    .optional(),
});

export {
  analyticsQuerySchema,
  graphQuerySchema,
  tableQuerySchema,
  exportRequestBodySchema,
};
