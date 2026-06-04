import RefreshToken from '../models/RefreshToken';
import { RefreshTokenInput } from '../types/RefreshTokenInput';
import { RefreshTokenOutput } from '../types/RefreshTokenOutput';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config/env';
import {
  badRequestError,
  notFoundError,
  unauthorizedError,
} from '@talentsync/types';
import { User } from '@talentsync/models';
import UserRole from '../models/UserRole';
import Role from '../models/Role';

// get access token from refresh token
export const refreshToken = async ({ token }: RefreshTokenInput): Promise<RefreshTokenOutput> => {
  // required fields must not be null
  if (!token) throw badRequestError('Missing required field', 'MISSING_REQUIRED_FIELD');

  // Verify the JWT token
  let decoded: any;
  try {
    decoded = jwt.verify(token, config.refreshTokenSecret);
  } catch {
    throw unauthorizedError('Invalid token', 'REFRESH_TOKEN_INVALID');
  }

  // Find matching refresh token in database
  const storedToken = await RefreshToken.findOne({
    where: { userId: decoded.sub, revoked: false },
  });

  if (!storedToken) {
    throw unauthorizedError('Invalid or expired refresh token', 'REFRESH_TOKEN_INVALID');
  }

  // Check if token matches (compare hashedToken from DB)
  const isTokenValid = await bcrypt.compare(token, storedToken.hashedToken);
  if (!isTokenValid) {
    throw unauthorizedError('Invalid or expired refresh token', 'REFRESH_TOKEN_INVALID');
  }

  // Check if token is expired
  if (new Date() > storedToken.expiresAt) {
    throw unauthorizedError('Invalid or expired refresh token', 'REFRESH_TOKEN_EXPIRED');
  }

  // Check if token is revoked
  if (storedToken.revoked) {
    throw unauthorizedError('Invalid or expired refresh token', 'REFRESH_TOKEN_REVOKED');
  }

  const user = (await User.findOne({ where: { id: decoded.sub } })) as User;

  if (!user) throw notFoundError('User not found', 'USER_NOT_FOUND');

  // Fetch user's role(s)
  const userRoles = await UserRole.findAll({ where: { userId: user.id } });
  if (!userRoles || userRoles.length === 0) {
    throw notFoundError('User has no assigned role', 'USER_ROLE_NOT_FOUND');
  }

  // Get the first role details
  const firstUserRole = userRoles[0];
  const role = await Role.findOne({ where: { id: firstUserRole.roleId } });
  if (!role) throw notFoundError('Role not found', 'ROLE_NOT_FOUND');

  // Generate new access token
  const accessToken = jwt.sign(
    {
      sub: decoded.sub,
      name: user.name,
      role: {
        id: role.id,
        name: role.role,
      },
    },
    config.accessTokenSecret,
    {
      expiresIn: config.jwtExpiresIn as any,
    }
  );

  return { accessToken };
};
