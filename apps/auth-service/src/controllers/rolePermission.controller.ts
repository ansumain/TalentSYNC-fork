import { Request, Response } from 'express';
import {
  assignPermissionToRole,
  revokePermissionFromRole,
} from '../services/rolePermission.service';

export class RolePermissionController {
  // assign permission to a role
  static async assignPermissionToRole(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params || !req.params.roleId) throw new Error('Missing role ID');
      if (!req.body || !req.body.permissionId) throw new Error('Missing permission ID');
      const roleId = req.params.roleId;
      const permissionId = req.body.permissionId;

      const permissionAssigned = await assignPermissionToRole(String(roleId), permissionId);

      res.status(201).json({
        message: 'Permission assigned successfully',
        permissionAssigned,
      });
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      const errorMessage = error.message || 'Internal server error';

      // 400 - Validation errors
      if (errorMessage.includes('Missing required field')) {
        res.status(400).json({ error: errorMessage });
        return;
      }

      // 404 - Not found
      if (
        errorMessage.includes('Role not found') ||
        errorMessage.includes('Permission not found')
      ) {
        res.status(404).json({ error: errorMessage });
        return;
      }

      // 409 - Conflict (duplicate)
      if (errorMessage.includes('Permission already assigned to role')) {
        res.status(409).json({ error: errorMessage });
        return;
      }

      // 500 - Unexpected errors
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // revoke permission from a role
  static async revokePermissionFromRole(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params || !req.params.roleId) throw new Error('Missing role ID');
      if (!req.params || !req.params.permissionId) throw new Error('Missing permission ID');
      const roleId = req.params.roleId;
      const permissionId = req.params.permissionId;

      const permissionRevoked = await revokePermissionFromRole(
        String(roleId),
        String(permissionId)
      );

      res.status(200).json({
        message: 'Permission revoked successfully',
        permissionRevoked,
      });
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      const errorMessage = error.message || 'Internal server error';

      // 400 - Validation errors
      if (errorMessage.includes('Missing required field')) {
        res.status(400).json({ error: errorMessage });
        return;
      }

      // 404 - Not found
      if (errorMessage.includes('Permission assignment not found')) {
        res.status(404).json({ error: errorMessage });
        return;
      }

      // 500 - Unexpected errors
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
