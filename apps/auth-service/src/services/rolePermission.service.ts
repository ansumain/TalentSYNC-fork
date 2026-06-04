import RolePermission from '../models/RolePermission';
import Role from '../models/Role';
import Permission from '../models/Permission';
import { badRequestError, conflictError, notFoundError } from '@talentsync/types';

// assign permission to role service
const assignPermissionToRole = async (
  roleId: string,
  permissionId: string
): Promise<{ message: string }> => {
  if (!roleId || !permissionId) throw badRequestError('Missing required field', 'MISSING_REQUIRED_FIELD');

  // Check if role exists
  const role = await Role.findOne({ where: { id: roleId } });
  if (!role) throw notFoundError('Role not found', 'ROLE_NOT_FOUND');

  // Check if permission exists
  const permission = await Permission.findOne({ where: { id: permissionId } });
  if (!permission) throw notFoundError('Permission not found', 'PERMISSION_NOT_FOUND');

  // Check if assignment already exists
  const existingAssignment = await RolePermission.findOne({ where: { roleId, permissionId } });
  if (existingAssignment) {
    throw conflictError('Permission already assigned to role', 'PERMISSION_ALREADY_ASSIGNED');
  }

  await RolePermission.create({ roleId, permissionId });
  return { message: 'Assign Permission to Role, successful' };
};

// revoke permission from role service
const revokePermissionFromRole = async (
  roleId: string,
  permissionId: string
): Promise<{ message: string }> => {
  if (!roleId || !permissionId) throw badRequestError('Missing required field', 'MISSING_REQUIRED_FIELD');

  // Check if assignment exists
  const assignment = await RolePermission.findOne({ where: { roleId, permissionId } });
  if (!assignment) {
    throw notFoundError('Permission assignment not found', 'PERMISSION_ASSIGNMENT_NOT_FOUND');
  }

  await RolePermission.destroy({ where: { roleId, permissionId } });
  return { message: 'Revoke Permission from Role, successful' };
};

export { assignPermissionToRole, revokePermissionFromRole };
