import Role from '../models/Role';
import RolePermission from '../models/RolePermission';
import Permission from '../models/Permission';

const getAllRoles = async (): Promise<string[]> => {
  const getRoles = await Role.findAll();
  const roles = getRoles.map((role) => role.role);
  return roles;
};

const getRoleById = async (roleId: string) => {
  const getRole = await Role.findOne({ where: { id: roleId } });
  return getRole!.role;
};

const getRolePermissions = async (roleId: string): Promise<string[]> => {
  const rolePermissions = await RolePermission.findAll({ where: { roleId } });
  const permissionIds = rolePermissions.map((rolePermission) => rolePermission.permissionId);

  const permissions = [];
  for (const permissionId of permissionIds) {
    const permission = await Permission.findOne({ where: { id: permissionId } });
    if (permission) permissions.push(permission.permission);
  }

  return permissions;
};

const createRole = async (role: string) => {
  await Role.create({ role });
};

const deleteRole = async (roleId: string) => {
  await Role.destroy({ where: { id: roleId } });
};

export { getAllRoles, getRoleById, getRolePermissions, createRole, deleteRole };
