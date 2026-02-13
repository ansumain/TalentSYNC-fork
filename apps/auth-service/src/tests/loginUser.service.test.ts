import { loginUser } from '../services/loginUser.service';
import User from '../models/User';
// import { RefreshToken } from "../models/RefreshToken";
import { RefreshToken } from '../models/index';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

jest.mock('../models/User');
jest.mock('../models/RefreshToken');
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
