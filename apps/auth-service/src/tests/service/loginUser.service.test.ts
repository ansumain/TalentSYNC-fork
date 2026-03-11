import { loginUser } from '../../services/loginUser.service';
import { User } from '@talentsync/models';
import { RefreshToken } from '../../models/index';
import UserRole from '../../models/UserRole';
import Role from '../../models/Role';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

jest.mock('@talentsync/models');
jest.mock('../../models/RefreshToken');
jest.mock('../../models/UserRole');
jest.mock('../../models/Role');
jest.mock('jsonwebtoken');
jest.mock('bcryptjs');

describe('Authentication - Login', () => {
  let mockCreate: jest.SpyInstance;
  let mockFindOne: jest.SpyInstance;

  beforeEach(() => {
    jest.resetAllMocks();
    mockCreate = jest.spyOn(RefreshToken, 'create');
    mockFindOne = jest.spyOn(User, 'findOne');
  });

  it('should throw an error if email is missing', async () => {
    const userData = {
      email: '',
      password: 'password',
    };
    await expect(loginUser(userData)).rejects.toThrow('Missing required field');
    expect(jwt.sign).not.toHaveBeenCalled();
  });

  it('should throw an error if password is missing', async () => {
    const userData = {
      email: 'ansuman@gmail.com',
      password: '',
    };
    await expect(loginUser(userData)).rejects.toThrow('Missing required field');
    expect(jwt.sign).not.toHaveBeenCalled();
  });

  it('should throw error if user doesnot exist', async () => {
    mockFindOne.mockResolvedValue(null);
    const userData = {
      email: 'ansuman@gmail.com',
      password: 'password',
    };

    await expect(loginUser(userData)).rejects.toThrow('User not found');
  });

  it('should throw error if password is invalid', async () => {
    mockFindOne.mockResolvedValue({
      hashedPassword: 'hashedPassword',
    });
    const userData = {
      email: 'ansuman@gmail.com',
      password: 'password',
    };

    const mockBcryptCompare = bcrypt.compare as jest.Mock;
    mockBcryptCompare.mockResolvedValue(false);
    await expect(loginUser(userData)).rejects.toThrow('Invalid Password');
  });

  it('should create a access token on successful login', async () => {
    const userData = {
      email: 'ansuman@gmail.com',
      password: 'password',
    };
    mockFindOne.mockResolvedValue({
      id: 'abcd',
      email: 'ansuman@gmail.com',
      phone: '9999999999',
      hashedPassword: 'hashedPassword',
    });

    const mockBcryptCompare = bcrypt.compare as jest.Mock;
    mockBcryptCompare.mockResolvedValue(true);

    (UserRole.findAll as jest.Mock).mockResolvedValue([{ roleId: 'role-1' }]);
    (Role.findOne as jest.Mock).mockResolvedValue({ id: 'role-1', role: 'manager' });
    (RefreshToken.update as jest.Mock).mockResolvedValue([1]);

    const mockJwtSign = jwt.sign as jest.Mock;
    mockJwtSign.mockReturnValue('mockAccessToken');

    mockCreate.mockResolvedValue({
      id: 'abcd',
    });

    const result = await loginUser(userData);

    expect(mockFindOne).toHaveBeenCalled();
    expect(mockBcryptCompare).toHaveBeenCalledWith('password', 'hashedPassword');
    expect(mockJwtSign).toHaveBeenCalled();
    expect(mockCreate).toHaveBeenCalled();

    expect(result).toHaveProperty('accessToken', 'mockAccessToken');
  });

  it('should create a refresh token on successful login', async () => {
    const userData = {
      email: 'ansuman@gmail.com',
      password: 'password',
    };
    mockFindOne.mockResolvedValue({
      id: 'abcd',
      email: 'ansuman@gmail.com',
      phone: '9999999999',
      hashedPassword: 'hashedPassword',
    });

    const mockBcryptCompare = bcrypt.compare as jest.Mock;
    mockBcryptCompare.mockResolvedValue(true);

    (UserRole.findAll as jest.Mock).mockResolvedValue([{ roleId: 'role-1' }]);
    (Role.findOne as jest.Mock).mockResolvedValue({ id: 'role-1', role: 'manager' });
    (RefreshToken.update as jest.Mock).mockResolvedValue([1]);

    const mockJwtSign = jwt.sign as jest.Mock;
    mockJwtSign.mockReturnValue('mockRefreshToken');

    mockCreate.mockResolvedValue({
      id: 'abcd',
    });

    const result = await loginUser(userData);

    expect(mockFindOne).toHaveBeenCalled();
    expect(mockBcryptCompare).toHaveBeenCalledWith('password', 'hashedPassword');
    expect(mockJwtSign).toHaveBeenCalled();
    expect(mockCreate).toHaveBeenCalled();

    expect(result).toHaveProperty('refreshToken', 'mockRefreshToken');
  });
});
