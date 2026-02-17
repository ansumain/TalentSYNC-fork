import User from '../models/User';
import { UserProfileInput } from '../types/UserProfileInput';
import { UserProfileOutput } from '../types/UserProfileOutput';

const userProfile = async ({ userId }: UserProfileInput): Promise<UserProfileOutput> => {
  const user = await User.findOne({ where: { id: userId } });
  if (!user) {
    throw new Error('User not found');
  }

  return {
    userId: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
  };
};

export { userProfile };
