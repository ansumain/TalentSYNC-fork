import { Request, Response } from 'express';
import { badRequestError } from '@talentsync/types';
import {
  getAllPermission,
  createPermission,
  deletePermission,
} from '../services/permission.service';
import { getUserPermissions } from '../services/rbac.service';
import { getRolePermissions } from '../services/role.service';

// [admin]
export class PermissionController {
  // get all permissions
  static async getAllPermissions(_req: Request, res: Response): Promise<void> {
    try {
      const permisisons = await getAllPermission();

      res.status(200).json({
        message: 'Permissions fetched sucessfully',
        permisisons,
      });
    } catch (error) {
      throw error;
    }
  }

  // get permissions by userID
  static async getPermissionByUserId(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params || !req.params.userId) throw badRequestError('Missing user ID', 'USER_ID_MISSING');
      const userId = req.params.userId;
      const userPermissions = await getUserPermissions(String(userId));

      res.status(200).json({
        message: 'User Permissions fetched sucessfully',
        userPermissions,
      });
    } catch (error) {
      throw error;
    }
  }

  // get permissions by roleID
  static async getPermissionByRoleId(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params || !req.params.roleId) throw badRequestError('Missing role ID', 'ROLE_ID_MISSING');
      const roleId = req.params.roleId;
      const rolePermissions = await getRolePermissions(String(roleId));

      res.status(200).json({
        message: 'Role Permissions fetched sucessfully',
        rolePermissions,
      });
    } catch (error) {
      throw error;
    }
  }

  // create a new permission
  static async createPermission(req: Request, res: Response): Promise<void> {
    try {
      if (!req.body || !req.body.permission) {
        throw badRequestError('Missing required field', 'MISSING_REQUIRED_FIELD');
      }
      const { permission } = req.body;
      await createPermission(permission);

      res.status(201).json({
        message: 'Permission created successfully',
      });
    } catch (error) {
      throw error;
    }
  }

  // delete a permission
  static async deletePermission(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params || !req.params.permissionId) {
        throw badRequestError('Missing permission ID', 'PERMISSION_ID_MISSING');
      }
      const permissionId = req.params.permissionId;
      await deletePermission(String(permissionId));

      res.status(200).json({
        message: 'Permission deleted sucessfully',
      });
    } catch (error) {
      throw error;
    }
  }

}
