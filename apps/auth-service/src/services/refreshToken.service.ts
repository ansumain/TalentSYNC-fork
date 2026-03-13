import RefreshToken from '../models/RefreshToken';
import { RefreshTokenInput } from '../types/RefreshTokenInput';
import { RefreshTokenOutput } from '../types/RefreshTokenOutput';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config/env';
import { User } from '@talentsync/models';
import UserRole from '../models/UserRole';
import Role from '../models/Role';

// get access token from refresh token
export const refreshToken = async ({ token }: RefreshTokenInput): Promise<RefreshTokenOutput> => {
  // required fields must not be null
  if (!token) throw new Error('Missing required field');

  // Verify the JWT token
  /* eslint-disable @typescript-eslint/no-explicit-any */
  let decoded: any;
  try {
    decoded = jwt.verify(token, config.refreshTokenSecret);
  } catch {
    throw new Error('Invalid token');
  }

  // Find matching refresh token in database
  const storedToken = await RefreshToken.findOne({
    where: { userId: decoded.sub, revoked: false },
  });

  if (!storedToken) {
    throw new Error('Invalid or expired refresh token');
  }

  // Check if token matches (compare hashedToken from DB)
  const isTokenValid = await bcrypt.compare(token, storedToken.hashedToken);
  if (!isTokenValid) {
    throw new Error('Invalid or expired refresh token');
  }

  // Check if token is expired
  if (new Date() > storedToken.expiresAt) {
    throw new Error('Invalid or expired refresh token');
  }

  // Check if token is revoked
  if (storedToken.revoked) {
    throw new Error('Invalid or expired refresh token');
  }

  const user = (await User.findOne({ where: { id: decoded.sub } })) as User;

  if (!user) throw new Error('User not found');

  // Fetch user's role(s)
  const userRoles = await UserRole.findAll({ where: { userId: user.id } });
  if (!userRoles || userRoles.length === 0) throw new Error('User has no assigned role');

  // Get the first role details
  const firstUserRole = userRoles[0];
  const role = await Role.findOne({ where: { id: firstUserRole.roleId } });
  if (!role) throw new Error('Role not found');

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
      /* eslint-disable @typescript-eslint/no-explicit-any */
      expiresIn: config.jwtExpiresIn as any,
    }
  );

  return { accessToken };
};
