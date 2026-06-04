import { User } from '@talentsync/models';
import { LoginUserInput } from '../types/LoginUserInput';
import { LoginUserOutput } from '../types/LoginUserOutput';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config/env';
import {
  badRequestError,
  notFoundError,
  unauthorizedError,
} from '@talentsync/types';
import RefreshToken from '../models/RefreshToken';
import UserRole from '../models/UserRole';
import Role from '../models/Role';

// login user service
export const loginUser = async ({ email, password }: LoginUserInput): Promise<LoginUserOutput> => {
  // required fields must not be null
  if (!email || !password) throw badRequestError('Missing required field', 'MISSING_REQUIRED_FIELD');

  // User trying to login must exist
  const user = await User.findOne({ where: { email } });
  if (!user) throw notFoundError('User not found', 'USER_NOT_FOUND');

  // check if valid password is entered
  const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
  if (!isPasswordValid) throw unauthorizedError('Invalid Password', 'INVALID_PASSWORD');

  // Fetch user's role(s)
  const userRoles = await UserRole.findAll({ where: { userId: user.id } });
  if (!userRoles || userRoles.length === 0) {
    throw notFoundError('User has no assigned role', 'USER_ROLE_NOT_FOUND');
  }

  // Get the first role details
  const firstUserRole = userRoles[0];
  const role = await Role.findOne({ where: { id: firstUserRole.roleId } });
  if (!role) throw notFoundError('Role not found', 'ROLE_NOT_FOUND');

  // create the access token
  const accessToken = jwt.sign(
    {
      sub: user.id,
      name: user.name,
      role: {
        id: role.id,
        name: role.role,
      },
    },
    config.accessTokenSecret as string,
    {
      expiresIn: config.jwtExpiresIn as any,
    }
  );

  // create the refresh token
  const refreshToken = jwt.sign(
    {
      sub: user.id,
    },
    config.refreshTokenSecret as string,
    {
      expiresIn: '30d',
    }
  );

  // hash the refresh token before storing in DB
  const salt = await bcrypt.genSalt(10);
  const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  await RefreshToken.update({ revoked: true }, { where: { userId: user.id, revoked: false } });

  await RefreshToken.create({
    userId: user.id,
    hashedToken: hashedRefreshToken,
    expiresAt,
    revoked: false,
  });

  return { accessToken, refreshToken };
};
