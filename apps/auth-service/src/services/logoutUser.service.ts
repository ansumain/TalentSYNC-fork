import RefreshToken from '../models/RefreshToken';
import { badRequestError } from '@talentsync/types';
import { LogoutUserInput } from '../types/LogoutUserInput';
import { LogoutUserOutput } from '../types/LogoutUserOutput';

// logout user service
export const logoutUser = async ({ userId }: LogoutUserInput): Promise<LogoutUserOutput> => {
  if (!userId) throw badRequestError('Missing required field', 'MISSING_REQUIRED_FIELD');

  await RefreshToken.update({ revoked: true }, { where: { userId, revoked: false } });

  return { message: 'Logout successful' };
};
