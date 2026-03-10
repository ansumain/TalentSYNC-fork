import Permission from '../models/Permission';
import Role from '../models/Role';
import RolePermission from '../models/RolePermission';
import UserRole from '../models/UserRole';
import { User } from '@talentsync/models';

// get user roles service
const getUserRoles = async (userId: string): Promise<string[]> => {
  if (!userId) throw new Error('Missing user ID');

  // Check if user exists
  const user = await User.findOne({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  const userRoleIds = await UserRole.findAll({ where: { userId } });
  const roleIds: string[] = userRoleIds.map((userRoleId) => userRoleId.roleId);

  const userRoles: string[] = [];

  for (const roleId of roleIds) {
    const role = await Role.findOne({ where: { id: roleId } });
    if (role) userRoles.push(role.role);
  }
  return userRoles;
};

// check if user has a given role 
const userHasRole = async (userId: string, role: string): Promise<boolean> => {
  if (!userId || !role) throw new Error('Missing required field');

  const userRoles = await getUserRoles(userId);
  if (userRoles.includes(role)) return true;
  return false;
};

// get user permissions service
const getUserPermissions = async (userId: string): Promise<string[]> => {
  if (!userId) throw new Error('Missing user ID');

  // Check if user exists
  const user = await User.findOne({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  const userRoleIds = await UserRole.findAll({ where: { userId } });
  const roleIds: string[] = userRoleIds.map((userRoleId) => userRoleId.roleId);

  const userPermissions: string[] = [];

  for (const roleId of roleIds) {
    const rolePermissions = await RolePermission.findAll({ where: { roleId } });
    const permissionIds = rolePermissions.map((rolePermission) => rolePermission.permissionId);

    for (const permissionId of permissionIds) {
      const permission = await Permission.findOne({ where: { id: permissionId } });
      if (permission) userPermissions.push(permission.permission);
    }
  }

  return userPermissions;
};

// check if user has a given permission
const userHasPermissions = async (userId: string, permission: string): Promise<boolean> => {
  if (!userId || !permission) throw new Error('Missing required field');

  const userPermissions = await getUserPermissions(userId);
  if (userPermissions.includes(permission)) return true;
  return false;
};

export { getUserRoles, userHasRole, getUserPermissions, userHasPermissions };
