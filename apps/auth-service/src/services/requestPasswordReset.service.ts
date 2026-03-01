import { User } from '@talentsync/models';
import PasswordResetOtp from '../models/PasswordResetOtp';
import { RequestPasswordResetInput } from '../types/RequestPasswordResetInput';
import { RequestPasswordResetOutput } from '../types/RequestPasswordResetOutput';
import bcrypt from 'bcryptjs';
import { sendOtpEmail } from '../utils/emailService';

export const requestPasswordReset = async ({
  email,
}: RequestPasswordResetInput): Promise<RequestPasswordResetOutput> => {
  // Validate email
  if (!email) throw new Error('Missing required field');

  // Check if user exists
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error('User not found');

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
