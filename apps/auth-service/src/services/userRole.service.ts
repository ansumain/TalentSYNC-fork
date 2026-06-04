import UserRole from '../models/UserRole';
import { User } from '@talentsync/models';
import Role from '../models/Role';
import { badRequestError, conflictError, notFoundError } from '@talentsync/types';

// assign role to user service
const assignRoleToUser = async (userId: string, roleId: string): Promise<{ message: string }> => {
  if (!userId || !roleId) throw badRequestError('Missing required field', 'MISSING_REQUIRED_FIELD');

  // Check if user exists
  const user = await User.findOne({ where: { id: userId } });
  if (!user) throw notFoundError('User not found', 'USER_NOT_FOUND');

  // Check if role exists
  const role = await Role.findOne({ where: { id: roleId } });
  if (!role) throw notFoundError('Role not found', 'ROLE_NOT_FOUND');

  // Check if assignment already exists
  const existingAssignment = await UserRole.findOne({ where: { userId, roleId } });
  if (existingAssignment) {
    throw conflictError('Role already assigned to user', 'ROLE_ALREADY_ASSIGNED');
  }

  await UserRole.create({ userId, roleId });
  return { message: 'Assign Role to User, successful' };
};

// revoke role from user service
const revokeRoleFromUser = async (userId: string, roleId: string): Promise<{ message: string }> => {
  if (!userId || !roleId) throw badRequestError('Missing required field', 'MISSING_REQUIRED_FIELD');

  // Check if assignment exists
  const assignment = await UserRole.findOne({ where: { userId, roleId } });
  if (!assignment) throw notFoundError('Role assignment not found', 'ROLE_ASSIGNMENT_NOT_FOUND');

  await UserRole.destroy({ where: { userId, roleId } });
  return { message: 'Revoke Role from User, successful' };
};

export { assignRoleToUser, revokeRoleFromUser };
