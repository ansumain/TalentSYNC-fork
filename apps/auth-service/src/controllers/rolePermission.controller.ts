import { Request, Response } from 'express';
import { badRequestError } from '@talentsync/types';
import {
  assignPermissionToRole,
  revokePermissionFromRole,
} from '../services/rolePermission.service';

export class RolePermissionController {
  // assign permission to a role
  static async assignPermissionToRole(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params || !req.params.roleId) throw badRequestError('Missing role ID', 'ROLE_ID_MISSING');
      if (!req.body || !req.body.permissionId) {
        throw badRequestError('Missing permission ID', 'PERMISSION_ID_MISSING');
      }
      const roleId = req.params.roleId;
      const permissionId = req.body.permissionId;

      const permissionAssigned = await assignPermissionToRole(String(roleId), permissionId);

      res.status(201).json({
        message: 'Permission assigned successfully',
        permissionAssigned,
      });
    } catch (error) {
      throw error;
    }
  }

  // revoke permission from a role
  static async revokePermissionFromRole(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params || !req.params.roleId) throw badRequestError('Missing role ID', 'ROLE_ID_MISSING');
      if (!req.params || !req.params.permissionId) {
        throw badRequestError('Missing permission ID', 'PERMISSION_ID_MISSING');
      }
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
    } catch (error) {
      throw error;
    }
  }
}
