import { Request, Response } from 'express';
import { LoginUserController } from '../../controllers/loginUser.controller';
import { loginUser } from '../../services/loginUser.service';

jest.mock('../../services/loginUser.service');

describe('LoginUserController - Login', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockLoginUser: jest.MockedFunction<typeof loginUser>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = {
      body: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
    };

    mockLoginUser = loginUser as jest.MockedFunction<typeof loginUser>;
  });

  // Happy Path
  it('200 - should login user successfully', async () => {
    mockRequest.body = {
      email: 'ansuman@gmail.com',
      password: 'password123',
    };

    mockLoginUser.mockResolvedValue({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    });

    await LoginUserController.login(mockRequest as Request, mockResponse as Response);

    expect(mockLoginUser).toHaveBeenCalledWith({
      email: 'ansuman@gmail.com',
      password: 'password123',
    });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.cookie).toHaveBeenCalledTimes(2);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Login Successful',
    });
  });

  // Validation Errors
  it('400 - should return error for missing email', async () => {
    mockRequest.body = { email: '', password: 'password' };

    mockLoginUser.mockRejectedValue(new Error('Missing required field'));

    await LoginUserController.login(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Missing required field',
    });
  });

  it('400 - should return error for missing password', async () => {
    mockRequest.body = { email: 'ansuman@gmail.com', password: '' };

    mockLoginUser.mockRejectedValue(new Error('Missing required field'));

    await LoginUserController.login(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Missing required field',
    });
  });

  // Not Found
  it('404 - should return error if user not found', async () => {
    mockRequest.body = {
      email: 'nonexisting@gmail.com',
      password: 'password',
    };

    mockLoginUser.mockRejectedValue(new Error('User not found'));

    await LoginUserController.login(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'User not found' });
  });

  // Unauthorized
  it('401 - should return error for invalid password', async () => {
    mockRequest.body = {
      email: 'ansuman@gmail.com',
      password: 'wrongpassword',
    };

    mockLoginUser.mockRejectedValue(new Error('Invalid Password'));

    await LoginUserController.login(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid Password' });
  });

  // Internal server error
  it('500 - should return server error for unexpected errors', async () => {
    mockRequest.body = {
      email: 'ansuman@gmail.com',
      password: 'password',
    };

    mockLoginUser.mockRejectedValue(new Error('Database connection failed'));

    await LoginUserController.login(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Internal server error',
    });
  });
});
