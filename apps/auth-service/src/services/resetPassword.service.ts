import { User } from '@talentsync/models';
import PasswordResetOtp from '../models/PasswordResetOtp';
import { ResetPasswordInput } from '../types/ResetPasswordInput';
import { ResetPasswordOutput } from '../types/ResetPasswordOutput';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';

// reset password service
export const resetPassword = async ({
  email,
  otp,
  newPassword,
}: ResetPasswordInput): Promise<ResetPasswordOutput> => {
  // Validate input
  if (!email || !otp || !newPassword) throw new Error('Missing required field');

  // Check password strength
  if (newPassword.length < 6) throw new Error('Weak password');

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

  if (!otpRecord) throw new Error('Invalid or expired OTP');

  // Verify OTP
  const isOtpValid = await bcrypt.compare(otp, otpRecord.hashedOtp);
  if (!isOtpValid) throw new Error('Invalid or expired OTP');

  // Find user
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error('User not found');

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Update user password
  await User.update({ hashedPassword }, { where: { id: user.id } });

  // Delete user OTPs (one-time use)
  await PasswordResetOtp.destroy({ where: { email } });

  return { message: 'Password reset successful' };
};
