import { registerUser } from '../services/authentication.service';
import User from '../models/User';
import bcrypt from 'bcryptjs';

jest.mock('../models/User');
jest.mock('bcryptjs');

interface RegisterUserOutput {
  id: string;
  name: string;
  email: string;
  phone: string;
  hashedPassword: string;
}

describe('Authentication - Register', () => {
  let mockCreate: jest.SpyInstance;
  let mockFindOne: jest.SpyInstance;

  beforeEach(() => {
    jest.resetAllMocks();
    mockCreate = jest.spyOn(User, 'create');
    mockFindOne = jest.spyOn(User, 'findOne');
  });

  it('should throw an error if name is missing', async () => {
    const userData = {
      name: '',
      email: 'ansuman@gmail.com',
      phone: '8998236475',
      password: 'password',
    };
    await expect(registerUser(userData)).rejects.toThrow('Missing required field');
    expect(User.create).not.toHaveBeenCalled();
  });

  it('should throw an error if email is missing', async () => {
    const userData = {
      name: 'Ansuman',
      email: '',
      phone: '8998236475',
      password: 'password',
    };
    await expect(registerUser(userData)).rejects.toThrow('Missing required field');
    expect(User.create).not.toHaveBeenCalled();
  });

  it('should throw an error if phone is missing', async () => {
    const userData = {
      name: 'Ansuman',
      email: 'ansuman@gmail.com',
      phone: '',
      password: 'password',
    };
    await expect(registerUser(userData)).rejects.toThrow('Missing required field');
    expect(User.create).not.toHaveBeenCalled();
  });

  it('should throw an error if password is missing', async () => {
    const userData = {
      name: 'Ansuman',
      email: 'ansuman@gmail.com',
      phone: '8998236475',
      password: '',
    };
    await expect(registerUser(userData)).rejects.toThrow('Missing required field');
    expect(User.create).not.toHaveBeenCalled();
  });

  it('should throw an error if name length is too short', async () => {
    const userData = {
      name: 'An',
      email: 'ansuman@gmail.com',
      phone: '8998236475',
      password: 'password',
    };
    await expect(registerUser(userData)).rejects.toThrow('Name too short');
    expect(User.create).not.toHaveBeenCalled();
  });

  it('should throw an error if name length is too long', async () => {
    const userData = {
      name: 'AnsumanPandaIsTestingThisCode',
      email: 'ansuman@gmail.com',
      phone: '8998236475',
      password: 'password',
    };
    await expect(registerUser(userData)).rejects.toThrow('Name too long');
    expect(User.create).not.toHaveBeenCalled();
  });

  it('should throw an error if email exists', async () => {
    mockFindOne.mockResolvedValue({
      email: 'ansuman@gmail.com',
    } as { email: string });

    const userData = {
      name: 'Ansuman',
      email: 'ansuman@gmail.com',
      phone: '8998236475',
      password: 'password',
    };

    await expect(registerUser(userData)).rejects.toThrow('Email exists');

    expect(User.create).not.toHaveBeenCalled();
  });

  it('should throw an error if phone exists', async () => {
    mockFindOne.mockResolvedValue({
      phone: '8998236475',
    } as { phone: string });

    const userData = {
      name: 'Ansuman',
      email: 'ansuman@gmail.com',
      phone: '8998236475',
      password: 'password',
    };

    await expect(registerUser(userData)).rejects.toThrow('Phone exists');
    expect(User.create).not.toHaveBeenCalled();
  });

  it('should throw an error if password is short', async () => {
    const userData = {
      name: 'Ansuman',
      email: 'ansuman@yahoo.com',
      phone: '8877665544',
      password: 'pass',
    };
    await expect(registerUser(userData)).rejects.toThrow('Weak password');
    expect(User.create).not.toHaveBeenCalled();
    expect(bcrypt.genSalt).not.toHaveBeenCalled();
    expect(bcrypt.hash).not.toHaveBeenCalled();
  });

  it('should create user with hashed password', async () => {
    const mockBcryptGenSalt = bcrypt.genSalt as jest.Mock;
    mockBcryptGenSalt.mockResolvedValue('mockSalt');

    const mockBcryptHash = bcrypt.hash as jest.Mock;
    mockBcryptHash.mockResolvedValue('hashedPassword');

    mockFindOne.mockResolvedValue(null);
    mockCreate.mockResolvedValue({
      id: 'uuid-123',
      name: 'Ansuman',
      email: 'ansuman@yahoo.com',
      phone: '8877665544',
      hashedPassword: 'hashedPassword',
    } as RegisterUserOutput);

    const result = await registerUser({
      name: 'Ansuman',
      email: 'ansuman@yahoo.com',
      phone: '8877665544',
      password: 'password',
    });

    expect(bcrypt.hash).toHaveBeenCalledWith('password', expect.any(String));
    expect(User.create).toHaveBeenCalled();

    expect(result).toHaveProperty('id');
    expect(result.hashedPassword).not.toBe('password');
  });
});
