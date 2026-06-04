import { z } from 'zod';

const uuidParamSchema = (key: string) => z.object({ [key]: z.string().uuid(`${key} must be a valid UUID`) });

const registerBodySchema = z.object({
  name: z.string().trim().min(1, 'name is required'),
  email: z.string().email('email must be valid'),
  phone: z.string().trim().min(10, 'phone is required'),
  password: z.string().min(6, 'password must be at least 6 characters'),
});

const loginBodySchema = z.object({
  email: z.string().email('email must be valid'),
  password: z.string().min(1, 'password is required'),
});

const requestResetBodySchema = z.object({
  email: z.string().email('email must be valid'),
});

const resetPasswordBodySchema = z.object({
  email: z.string().email('email must be valid'),
  otp: z.union([z.string(), z.number()]),
  newPassword: z.string().min(6, 'newPassword must be at least 6 characters'),
});

const createRoleBodySchema = z.object({
  role: z.string().trim().min(1, 'role is required'),
});

const createPermissionBodySchema = z.object({
  permission: z.string().trim().min(1, 'permission is required'),
});

const assignRoleBodySchema = z.object({
  roleId: z.string().uuid('roleId must be a valid UUID'),
});

const assignPermissionBodySchema = z.object({
  permissionId: z.string().uuid('permissionId must be a valid UUID'),
});

const updateUserProfileBodySchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    email: z.string().email().optional(),
    phone: z.string().trim().min(10).optional(),
  })
  .refine((payload: Record<string, unknown>) => Object.keys(payload).length > 0, {
    message: 'At least one field is required',
  });

const updatePasswordBodySchema = z.object({
  oldPassword: z.string().min(1, 'oldPassword is required'),
  newPassword: z.string().min(6, 'newPassword must be at least 6 characters'),
});

export {
  uuidParamSchema,
  registerBodySchema,
  loginBodySchema,
  requestResetBodySchema,
  resetPasswordBodySchema,
  createRoleBodySchema,
  createPermissionBodySchema,
  assignRoleBodySchema,
  assignPermissionBodySchema,
  updateUserProfileBodySchema,
  updatePasswordBodySchema,
};
