import RolePermission from '../models/RolePermission';

const assignPermissionToRole = async (
  roleId: string,
  permissionId: string
): Promise<{ message: string }> => {
  await RolePermission.create({ roleId, permissionId });
  return { message: 'Assign Permission to Role, successful' };
};

const revokePermissionFromRole = async (
  roleId: string,
  permissionId: string
): Promise<{ message: string }> => {
  await RolePermission.destroy({ where: { roleId, permissionId } });
  return { message: 'Revoke Permission from Role, successful' };
};

export { assignPermissionToRole, revokePermissionFromRole };
