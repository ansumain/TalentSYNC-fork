import { userProfile } from '../../services/userProfile.service';
import { User } from '@talentsync/models';

jest.mock('@talentsync/models');

describe('UserProfile - Get User Data service', () => {
  let mockFindOne: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockFindOne = jest.spyOn(User, 'findOne');
  });

  it('should throw an error if user is not found', async () => {
    mockFindOne.mockResolvedValue(null);

    await expect(userProfile({ userId: 'invalid-userId' })).rejects.toThrow('User not found');

    expect(User.findOne).toHaveBeenCalled();
  });

  it('should return user profile when user exists', async () => {
    const mockUser = {
      id: 'user123',
      name: 'Ansuman Panda',
      email: 'ansuman#gmail.com',
      phone: '9090909090',
    };

    mockFindOne.mockResolvedValue(mockUser);
    const result = await userProfile({ userId: 'user123' });

    expect(User.findOne).toHaveBeenCalledWith({ where: { id: 'user123' } });

    expect(result).toEqual({
      userId: mockUser.id,
      name: mockUser.name,
      email: mockUser.email,
      phone: mockUser.phone,
    });
  });
});
