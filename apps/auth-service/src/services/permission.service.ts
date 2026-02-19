import Permission from '../models/Permission';

const getAllPermission = async (): Promise<string[]> => {
  const getPermissions = await Permission.findAll();
  const permissions = getPermissions.map((permission) => permission.permission);

  return permissions;
};

const getPermissionById = async (permissionId: string) => {
  if (!permissionId) throw new Error('Missing permission ID');

  const permission = await Permission.findOne({ where: { id: permissionId } });
  if (!permission) throw new Error('Permission not found');

  return permission.permission;
};

const createPermission = async (permission: string) => {
  if (!permission) throw new Error('Missing required field');

  // Check if permission already exists
  const existingPermission = await Permission.findOne({ where: { permission } });
  if (existingPermission) throw new Error('Permission already exists');

  await Permission.create({ permission });
};

const deletePermission = async (permissionId: string) => {
  if (!permissionId) throw new Error('Missing permission ID');

  const permission = await Permission.findOne({ where: { id: permissionId } });
  if (!permission) throw new Error('Permission not found');

  await Permission.destroy({ where: { id: permissionId } });
};

export { getAllPermission, getPermissionById, createPermission, deletePermission };
