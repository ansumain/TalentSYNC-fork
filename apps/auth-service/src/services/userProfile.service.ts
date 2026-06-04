import { User } from '@talentsync/models';
import UserRole from '../models/UserRole';
import Role from '../models/Role';
import { notFoundError } from '@talentsync/types';
import { UserProfileInput } from '../types/UserProfileInput';
import { UserProfileOutput } from '../types/UserProfileOutput';

// get user profile service
export const userProfile = async ({ userId }: UserProfileInput): Promise<UserProfileOutput> => {
  const user = await User.findOne({ where: { id: userId } });
  if (!user) {
    throw notFoundError('User not found', 'USER_NOT_FOUND');
  }

  // Fetch user roles
  const userRoles = await UserRole.findAll({ where: { userId: user.id } });
  const roleIds = userRoles.map((ur) => ur.roleId);
  
  const roles = await Role.findAll({ where: { id: roleIds } });
  const roleNames = roles.map((role) => role.role);

  return {
    userId: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    roles: roleNames,
  };
};
