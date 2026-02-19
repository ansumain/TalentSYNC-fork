import User from '../models/User';
import { UpdatePasswordInput } from '../types/UpdatePasswordInput';
import { UpdatePasswordOutput } from '../types/UpdatePasswordOutput';
import bcrypt from 'bcryptjs';

export const updatePassword = async (
  passwords: UpdatePasswordInput
): Promise<UpdatePasswordOutput> => {
  const { userId, oldPassword, newPassword } = passwords;

  const user = await User.findOne({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  const isPasswordValid = await bcrypt.compare(oldPassword, user.hashedPassword);
  if (!isPasswordValid) throw new Error('Invalid Password');

  const salt = await bcrypt.genSalt(10);
  const newHashedPassword = await bcrypt.hash(newPassword, salt);

  user.hashedPassword = newHashedPassword;
  await user.save();

  return { message: `Password for email: ${user.email} , Updated` };
};
