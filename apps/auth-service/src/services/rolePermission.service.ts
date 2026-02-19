import RolePermission from '../models/RolePermission';
import Role from '../models/Role';
import Permission from '../models/Permission';

const assignPermissionToRole = async (
  roleId: string,
  permissionId: string
): Promise<{ message: string }> => {
  if (!roleId || !permissionId) throw new Error('Missing required field');

  // Check if role exists
  const role = await Role.findOne({ where: { id: roleId } });
  if (!role) throw new Error('Role not found');

  // Check if permission exists
  const permission = await Permission.findOne({ where: { id: permissionId } });
  if (!permission) throw new Error('Permission not found');

  // Check if assignment already exists
  const existingAssignment = await RolePermission.findOne({ where: { roleId, permissionId } });
  if (existingAssignment) throw new Error('Permission already assigned to role');

  await RolePermission.create({ roleId, permissionId });
  return { message: 'Assign Permission to Role, successful' };
};

const revokePermissionFromRole = async (
  roleId: string,
  permissionId: string
): Promise<{ message: string }> => {
  if (!roleId || !permissionId) throw new Error('Missing required field');

  // Check if assignment exists
  const assignment = await RolePermission.findOne({ where: { roleId, permissionId } });
  if (!assignment) throw new Error('Permission assignment not found');

  await RolePermission.destroy({ where: { roleId, permissionId } });
  return { message: 'Revoke Permission from Role, successful' };
};

export { assignPermissionToRole, revokePermissionFromRole };
