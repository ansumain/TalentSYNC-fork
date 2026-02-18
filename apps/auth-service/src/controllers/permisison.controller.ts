import { Request, Response } from 'express';
import {
  getAllPermission,
  createPermission,
  deletePermission,
} from '../services/permission.service';
import { getUserPermissions } from '../services/rbac.service';
import { getRolePermissions } from '../services/role.service';

// [admin]
export class PermissionController {
  static async getAllPermissions(req: Request, res: Response) {
    try {
      const permisisons = await getAllPermission();

      res.status(200).json({
        message: 'Permissions fetched sucessfully',
        permisisons,
      });
    } catch (error) {
      console.log('some error occured', error);
    }
  }

  static async getPermissionByUserId(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const userPermissions = await getUserPermissions(String(userId));

      res.status(200).json({
        message: 'User Permissions fetched sucessfully',
        userPermissions,
      });
    } catch (error) {
      console.log('some error occured', error);
    }
  }

  static async getPermissionByRoleId(req: Request, res: Response) {
    try {
      const roleId = req.params.roleId;
      const rolePermissions = await getRolePermissions(String(roleId));

      res.status(200).json({
        message: 'Role Permissions fetched sucessfully',
        rolePermissions,
      });
    } catch (error) {
      console.log('some error occured', error);
    }
  }

  static async createPermission(req: Request, res: Response) {
    try {
      const { permission } = req.body;
      const newPermissionCreated = await createPermission(permission);

      res.status(200).json({
        message: 'Permission created successfully',
        newPermissionCreated,
      });
    } catch (error) {
      console.log('some error occured', error);
    }
  }

  static async deletePermission(req: Request, res: Response) {
    try {
      const permissionId = req.params.permissionId;

      const permissionDelete = await deletePermission(String(permissionId));

      res.status(200).json({
        message: 'Permission deleted sucessfully',
        permissionDelete,
      });
    } catch (error) {
      console.log('some error occured', error);
    }
  }
}
