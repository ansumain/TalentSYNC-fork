import { z } from 'zod';

const uuidParamSchema = (key: string) => z.object({ [key]: z.string().uuid(`${key} must be a valid UUID`) });

const paginationQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    sortBy: z.string().min(1).optional(),
    sortOrder: z.enum(['ASC', 'DESC', 'asc', 'desc']).optional(),
    search: z.string().optional(),
  })
  .passthrough();

const candidateByUserQuerySchema = z.object({ userId: z.string().uuid('userId must be a valid UUID') });
const candidateByResumeQuerySchema = z.object({ resumeId: z.string().uuid('resumeId must be a valid UUID') });
const availableInterviewersQuerySchema = z.object({
  date: z.string().min(1, 'date is required'),
  applicationId: z.string().uuid('applicationId must be a valid UUID'),
});

const createJobBodySchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  location: z.string().trim().min(1),
  jobType: z.string().trim().min(1),
  openings: z.coerce.number().int().min(1),
  skillIds: z.array(z.string().uuid()).optional(),
});

const updateJobBodySchema =
  z
    .object({
      title: z.string().trim().min(1).optional(),
      description: z.string().trim().min(1).optional(),
      location: z.string().trim().min(1).optional(),
      jobType: z.string().trim().min(1).optional(),
      openings: z.coerce.number().int().min(1).optional(),
    })
    .refine((payload) => Object.keys(payload).length > 0, {
      message: 'At least one field is required',
    });

const scheduleInterviewBodySchema = z.object({
  applicationId: z.string().uuid(),
  interviewerId: z.string().uuid(),
  managerId: z.string().uuid(),
  scheduledAt: z
    .string()
    .min(1)
    .refine((value) => !Number.isNaN(Date.parse(value)), 'scheduledAt must be a valid date'),
});

const updateInterviewBodySchema =
  z
    .object({
      interviewerId: z.string().uuid().optional(),
      managerId: z.string().uuid().optional(),
      scheduledAt: z
        .string()
        .refine((value) => !Number.isNaN(Date.parse(value)), 'scheduledAt must be a valid date')
        .optional(),
      status: z.string().trim().min(1).optional(),
    })
    .refine((payload) => Object.keys(payload).length > 0, {
      message: 'At least one field is required',
    });

const interviewResultBodySchema = z.object({
  result: z.enum(['passed', 'failed']),
});

const updateApplicationStatusBodySchema = z.object({
  currentStatus: z.string().trim().min(1),
});

const acceptRejectOfferBodySchema = z.object({
  action: z.enum(['accept', 'reject']),
});

const addMySkillBodySchema = z.object({
  skillId: z.string().uuid('skillId must be a valid UUID'),
});

export {
  paginationQuerySchema,
  candidateByUserQuerySchema,
  candidateByResumeQuerySchema,
  availableInterviewersQuerySchema,
  createJobBodySchema,
  updateJobBodySchema,
  scheduleInterviewBodySchema,
  updateInterviewBodySchema,
  interviewResultBodySchema,
  updateApplicationStatusBodySchema,
  acceptRejectOfferBodySchema,
  addMySkillBodySchema,
  uuidParamSchema,
};
