import { Request, Response } from 'express';
import {
  assignPermissionToRole,
  revokePermissionFromRole,
} from '../services/rolePermission.service';

export class RolePermissionController {
  static async assignPermissionToRole(req: Request, res: Response) {
    try {
      const roleId = req.params.roleId;
      const permissionId = req.body.permissionId;

      const permissionAssigned = await assignPermissionToRole(String(roleId), permissionId);

      res.status(201).json({
        message: 'Permission assigned successfully',
        permissionAssigned,
      });
    } catch (error) {
      console.log('some error occured', error);
    }
  }

  static async revokePermissionFromRole(req: Request, res: Response) {
    try {
      const roleId = req.params.roleId;
      const permissionId = req.params.permissionId;

      const permissionRevoked = await revokePermissionFromRole(
        String(roleId),
        String(permissionId)
      );

      res.status(240).json({
        message: 'Role revoked successfully',
        permissionRevoked,
      });
    } catch (error) {
      console.log('some error occured', error);
    }
  }
}
