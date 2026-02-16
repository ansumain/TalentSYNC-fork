import User from '../models/User';
import { LoginUserInput } from '../types/LoginUserInput';
import { LoginUserOutput } from '../types/LoginUserOutput';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config/env';
import RefreshToken from '../models/RefreshToken';

const loginUser = async ({ email, password }: LoginUserInput): Promise<LoginUserOutput> => {
  // required fields must not be null
  if (!email || !password) throw new Error('Missing required field');

  // User trying to login must exist
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error('User not found');

  // check if valid password is entered
  const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
  if (!isPasswordValid) throw new Error('Invalid Password');

  // create the access token
  const accessToken = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      phone: user.phone,
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
      userId: user.id,
      email: user.email,
      phone: user.phone,
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

  const getExistingRefreshToken = await RefreshToken.findAll({ where: { userId: user.id } });

  if (getExistingRefreshToken) {
    await RefreshToken.update(
      {
        revoked: true,
      },
      {
        where: {
          userId: user.id,
        },
      }
    );
  }
  await RefreshToken.create({
    userId: user.id,
    hashedToken: hashedRefreshToken,
    expiresAt,
    revoked: false,
  });

  return { accessToken, refreshToken };
};

export { loginUser };
