import { Request, Response } from 'express';
import { RegisterUserController } from '../../controllers/registerUser.controller';
import { registerUser } from '../../services/registerUser.service';

jest.mock('../../services/registerUser.service');

describe('RegisterUserController - Register', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockRegisterUser: jest.MockedFunction<typeof registerUser>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = {
      body: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockRegisterUser = registerUser as jest.MockedFunction<typeof registerUser>;
  });

  // Happy Path
  it('201 - should register user successfully', async () => {
    mockRequest.body = {
      name: 'Ansuman Panda',
      email: 'ansuman@gmail.com',
      phone: '9876543210',
      password: 'password123',
    };

    mockRegisterUser.mockResolvedValue({
      id: 'user123',
      name: 'Ansuman Panda',
      email: 'ansuman@gmail.com',
      phone: '9876543210',
      hashedPassword: 'hashedPassword',
    });

    await RegisterUserController.register(mockRequest as Request, mockResponse as Response);

    expect(mockRegisterUser).toHaveBeenCalledWith({
      name: 'Ansuman Panda',
      email: 'ansuman@gmail.com',
      phone: '9876543210',
      password: 'password123',
    });
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      id: 'user123',
      name: 'Ansuman Panda',
      email: 'ansuman@gmail.com',
      phone: '9876543210',
    });
  });

  // Validation Errors
  it('400 - should return error for missing required field', async () => {
    mockRequest.body = {
      name: '',
      email: 'ansuman@gmail.com',
      phone: '1234567890',
      password: 'pass',
    };

    mockRegisterUser.mockRejectedValue(new Error('Missing required field'));

    await RegisterUserController.register(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Missing required field',
    });
  });

  it('400 - should return error for name too short', async () => {
    mockRequest.body = {
      name: 'An',
      email: 'ansuman@gmail.com',
      phone: '1234567890',
      password: 'pass',
    };

    mockRegisterUser.mockRejectedValue(new Error('Name too short'));

    await RegisterUserController.register(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Name too short' });
  });

  it('400 - should return error for name too long', async () => {
    mockRequest.body = {
      name: 'ThisNameIsTooLongForTheValidation',
      email: 'ansuman@gmail.com',
      phone: '1234567890',
      password: 'pass',
    };

    mockRegisterUser.mockRejectedValue(new Error('Name too long'));

    await RegisterUserController.register(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Name too long' });
  });

  it('400 - should return error for weak password', async () => {
    mockRequest.body = {
      name: 'Ansuman',
      email: 'ansuman@gmail.com',
      phone: '1234567890',
      password: '123',
    };

    mockRegisterUser.mockRejectedValue(new Error('Weak password'));

    await RegisterUserController.register(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Weak password' });
  });

  // Conflict Errors
  it('409 - should return error if email already exists', async () => {
    mockRequest.body = {
      name: 'Ansuman Panda',
      email: 'existing@gmail.com',
      phone: '1234567890',
      password: 'password',
    };

    mockRegisterUser.mockRejectedValue(new Error('Email exists'));

    await RegisterUserController.register(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(409);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Email exists' });
  });

  it('409 - should return error if phone already exists', async () => {
    mockRequest.body = {
      name: 'Ansuman Panda',
      email: 'new@gmail.com',
      phone: '9999999999',
      password: 'password',
    };

    mockRegisterUser.mockRejectedValue(new Error('Phone exists'));

    await RegisterUserController.register(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(409);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Phone exists' });
  });

  // Internal Server Error
  it('500 - should return server error for unexpected errors', async () => {
    mockRequest.body = {
      name: 'Ansuman Panda',
      email: 'ansuman@gmail.com',
      phone: '1234567890',
      password: 'password',
    };

    mockRegisterUser.mockRejectedValue(new Error('Database connection failed'));

    await RegisterUserController.register(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Internal server error',
    });
  });
});
