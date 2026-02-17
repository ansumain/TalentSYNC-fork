import { logoutUser } from '../../services/logoutUser.service';
import RefreshToken from '../../models/RefreshToken';

jest.mock('../../models/RefreshToken');

describe('Authentication - Logout User', () => {
  let mockUpdate: jest.SpyInstance;

  beforeEach(() => {
    jest.resetAllMocks();
    mockUpdate = jest.spyOn(RefreshToken, 'update');
  });

  it('should throw an error if userId is missing', async () => {
    await expect(logoutUser({ userId: '' })).rejects.toThrow('Missing required field');
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it('should revoke all active refresh tokens and return success message', async () => {
    const mockUserId = 'user123';

    mockUpdate.mockResolvedValue([1]);

    const result = await logoutUser({ userId: mockUserId });

    expect(mockUpdate).toHaveBeenCalledWith(
      { revoked: true },
      { where: { userId: mockUserId, revoked: false } }
    );

    expect(result).toEqual({ message: 'Logout successful' });
  });

  it('should return success even if no active tokens were found to revoke', async () => {
    const mockUserId = 'user-with-no-sessions';

    mockUpdate.mockResolvedValue([0]);

    const result = await logoutUser({ userId: mockUserId });

    expect(mockUpdate).toHaveBeenCalled();
    expect(result).toEqual({ message: 'Logout successful' });
  });
});
