import Permission from '../models/Permission';
import { badRequestError, conflictError, notFoundError } from '@talentsync/types';

// get all permissions service
const getAllPermission = async (): Promise<string[]> => {
  const getPermissions = await Permission.findAll();
  const permissions = getPermissions.map((permission) => permission.permission);

  return permissions;
};

// get permission by id service
const getPermissionById = async (permissionId: string) => {
  if (!permissionId) throw badRequestError('Missing permission ID', 'PERMISSION_ID_MISSING');

  const permission = await Permission.findOne({ where: { id: permissionId } });
  if (!permission) throw notFoundError('Permission not found', 'PERMISSION_NOT_FOUND');

  return permission.permission;
};

// create permission service
const createPermission = async (permission: string) => {
  if (!permission) throw badRequestError('Missing required field', 'MISSING_REQUIRED_FIELD');

  // Check if permission already exists
  const existingPermission = await Permission.findOne({ where: { permission } });
  if (existingPermission) {
    throw conflictError('Permission already exists', 'PERMISSION_ALREADY_EXISTS');
  }

  await Permission.create({ permission });
};

// delete permission service
const deletePermission = async (permissionId: string) => {
  if (!permissionId) throw badRequestError('Missing permission ID', 'PERMISSION_ID_MISSING');

  const permission = await Permission.findOne({ where: { id: permissionId } });
  if (!permission) throw notFoundError('Permission not found', 'PERMISSION_NOT_FOUND');

  await Permission.destroy({ where: { id: permissionId } });
};

export { getAllPermission, getPermissionById, createPermission, deletePermission };
