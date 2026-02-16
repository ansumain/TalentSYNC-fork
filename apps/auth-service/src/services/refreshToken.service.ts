import RefreshToken from '../models/RefreshToken';
import { RefreshTokenInput } from '../types/RefreshTokenInput';
import { RefreshTokenOutput } from '../types/RefreshTokenOutput';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config/env';

const refreshToken = async ({ token }: RefreshTokenInput): Promise<RefreshTokenOutput> => {
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
    where: { userId: decoded.userId, revoked: false },
  });

  if (!storedToken) {
    throw new Error('Invalid or expired refresh token');
  }

  // Check if token matches (compare hashed)
  const isTokenValid = await bcrypt.compare(token, storedToken.hashedToken);
  if (!isTokenValid) {
    throw new Error('Invalid or expired refresh token');
  }

  // Check if token is expired
  if (new Date() > storedToken.expiresAt) {
    throw new Error('Expired refresh token');
  }

  // Generate new access token
  const accessToken = jwt.sign(
    {
      userId: decoded.userId,
      email: decoded.email,
      phone: decoded.phone,
    },
    config.accessTokenSecret,
    {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      expiresIn: config.jwtExpiresIn as any,
    }
  );

  return { accessToken };
};

export { refreshToken };
