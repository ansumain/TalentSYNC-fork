import Permission from '../models/Permission';
import Role from '../models/Role';
import RolePermission from '../models/RolePermission';
import UserRole from '../models/UserRole';

const getUserRoles = async (userId: string): Promise<string[]> => {
  const userRoleIds = await UserRole.findAll({ where: { userId } });
  const roleIds: string[] = userRoleIds.map((userRoleId) => userRoleId.roleId);

  const userRoles: string[] = [];

  for (const roldId of roleIds) {
    const role = await Role.findOne({ where: { id: roldId } });
    if (role) userRoles.push(role.role);
  }
  return userRoles;
};

const userHasRole = async (userId: string, role: string): Promise<boolean> => {
  const userRoles = await getUserRoles(userId);
  if (userRoles.includes(role)) return true;
  return false;
};

const getUserPermissions = async (userId: string): Promise<string[]> => {
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

const userHasPermissions = async (userId: string, permission: string): Promise<boolean> => {
  const userPermissions = await getUserPermissions(userId);
  if (userPermissions.includes(permission)) return true;
  return false;
};

export { getUserRoles, userHasRole, getUserPermissions, userHasPermissions };
