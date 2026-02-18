import Permission from '../models/Permission';

const getAllPermission = async (): Promise<string[]> => {
  const getPermissions = await Permission.findAll();
  const permissions = getPermissions.map((permission) => permission.permission);

  return permissions;
};

const getPermissionById = async (permissionId: string) => {
  const permission = await Permission.findOne({ where: { id: permissionId } });
  return permission?.permission;
};

const createPermission = async (permission: string) => {
  await Permission.create({ permission });
};

const deletePermission = async (permissionId: string) => {
  await Permission.destroy({ where: { id: permissionId } });
};

export { getAllPermission, getPermissionById, createPermission, deletePermission };
