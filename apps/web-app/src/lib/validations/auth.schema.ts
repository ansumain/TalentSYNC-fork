import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'This is a required field!')
    .email('Invalid email address'),
  password: z
    .string()
    .min(1, 'This is a required field!'),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(3, 'atleast 3 characters required')
    .max(25, 'atmost 25 characters allowed'),
  email: z
    .string()
    .min(1, 'This is a required field!')
    .email('Invalid email address'),
  phone: z
    .string()
    .min(10, 'Phone number must be 10 digits')
    .regex(/^\d+$/, 'Phone number must contain only digits'),
  password: z
    .string()
    .min(8, 'atleast 8 characters required')
    .regex(/[A-Z]/, 'must contain atleast one uppercase letter')
    .regex(/[a-z]/, 'must contain atleast one lowercase letter')
    .regex(/[0-9]/, 'must contain atleast one number'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'This is a required field!')
    .email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'This is a required field!')
    .email('Invalid email address'),
  otp: z
    .string()
    .min(6, 'Invalid')
    .max(6, 'Invalid')
    .regex(/^\d+$/, 'Invalid'),
  newPassword: z
    .string()
    .min(8, 'atleast 8 characters required')
    .regex(/[A-Z]/, 'must contain atleast one uppercase letter')
    .regex(/[a-z]/, 'must contain atleast one lowercase letter')
    .regex(/[0-9]/, 'must contain atleast one number'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
