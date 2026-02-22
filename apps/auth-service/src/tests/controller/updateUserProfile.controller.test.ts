// import { Request, Response } from 'express';
// import { UpdateUserProfileController } from '../../controllers/updateUserProfile.controller';
// import { updateUserProfile } from '../../services/updateUserProfile.service';

// jest.mock('../../services/updateUserProfile.service');

// describe('UpdateUserProfileController - Update Profile', () => {
//   let mockRequest: Partial<Request>;
//   let mockResponse: Partial<Response>;
//   let mockUpdateUserProfile: jest.MockedFunction<typeof updateUserProfile>;

//   beforeEach(() => {
//     jest.clearAllMocks();

//     mockRequest = {
//       userInfo: { sub: 'user123', name: 'Ansuman Panda' },
//       body: {},
//     };

//     mockResponse = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn().mockReturnThis(),
//     };

//     mockUpdateUserProfile = updateUserProfile as jest.MockedFunction<typeof updateUserProfile>;
//   });

//   // Happy Path
//   it('200 - should update user profile successfully', async () => {
//     mockRequest.body = {
//       name: 'new name',
//       email: 'newmail@gmail.com',
//       phone: '7878787878',
//     };

//     mockUpdateUserProfile.mockResolvedValue({
//       message: 'User profile updated',
//     });

//     await UpdateUserProfileController.updateUserProfile(
//       mockRequest as Request,
//       mockResponse as Response
//     );

//     expect(mockUpdateUserProfile).toHaveBeenCalledWith({
//       userId: 'user123',
//       name: 'new name',
//       email: 'newmail@gmail.com',
//       phone: '7878787878',
//     });
//     expect(mockResponse.status).toHaveBeenCalledWith(200);
//     expect(mockResponse.json).toHaveBeenCalledWith({
//       message: 'User profile updated',
//     });
//   });

//   it('200 - should update only provided fields', async () => {
//     mockRequest.body = {
//       name: 'onlyNewName',
//     };

//     mockUpdateUserProfile.mockResolvedValue({
//       message: 'User profile updated',
//     });

//     await UpdateUserProfileController.updateUserProfile(
//       mockRequest as Request,
//       mockResponse as Response
//     );

//     expect(mockUpdateUserProfile).toHaveBeenCalledWith({
//       userId: 'user123',
//       name: 'onlyNewName',
//     });
//     expect(mockResponse.status).toHaveBeenCalledWith(200);
//   });

//   // Validation Errors
//   it('400 - should return error for missing body', async () => {
//     mockRequest.body = undefined;

//     await UpdateUserProfileController.updateUserProfile(
//       mockRequest as Request,
//       mockResponse as Response
//     );

//     expect(mockResponse.status).toHaveBeenCalledWith(400);
//     expect(mockResponse.json).toHaveBeenCalledWith({
//       error: 'Missing body',
//     });
//   });

//   // Unauthorized Errors
//   it('401 - should return error if userInfo is missing', async () => {
//     mockRequest.userInfo = undefined;

//     await UpdateUserProfileController.updateUserProfile(
//       mockRequest as Request,
//       mockResponse as Response
//     );

//     expect(mockResponse.status).toHaveBeenCalledWith(401);
//     expect(mockResponse.json).toHaveBeenCalledWith({
//       error: 'Unauthorized',
//     });
//   });

//   it('401 - should return error if sub is missing', async () => {
//     mockRequest.userInfo = { sub: '', name: 'Ansuman Panda' };

//     await UpdateUserProfileController.updateUserProfile(
//       mockRequest as Request,
//       mockResponse as Response
//     );

//     expect(mockResponse.status).toHaveBeenCalledWith(401);
//     expect(mockResponse.json).toHaveBeenCalledWith({
//       error: 'Unauthorized',
//     });
//   });

//   // Conflict Errors
//   it('409 - should return error if email already exists', async () => {
//     mockRequest.body = {
//       email: 'existingmail@gmail.com',
//     };

//     mockUpdateUserProfile.mockRejectedValue(new Error('Email exists'));

//     await UpdateUserProfileController.updateUserProfile(
//       mockRequest as Request,
//       mockResponse as Response
//     );

//     expect(mockResponse.status).toHaveBeenCalledWith(409);
//     expect(mockResponse.json).toHaveBeenCalledWith({
//       error: 'Email exists',
//     });
//   });

//   it('409 - should return error if phone already exists', async () => {
//     mockRequest.body = {
//       phone: '7878787878',
//     };

//     mockUpdateUserProfile.mockRejectedValue(new Error('Phone exists'));

//     await UpdateUserProfileController.updateUserProfile(
//       mockRequest as Request,
//       mockResponse as Response
//     );

//     expect(mockResponse.status).toHaveBeenCalledWith(409);
//     expect(mockResponse.json).toHaveBeenCalledWith({
//       error: 'Phone exists',
//     });
//   });

//   // Internal Server Error
//   it('500 - should return server error for unexpected errors', async () => {
//     mockRequest.body = {
//       name: 'Ansuman',
//     };

//     mockUpdateUserProfile.mockRejectedValue(new Error('Database connection failed'));

//     await UpdateUserProfileController.updateUserProfile(
//       mockRequest as Request,
//       mockResponse as Response
//     );

//     expect(mockResponse.status).toHaveBeenCalledWith(500);
//     expect(mockResponse.json).toHaveBeenCalledWith({
//       error: 'Internal server error',
//     });
//   });
// });
