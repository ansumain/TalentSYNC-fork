import Role from '../models/Role';
import RolePermission from '../models/RolePermission';
import Permission from '../models/Permission';
import { badRequestError, conflictError, notFoundError } from '@talentsync/types';

// gety all roles service
const getAllRoles = async (): Promise<string[]> => {
  const getRoles = await Role.findAll();
  const roles = getRoles.map((role) => role.role);
  return roles;
};

// get role by id service
const getRoleById = async (roleId: string) => {
  if (!roleId) throw badRequestError('Missing role ID', 'ROLE_ID_MISSING');

  const getRole = await Role.findOne({ where: { id: roleId } });
  if (!getRole) throw notFoundError('Role not found', 'ROLE_NOT_FOUND');

  return getRole.role;
};

// get permissions of a particular role
const getRolePermissions = async (roleId: string): Promise<string[]> => {
  if (!roleId) throw badRequestError('Missing role ID', 'ROLE_ID_MISSING');

  const role = await Role.findOne({ where: { id: roleId } });
  if (!role) throw notFoundError('Role not found', 'ROLE_NOT_FOUND');

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
  if (!role) throw badRequestError('Missing required field', 'MISSING_REQUIRED_FIELD');

  // Check if role already exists
  const existingRole = await Role.findOne({ where: { role } });
  if (existingRole) throw conflictError('Role already exists', 'ROLE_ALREADY_EXISTS');

  await Role.create({ role });
};

// delete role service
const deleteRole = async (roleId: string) => {
  if (!roleId) throw badRequestError('Missing role ID', 'ROLE_ID_MISSING');

  const role = await Role.findOne({ where: { id: roleId } });
  if (!role) throw notFoundError('Role not found', 'ROLE_NOT_FOUND');

  await Role.destroy({ where: { id: roleId } });
};

export { getAllRoles, getRoleById, getRolePermissions, createRole, deleteRole };
