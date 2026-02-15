import { logoutUser } from '../services/logoutUser.service';
import RefreshToken from '../models/RefreshToken';

jest.mock('../models/RefreshToken');

describe('Authentication - Logout', () => {
  let mockDestroy: jest.SpyInstance;

  beforeEach(() => {
    jest.resetAllMocks();
    mockDestroy = jest.spyOn(RefreshToken, 'destroy');
  });

  it('should throw an error if userId is missing', async () => {
    await expect(logoutUser({ userId: '' })).rejects.toThrow('Missing required field');
    expect(mockDestroy).not.toHaveBeenCalled();
  });

  it('should revoke refresh token for given userId', async () => {
    mockDestroy.mockResolvedValue(1);

    const result = await logoutUser({ userId: 'user123' });

    expect(mockDestroy).toHaveBeenCalledWith({
      where: { userId: 'user123' },
    });
    expect(result).toHaveProperty('message', 'Logout successful');
  });

  it('should handle case when no active token found', async () => {
    mockDestroy.mockResolvedValue(0);

    const result = await logoutUser({ userId: 'user123' });

    expect(result).toHaveProperty('message', 'Logout successful');
  });
});
