import { Request, Response } from 'express';
import { RefreshTokenController } from '../../controllers/refreshToken.controller';
import { refreshToken } from '../../services/refreshToken.service';

jest.mock('../../services/refreshToken.service');

describe('RefreshTokenController - Refresh Token', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockRefreshToken: jest.MockedFunction<typeof refreshToken>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = {
      cookies: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
    };

    mockRefreshToken = refreshToken as jest.MockedFunction<typeof refreshToken>;
  });

  // Happy Path
  it('200 - should refresh token successfully', async () => {
    mockRequest.cookies = {
      refresh_token: 'valid-refresh-token',
    };

    mockRefreshToken.mockResolvedValue({
      accessToken: 'new-access-token',
    });

    await RefreshTokenController.getAccessToken(mockRequest as Request, mockResponse as Response);

    expect(mockRefreshToken).toHaveBeenCalledWith({
      token: 'valid-refresh-token',
    });
    expect(mockResponse.cookie).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Access Token Renewed Successfully!',
    });
  });

  // Validation Error
  it('400 - should return error for missing token', async () => {
    mockRefreshToken.mockRejectedValue(new Error('Missing required field'));

    await RefreshTokenController.getAccessToken(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Missing required field',
    });
  });

  // Unauthorized
  it('401 - should return error for invalid token', async () => {
    mockRequest.cookies = {
      refresh_token: 'invalid-token',
    };

    mockRefreshToken.mockRejectedValue(new Error('Invalid token'));

    await RefreshTokenController.getAccessToken(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid token' });
    expect(mockResponse.clearCookie).toHaveBeenCalledWith(
      'refresh_token',
      expect.objectContaining({ path: '/auth/refresh-token' })
    );
  });

  it('401 - should return error for expired token', async () => {
    mockRequest.cookies = {
      refresh_token: 'expired-token',
    };

    mockRefreshToken.mockRejectedValue(new Error('Invalid or expired refresh token'));

    await RefreshTokenController.getAccessToken(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Invalid or expired refresh token',
    });
    expect(mockResponse.clearCookie).toHaveBeenCalledWith(
      'refresh_token',
      expect.objectContaining({ path: '/auth/refresh-token' })
    );
  });

  it('401 - should return error for revoked token', async () => {
    mockRequest.cookies = {
      refresh_token: 'revoked-token',
    };

    mockRefreshToken.mockRejectedValue(new Error('Invalid or expired refresh token'));

    await RefreshTokenController.getAccessToken(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Invalid or expired refresh token',
    });
    expect(mockResponse.clearCookie).toHaveBeenCalledWith(
      'refresh_token',
      expect.objectContaining({ path: '/auth/refresh-token' })
    );
  });

  // Internal Server Error
  it('500 - should return server error for unexpected errors', async () => {
    mockRequest.cookies = {
      refresh_token: 'valid-token',
    };

    mockRefreshToken.mockRejectedValue(new Error('Database connection failed'));

    await RefreshTokenController.getAccessToken(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Internal server error',
    });
  });
});
