import { User } from '@talentsync/models';
import { LoginUserInput } from '../types/LoginUserInput';
import { LoginUserOutput } from '../types/LoginUserOutput';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config/env';
import RefreshToken from '../models/RefreshToken';
import UserRole from '../models/UserRole';
import Role from '../models/Role';

// login user service
export const loginUser = async ({ email, password }: LoginUserInput): Promise<LoginUserOutput> => {
  // required fields must not be null
  if (!email || !password) throw new Error('Missing required field');

  // User trying to login must exist
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error('User not found');

  // check if valid password is entered
  const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
  if (!isPasswordValid) throw new Error('Invalid Password');

  // Fetch user's role(s)
  const userRoles = await UserRole.findAll({ where: { userId: user.id } });
  if (!userRoles || userRoles.length === 0) throw new Error('User has no assigned role');

  // Get the first role details
  const firstUserRole = userRoles[0];
  const role = await Role.findOne({ where: { id: firstUserRole.roleId } });
  if (!role) throw new Error('Role not found');

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
      /* eslint-disable @typescript-eslint/no-explicit-any */
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
