import { User } from '@talentsync/models';
import PasswordResetOtp from '../models/PasswordResetOtp';
import { ResetPasswordInput } from '../types/ResetPasswordInput';
import { ResetPasswordOutput } from '../types/ResetPasswordOutput';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import {
  badRequestError,
  notFoundError,
  unauthorizedError,
} from '@talentsync/types';

// reset password service
export const resetPassword = async ({
  email,
  otp,
  newPassword,
}: ResetPasswordInput): Promise<ResetPasswordOutput> => {
  // Validate input
  if (!email || !otp || !newPassword) {
    throw badRequestError('Missing required field', 'MISSING_REQUIRED_FIELD');
  }

  // Check password strength
  if (newPassword.length < 6) throw badRequestError('Weak password', 'WEAK_PASSWORD');

  // Find OTP record for this email
  const otpRecord = await PasswordResetOtp.findOne({
    where: {
      email,
      expiresAt: {
        [Op.gt]: new Date(),
      },
    },
    order: [['createdAt', 'DESC']],
  });

  if (!otpRecord) throw unauthorizedError('Invalid or expired OTP', 'OTP_INVALID_OR_EXPIRED');

  // Verify OTP
  const isOtpValid = await bcrypt.compare(otp, otpRecord.hashedOtp);
  if (!isOtpValid) throw unauthorizedError('Invalid or expired OTP', 'OTP_INVALID_OR_EXPIRED');

  // Find user
  const user = await User.findOne({ where: { email } });
  if (!user) throw notFoundError('User not found', 'USER_NOT_FOUND');

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Update user password
  await User.update({ hashedPassword }, { where: { id: user.id } });

  // Delete user OTPs (one-time use)
  await PasswordResetOtp.destroy({ where: { email } });

  return { message: 'Password reset successful' };
};
