import { refreshToken } from '../../services/refreshToken.service';
import RefreshToken from '../../models/RefreshToken';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

jest.mock('../../models/RefreshToken');
jest.mock('jsonwebtoken');
jest.mock('bcryptjs');

describe('Authentication - Refresh Token', () => {
  let mockFindOne: jest.SpyInstance;

  beforeEach(() => {
    jest.resetAllMocks();
    mockFindOne = jest.spyOn(RefreshToken, 'findOne');
  });
  const mockJwtVerify = jwt.verify as jest.Mock;

  it('should throw an error if refresh token is missing', async () => {
    await expect(refreshToken({ token: '' })).rejects.toThrow('Missing required field');
    expect(jwt.verify).not.toHaveBeenCalled();
  });

  it('should throw an error if token is invalid', async () => {
    mockJwtVerify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await expect(refreshToken({ token: 'invalidToken' })).rejects.toThrow('Invalid token');
  });

  it('should throw an error if token not found in database', async () => {
    mockJwtVerify.mockReturnValue({
      userId: 'user123',
      email: 'ansuman@gmail.com',
      phone: '1234567890',
    });

    mockFindOne.mockResolvedValue(null);

    const mockBcryptCompare = bcrypt.compare as jest.Mock;
    mockBcryptCompare.mockResolvedValue(false);

    await expect(refreshToken({ token: 'valid-refresh-token' })).rejects.toThrow(
      'Invalid or expired refresh token'
    );
  });

  it('should throw an error if token is expired', async () => {
    mockJwtVerify.mockReturnValue({
      userId: 'user123',
      email: 'ansuman@gmail.com',
      phone: '1234567890',
    });

    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);

    mockFindOne.mockResolvedValue({
      id: 'tokenId',
      userId: 'user123',
      hashedToken: 'hashedToken',
      expiresAt: pastDate,
      revoked: false,
    });

    const mockBcryptCompare = bcrypt.compare as jest.Mock;
    mockBcryptCompare.mockResolvedValue(true);

    await expect(refreshToken({ token: 'valid-refresh-token' })).rejects.toThrow(
      'Invalid or expired refresh token'
    );
  });

  it('should throw an error if token is revoked', async () => {
    mockJwtVerify.mockReturnValue({
      userId: 'user123',
      email: 'ansuman@gmail.com',
      phone: '1234567890',
    });

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);

    mockFindOne.mockResolvedValue({
      id: 'tokenId',
      userId: 'user123',
      hashedToken: 'hashedToken',
      expiresAt: futureDate,
      revoked: true,
    });

    const mockBcryptCompare = bcrypt.compare as jest.Mock;
    mockBcryptCompare.mockResolvedValue(true);

    await expect(refreshToken({ token: 'valid-refresh-token' })).rejects.toThrow(
      'Invalid or expired refresh token'
    );
  });

  it('should return new access token on valid refresh token', async () => {
    mockJwtVerify.mockReturnValue({
      userId: 'user123',
      email: 'ansuman@gmail.com',
      phone: '1234567890',
    });

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10);

    mockFindOne.mockResolvedValue({
      id: 'tokenId',
      userId: 'user123',
      hashedToken: 'hashedToken',
      expiresAt: futureDate,
      revoked: false,
    });

    const mockBcryptCompare = bcrypt.compare as jest.Mock;
    mockBcryptCompare.mockResolvedValue(true);

    const mockJwtSign = jwt.sign as jest.Mock;
    mockJwtSign.mockReturnValue('new-access-token');

    const result = await refreshToken({ token: 'valid-refresh-token' });

    expect(mockJwtVerify).toHaveBeenCalledWith('valid-refresh-token', expect.any(String));
    expect(mockFindOne).toHaveBeenCalled();
    expect(mockBcryptCompare).toHaveBeenCalledWith('valid-refresh-token', 'hashedToken');
    expect(mockJwtSign).toHaveBeenCalled();
    expect(result).toHaveProperty('accessToken', 'new-access-token');
  });
});
