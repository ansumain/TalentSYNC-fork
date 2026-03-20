import { User } from '@talentsync/models';
import { UpdatePasswordInput } from '../types/UpdatePasswordInput';
import { UpdatePasswordOutput } from '../types/UpdatePasswordOutput';
import bcrypt from 'bcryptjs';
import { notFoundError, unauthorizedError } from '@talentsync/types';

// update password service
export const updatePassword = async (
  passwords: UpdatePasswordInput
): Promise<UpdatePasswordOutput> => {
  const { userId, oldPassword, newPassword } = passwords;

  const user = await User.findOne({ where: { id: userId } });
  if (!user) throw notFoundError('User not found', 'USER_NOT_FOUND');

  const isPasswordValid = await bcrypt.compare(oldPassword, user.hashedPassword);
  if (!isPasswordValid) throw unauthorizedError('Invalid Password', 'INVALID_PASSWORD');

  const salt = await bcrypt.genSalt(10);
  const newHashedPassword = await bcrypt.hash(newPassword, salt);

  user.hashedPassword = newHashedPassword;
  await user.save();

  return { message: `Password for email: ${user.email} , Updated` };
};
