import { updateUserProfile } from '../../services/updateUserProfile.service';
import User from '../../models/User';

jest.mock('../../models/User');

describe('UpdateUserProfile Service', () => {
  let mockFindOne: jest.SpyInstance;
  let mockUpdate: jest.SpyInstance;

  beforeEach(() => {
    jest.resetAllMocks();
    mockFindOne = jest.spyOn(User, 'findOne');
    mockUpdate = jest.spyOn(User, 'update');
  });

  it('should update user profile successfully', async () => {
    mockFindOne.mockResolvedValue(null);
    mockUpdate.mockResolvedValue([1]);

    const result = await updateUserProfile({
      userId: 'user123',
      name: 'new name',
      email: 'newmail@gmail.com',
      phone: '9090909090',
    });

    expect(mockUpdate).toHaveBeenCalledWith(
      { name: 'new name', email: 'newmail@gmail.com', phone: '9090909090' },
      { where: { id: 'user123' } }
    );
    expect(result).toEqual({ message: 'User profile updated' });
  });

  it('should update only name when only name is provided', async () => {
    mockFindOne.mockResolvedValue(null);
    mockUpdate.mockResolvedValue([1]);

    const result = await updateUserProfile({
      userId: 'user123',
      name: 'new Name',
    });

    expect(mockUpdate).toHaveBeenCalledWith({ name: 'new Name' }, { where: { id: 'user123' } });
    expect(result).toEqual({ message: 'User profile updated' });
  });

  it('should update only email when only email is provided', async () => {
    mockFindOne.mockResolvedValue(null);
    mockUpdate.mockResolvedValue([1]);

    const result = await updateUserProfile({
      userId: 'user123',
      email: 'newmail@gmail.com',
    });

    expect(mockUpdate).toHaveBeenCalledWith(
      { email: 'newmail@gmail.com' },
      { where: { id: 'user123' } }
    );
    expect(result).toEqual({ message: 'User profile updated' });
  });

  it('should update only phone when only phone is provided', async () => {
    mockFindOne.mockResolvedValue(null);
    mockUpdate.mockResolvedValue([1]);

    const result = await updateUserProfile({
      userId: 'user123',
      phone: '8989898989',
    });

    expect(mockUpdate).toHaveBeenCalledWith({ phone: '8989898989' }, { where: { id: 'user123' } });
    expect(result).toEqual({ message: 'User profile updated' });
  });

  it('should throw error if email already exists', async () => {
    mockFindOne.mockResolvedValueOnce({
      id: 'userabc',
      email: 'existingmail@gmail.com',
    });

    await expect(
      updateUserProfile({
        userId: 'userabc',
        email: 'existingmail@gmail.com',
      })
    ).rejects.toThrow('Email exists');

    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it('should throw error if phone already exists', async () => {
    mockFindOne.mockResolvedValueOnce({
      id: 'userabc',
      phone: '7878787878',
    });

    await expect(
      updateUserProfile({
        userId: 'userabc',
        phone: '7878787878',
      })
    ).rejects.toThrow('Phone exists');

    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it('should allow updating to same email (own email)', async () => {
    mockFindOne.mockResolvedValue(null);
    mockUpdate.mockResolvedValue([1]);

    const result = await updateUserProfile({
      userId: 'userabc',
      email: 'mymail@gmail.com',
    });

    expect(mockUpdate).toHaveBeenCalled();
    expect(result).toEqual({ message: 'User profile updated' });
  });

  it('should allow updating to same phone (own phone)', async () => {
    mockFindOne.mockResolvedValue(null);
    mockUpdate.mockResolvedValue([1]);

    const result = await updateUserProfile({
      userId: 'userabc',
      phone: '6767676767',
    });

    expect(mockUpdate).toHaveBeenCalled();
    expect(result).toEqual({ message: 'User profile updated' });
  });
});
