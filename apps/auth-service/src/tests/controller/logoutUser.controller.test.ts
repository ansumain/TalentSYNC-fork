import { Request, Response } from 'express';
import { LogoutUserController } from '../../controllers/logoutUser.controller';
import { logoutUser } from '../../services/logoutUser.service';

jest.mock('../../services/logoutUser.service');

describe('LogoutUserController - Logout', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockLogoutUser: jest.MockedFunction<typeof logoutUser>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = {
      userInfo: { userId: '', email: '', phone: '' },
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
    };

    mockLogoutUser = logoutUser as jest.MockedFunction<typeof logoutUser>;
  });

  // Happy Path
  it('200 - should logout user successfully', async () => {
    mockRequest.userInfo = {
      userId: 'user123',
      email: 'ansuman@gmail.com',
      phone: '9090909090',
    };

    mockLogoutUser.mockResolvedValue({
      message: 'Logout successful',
    });

    await LogoutUserController.logout(mockRequest as Request, mockResponse as Response);

    expect(mockLogoutUser).toHaveBeenCalledWith({
      userId: 'user123',
    });
    expect(mockResponse.clearCookie).toHaveBeenCalledTimes(2);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Logout successful',
    });
  });

  // Validation Errors
  it('400 - should return error for missing userId', async () => {
    mockRequest.userInfo = { userId: '', email: '', phone: '' };

    mockLogoutUser.mockRejectedValue(new Error('Missing required field'));

    await LogoutUserController.logout(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Missing required field',
    });
  });

  // Internal Server Error
  it('500 - should return server error for unexpected errors', async () => {
    mockRequest.userInfo = {
      userId: 'user123',
      email: 'ansuman@gmail.com',
      phone: '8989898989',
    };

    mockLogoutUser.mockRejectedValue(new Error('Database connection failed'));

    await LogoutUserController.logout(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Internal server error',
    });
  });
});
