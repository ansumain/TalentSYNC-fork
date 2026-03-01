import { updatePassword } from '../../services/updatePassword.service';
import { User } from '@talentsync/models';
import bcrypt from 'bcryptjs';

jest.mock('@talentsync/models');
jest.mock('bcryptjs');

describe('UpdatePassword Service', () => {
  let mockFindOne: jest.SpyInstance;
  let mockBcryptCompare: jest.Mock;
  let mockBcryptGenSalt: jest.Mock;
  let mockBcryptHash: jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();
    mockFindOne = jest.spyOn(User, 'findOne');
    mockBcryptCompare = bcrypt.compare as jest.Mock;
    mockBcryptGenSalt = bcrypt.genSalt as jest.Mock;
    mockBcryptHash = bcrypt.hash as jest.Mock;
  });

  it('should update password successfully', async () => {
    const mockUser = {
      id: 'user123',
      email: 'ansuman@gmail.com',
      hashedPassword: 'oldHashedPassword',
      save: jest.fn().mockResolvedValue(true),
    };

    mockFindOne.mockResolvedValue(mockUser);
    mockBcryptCompare.mockResolvedValue(true);
    mockBcryptGenSalt.mockResolvedValue('salt');
    mockBcryptHash.mockResolvedValue('newHashedPassword');

    const result = await updatePassword({
      userId: 'user123',
      oldPassword: 'oldpassword123',
      newPassword: 'newpassword456',
    });

    expect(mockFindOne).toHaveBeenCalledWith({ where: { id: 'user123' } });
    expect(mockBcryptCompare).toHaveBeenCalledWith('oldpassword123', 'oldHashedPassword');
    expect(mockBcryptGenSalt).toHaveBeenCalledWith(10);
    expect(mockBcryptHash).toHaveBeenCalledWith('newpassword456', 'salt');
    expect(mockUser.hashedPassword).toBe('newHashedPassword');
    expect(mockUser.save).toHaveBeenCalled();
    expect(result).toEqual({ message: 'Password for email: ansuman@gmail.com , Updated' });
  });

  it('should throw error if user not found', async () => {
    mockFindOne.mockResolvedValue(null);

    await expect(
      updatePassword({
        userId: 'no-user',
        oldPassword: 'oldPassword',
        newPassword: 'newPassword',
      })
    ).rejects.toThrow('User not found');

    expect(mockBcryptCompare).not.toHaveBeenCalled();
  });

  it('should throw error if old password is invalid', async () => {
    const mockUser = {
      id: 'user123',
      email: 'ansuman@gmail.com',
      hashedPassword: 'oldHashedPassword',
      save: jest.fn(),
    };

    mockFindOne.mockResolvedValue(mockUser);
    mockBcryptCompare.mockResolvedValue(false);

    await expect(
      updatePassword({
        userId: 'user123',
        oldPassword: 'wrongPassword',
        newPassword: 'newPassword',
      })
    ).rejects.toThrow('Invalid Password');

    expect(mockBcryptCompare).toHaveBeenCalledWith('wrongPassword', 'oldHashedPassword');
    expect(mockUser.save).not.toHaveBeenCalled();
  });
});
