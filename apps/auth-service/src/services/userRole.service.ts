import UserRole from '../models/UserRole';
import { User } from '@talentsync/models';
import Role from '../models/Role';

// assign role to user service
const assignRoleToUser = async (userId: string, roleId: string): Promise<{ message: string }> => {
  if (!userId || !roleId) throw new Error('Missing required field');

  // Check if user exists
  const user = await User.findOne({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  // Check if role exists
  const role = await Role.findOne({ where: { id: roleId } });
  if (!role) throw new Error('Role not found');

  // Check if assignment already exists
  const existingAssignment = await UserRole.findOne({ where: { userId, roleId } });
  if (existingAssignment) throw new Error('Role already assigned to user');

  await UserRole.create({ userId, roleId });
  return { message: 'Assign Role to User, successful' };
};

// revoke role from user service
const revokeRoleFromUser = async (userId: string, roleId: string): Promise<{ message: string }> => {
  if (!userId || !roleId) throw new Error('Missing required field');

  // Check if assignment exists
  const assignment = await UserRole.findOne({ where: { userId, roleId } });
  if (!assignment) throw new Error('Role assignment not found');

  await UserRole.destroy({ where: { userId, roleId } });
  return { message: 'Revoke Role from User, successful' };
};

export { assignRoleToUser, revokeRoleFromUser };
