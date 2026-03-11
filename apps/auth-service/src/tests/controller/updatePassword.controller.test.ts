import { Request, Response } from 'express';
import { UpdatePasswordController } from '../../controllers/updatePassword.controller';
import { updatePassword } from '../../services/updatePassword.service';

jest.mock('../../services/updatePassword.service');

describe('UpdatePasswordController - Update Password', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockUpdatePassword: jest.MockedFunction<typeof updatePassword>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = {
      userInfo: { sub: 'user123', name: 'Ansuman Panda' },
      body: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockUpdatePassword = updatePassword as jest.MockedFunction<typeof updatePassword>;
  });

  // Happy Path
  it('201 - should update password successfully', async () => {
    mockRequest.body = {
      oldPassword: 'oldPassword',
      newPassword: 'newPassword',
    };

    mockUpdatePassword.mockResolvedValue({
      message: 'Password for email: ansuman@gmail.com , Updated',
    });

    await UpdatePasswordController.updatePassword(mockRequest as Request, mockResponse as Response);

    expect(mockUpdatePassword).toHaveBeenCalledWith({
      userId: 'user123',
      oldPassword: 'oldPassword',
      newPassword: 'newPassword',
    });
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Password for email: ansuman@gmail.com , Updated',
    });
  });

  // Validation Errors
  it('400 - should return error for missing body', async () => {
    mockRequest.body = undefined;

    await UpdatePasswordController.updatePassword(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Missing body',
    });
  });

  it('400 - should return error for missing oldPassword', async () => {
    mockRequest.body = {
      newPassword: 'newPassword',
    };

    await UpdatePasswordController.updatePassword(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Missing required field',
    });
  });

  it('400 - should return error for missing newPassword', async () => {
    mockRequest.body = {
      oldPassword: 'oldPassword',
    };

    await UpdatePasswordController.updatePassword(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Missing required field',
    });
  });

  it('400 - should return error for missing both passwords', async () => {
    mockRequest.body = {};

    await UpdatePasswordController.updatePassword(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Missing required field',
    });
  });

  // Unauthorized Errors
  it('401 - should return error if userInfo is missing', async () => {
    mockRequest.userInfo = undefined;

    await UpdatePasswordController.updatePassword(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Unauthorized',
    });
  });

  it('401 - should return error if sub is missing', async () => {
    mockRequest.userInfo = { sub: '', name: 'Ansuman Panda' };

    await UpdatePasswordController.updatePassword(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Unauthorized',
    });
  });

  it('401 - should return error for invalid old password', async () => {
    mockRequest.body = {
      oldPassword: 'wrongOldPassword',
      newPassword: 'newPassword',
    };

    mockUpdatePassword.mockRejectedValue(new Error('Invalid Password'));

    await UpdatePasswordController.updatePassword(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Invalid Password',
    });
  });

  // Not Found
  it('404 - should return error if user not found', async () => {
    mockRequest.body = {
      oldPassword: 'oldPassword',
      newPassword: 'newPassword',
    };

    mockUpdatePassword.mockRejectedValue(new Error('User not found'));

    await UpdatePasswordController.updatePassword(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'User not found',
    });
  });

  // Internal Server Error
  it('500 - should return server error for unexpected errors', async () => {
    mockRequest.body = {
      oldPassword: 'oldPassword',
      newPassword: 'newPassword',
    };

    mockUpdatePassword.mockRejectedValue(new Error('Database connection failed'));

    await UpdatePasswordController.updatePassword(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Internal server error',
    });
  });
});
