import { userProfile } from '../../services/userProfile.service';
import { User } from '@talentsync/models';
import UserRole from '../../models/UserRole';
import Role from '../../models/Role';

jest.mock('@talentsync/models');
jest.mock('../../models/UserRole');
jest.mock('../../models/Role');

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
    (UserRole.findAll as jest.Mock).mockResolvedValue([]);
    (Role.findAll as jest.Mock).mockResolvedValue([]);

    const result = await userProfile({ userId: 'user123' });

    expect(User.findOne).toHaveBeenCalledWith({ where: { id: 'user123' } });

    expect(result).toEqual({
      userId: mockUser.id,
      name: mockUser.name,
      email: mockUser.email,
      phone: mockUser.phone,
      roles: [],
    });
  });
});
