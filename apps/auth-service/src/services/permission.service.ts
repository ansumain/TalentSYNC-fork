import Permission from '../models/Permission';

// get all permissions service
const getAllPermission = async (): Promise<string[]> => {
  const getPermissions = await Permission.findAll();
  const permissions = getPermissions.map((permission) => permission.permission);

  return permissions;
};

// get permission by id service
const getPermissionById = async (permissionId: string) => {
  if (!permissionId) throw new Error('Missing permission ID');

  const permission = await Permission.findOne({ where: { id: permissionId } });
  if (!permission) throw new Error('Permission not found');

  return permission.permission;
};

// create permission service
const createPermission = async (permission: string) => {
  if (!permission) throw new Error('Missing required field');

  // Check if permission already exists
  const existingPermission = await Permission.findOne({ where: { permission } });
  if (existingPermission) throw new Error('Permission already exists');

  await Permission.create({ permission });
};

// delete permission service
const deletePermission = async (permissionId: string) => {
  if (!permissionId) throw new Error('Missing permission ID');

  const permission = await Permission.findOne({ where: { id: permissionId } });
  if (!permission) throw new Error('Permission not found');

  await Permission.destroy({ where: { id: permissionId } });
};

export { getAllPermission, getPermissionById, createPermission, deletePermission };
