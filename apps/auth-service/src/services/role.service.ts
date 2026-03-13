import Role from '../models/Role';
import RolePermission from '../models/RolePermission';
import Permission from '../models/Permission';

// gety all roles service
const getAllRoles = async (): Promise<string[]> => {
  const getRoles = await Role.findAll();
  const roles = getRoles.map((role) => role.role);
  return roles;
};

// get role by id service
const getRoleById = async (roleId: string) => {
  if (!roleId) throw new Error('Missing role ID');

  const getRole = await Role.findOne({ where: { id: roleId } });
  if (!getRole) throw new Error('Role not found');

  return getRole.role;
};

// get permissions of a particular role
const getRolePermissions = async (roleId: string): Promise<string[]> => {
  if (!roleId) throw new Error('Missing role ID');

  const role = await Role.findOne({ where: { id: roleId } });
  if (!role) throw new Error('Role not found');

  const rolePermissions = await RolePermission.findAll({ where: { roleId } });
  const permissionIds = rolePermissions.map((rolePermission) => rolePermission.permissionId);

  const permissions = [];
  for (const permissionId of permissionIds) {
    const permission = await Permission.findOne({ where: { id: permissionId } });
    if (permission) permissions.push(permission.permission);
  }

  return permissions;
};

// create role service
const createRole = async (role: string) => {
  if (!role) throw new Error('Missing required field');

  // Check if role already exists
  const existingRole = await Role.findOne({ where: { role } });
  if (existingRole) throw new Error('Role already exists');

  await Role.create({ role });
};

// delete role service
const deleteRole = async (roleId: string) => {
  if (!roleId) throw new Error('Missing role ID');

  const role = await Role.findOne({ where: { id: roleId } });
  if (!role) throw new Error('Role not found');

  await Role.destroy({ where: { id: roleId } });
};

export { getAllRoles, getRoleById, getRolePermissions, createRole, deleteRole };
