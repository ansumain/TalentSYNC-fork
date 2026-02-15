import RefreshToken from '../models/RefreshToken';
import { LogoutUserInput } from '../types/logoutUserInput';
import { LogoutUserOutput } from '../types/logoutUserOutput';

const logoutUser = async ({ userId }: LogoutUserInput): Promise<LogoutUserOutput> => {
  if (!userId) throw new Error('Missing required field');

  await RefreshToken.destroy({ where: { userId } });

  return { message: 'Logout successful' };
};

export { logoutUser };
