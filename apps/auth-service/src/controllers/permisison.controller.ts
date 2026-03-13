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
  // get all permissions
  static async getAllPermissions(req: Request, res: Response): Promise<void> {
    try {
      const permisisons = await getAllPermission();

      res.status(200).json({
        message: 'Permissions fetched sucessfully',
        permisisons,
      });
    } catch {
      // 500 - Unexpected errors
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  // get permissions by userID
  static async getPermissionByUserId(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params || !req.params.userId) throw new Error('Missing user ID');
      const userId = req.params.userId;
      const userPermissions = await getUserPermissions(String(userId));

      res.status(200).json({
        message: 'User Permissions fetched sucessfully',
        userPermissions,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Internal server error';

      // 400 - Validation errors
      if (errorMessage.includes('Missing user ID')) {
        res.status(400).json({ error: errorMessage });
        return;
      }

      // 404 - Not found
      if (errorMessage.includes('User not found')) {
        res.status(404).json({ error: errorMessage });
        return;
      }

      // 500 - Unexpected errors
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  // get permissions by roleID
  static async getPermissionByRoleId(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params || !req.params.roleId) throw new Error('Missing role ID');
      const roleId = req.params.roleId;
      const rolePermissions = await getRolePermissions(String(roleId));

      res.status(200).json({
        message: 'Role Permissions fetched sucessfully',
        rolePermissions,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Internal server error';

      // 400 - Validation errors
      if (errorMessage.includes('Missing role ID')) {
        res.status(400).json({ error: errorMessage });
        return;
      }

      // 404 - Not found
      if (errorMessage.includes('Role not found')) {
        res.status(404).json({ error: errorMessage });
        return;
      }

      // 500 - Unexpected errors
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  // create a new permission
  static async createPermission(req: Request, res: Response): Promise<void> {
    try {
      if (!req.body || !req.body.permission) throw new Error('Missing required field');
      const { permission } = req.body;
      await createPermission(permission);

      res.status(201).json({
        message: 'Permission created successfully',
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Internal server error';

      // 400 - Validation errors
      if (errorMessage.includes('Missing required field')) {
        res.status(400).json({ error: errorMessage });
        return;
      }

      // 409 - Conflict (duplicate)
      if (errorMessage.includes('Permission already exists')) {
        res.status(409).json({ error: errorMessage });
        return;
      }

      // 500 - Unexpected errors
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  // delete a permission
  static async deletePermission(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params || !req.params.permissionId) throw new Error('Missing permission ID');
      const permissionId = req.params.permissionId;
      await deletePermission(String(permissionId));

      res.status(200).json({
        message: 'Permission deleted sucessfully',
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Internal server error';

      // 400 - Validation errors
      if (errorMessage.includes('Missing permission ID')) {
        res.status(400).json({ error: errorMessage });
        return;
      }

      // 404 - Not found
      if (errorMessage.includes('Permission not found')) {
        res.status(404).json({ error: errorMessage });
        return;
      }

      // 500 - Unexpected errors
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
