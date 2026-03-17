import { Request, Response } from 'express';
import { badRequestError } from '@talentsync/types';
import { assignRoleToUser, revokeRoleFromUser } from '../services/userRole.service';

export class UserRoleController {
  // assign role to user
  static async assignRoleToUser(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params || !req.params.userId) throw badRequestError('Missing user ID', 'USER_ID_MISSING');
      if (!req.body || !req.body.roleId) throw badRequestError('Missing role ID', 'ROLE_ID_MISSING');
      const userId = req.params.userId;
      const roleId = req.body.roleId;

      const roleAssigned = await assignRoleToUser(String(userId), roleId);

      res.status(201).json({
        message: 'Role assigned successfully',
        roleAssigned,
      });
    } catch (error) {
      throw error;
    }
  }

  // revoke role from user
  static async revokeRoleFromUser(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params || !req.params.userId) throw badRequestError('Missing user ID', 'USER_ID_MISSING');
      if (!req.params || !req.params.roleId) throw badRequestError('Missing role ID', 'ROLE_ID_MISSING');
      const userId = req.params.userId;
      const roleId = req.params.roleId;

      const roleRevoked = await revokeRoleFromUser(String(userId), String(roleId));

      res.status(200).json({
        message: 'Role revoked successfully',
        roleRevoked,
      });
    } catch (error) {
      throw error;
    }
  }
}
