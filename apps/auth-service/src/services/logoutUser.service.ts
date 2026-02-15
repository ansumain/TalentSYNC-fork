import RefreshToken from '../models/RefreshToken';
import { LogoutUserInput } from '../types/logoutUserInput';
import { LogoutUserOutput } from '../types/logoutUserOutput';

export const logoutUser = async ({ userId }: LogoutUserInput): Promise<LogoutUserOutput> => {
  if (!userId) throw new Error('Missing required field');

  await RefreshToken.update(
    { revoked: true },
    {
      where: {
        userId,
        revoked: false,
      },
    }
  );

  return { message: 'Logout successful' };
};
