import { User } from '@talentsync/models';
import PasswordResetOtp from '../models/PasswordResetOtp';
import { RequestPasswordResetInput } from '../types/RequestPasswordResetInput';
import { RequestPasswordResetOutput } from '../types/RequestPasswordResetOutput';
import bcrypt from 'bcryptjs';
import { badRequestError, notFoundError } from '@talentsync/types';
import { sendOtpEmail } from '../utils/emailService';

// request password reset service
export const requestPasswordReset = async ({
  email,
}: RequestPasswordResetInput): Promise<RequestPasswordResetOutput> => {
  // Validate email
  if (!email) throw badRequestError('Missing required field', 'MISSING_REQUIRED_FIELD');

  // Check if user exists
  const user = await User.findOne({ where: { email } });
  if (!user) throw notFoundError('User not found', 'USER_NOT_FOUND');

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Hash the OTP before storing
  const salt = await bcrypt.genSalt(10);
  const hashedOtp = await bcrypt.hash(otp, salt);

  // Set expiration time (15 minutes)
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 15);

  // Delete any existing OTPs for this email
  await PasswordResetOtp.destroy({ where: { email } });

  // Store OTP in database
  await PasswordResetOtp.create({
    email,
    hashedOtp,
    expiresAt,
  });

  // Send OTP via email
  await sendOtpEmail(email, otp);

  return { message: 'OTP sent to your email' };
};
