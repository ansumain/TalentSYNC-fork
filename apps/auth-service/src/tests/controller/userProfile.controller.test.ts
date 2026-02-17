import { Request, Response } from 'express';
import { UserProfileController } from '../../controllers/userProfile.controller';
import { userProfile } from '../../services/userProfile.service';

jest.mock('../../services/userProfile.service');

describe('UserProfileController - User Profile', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockUserProfile: jest.MockedFunction<typeof userProfile>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = {
      userInfo: {
        sub: '',
        name: '',
      },
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockUserProfile = userProfile as jest.MockedFunction<typeof userProfile>;
  });

  // Happy Path
  it('200 - should return user profile successfully', async () => {
    mockRequest.userInfo = {
      sub: 'user123',
      name: 'Ansuman Panda',
    };

    mockUserProfile.mockResolvedValue({
      userId: 'user123',
      name: 'Ansuman Panda',
      email: 'ansuman@gmail.com',
      phone: '9090909090',
    });

    await UserProfileController.userProfile(mockRequest as Request, mockResponse as Response);

    expect(mockUserProfile).toHaveBeenCalledWith({
      userId: 'user123',
    });

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      data: {
        userId: 'user123',
        name: 'Ansuman Panda',
        email: 'ansuman@gmail.com',
        phone: '9090909090',
      },
    });
  });

  // Unauthorized
  it('401 - should return unauthorized if userInfo is missing', async () => {
    mockRequest.userInfo = undefined;

    await UserProfileController.userProfile(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Unauthorized',
    });
  });

  // User Not Found
  it('404 - should return error if user not found', async () => {
    mockRequest.userInfo = {
      sub: 'invalid-userId',
      name: '',
    };

    mockUserProfile.mockRejectedValue(new Error('User not found'));

    await UserProfileController.userProfile(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'User not found',
    });
  });

  // Internal Server Error
  it('500 - should return server error for unexpected errors', async () => {
    mockRequest.userInfo = {
      sub: 'user123',
      name: 'Ansuman Panda',
    };

    mockUserProfile.mockRejectedValue(new Error('Database connection failed'));

    await UserProfileController.userProfile(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Internal server error',
    });
  });
});
