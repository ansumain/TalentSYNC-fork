import { Request, Response } from 'express';
import { assignRoleToUser, revokeRoleFromUser } from '../services/userRole.service';

export class UserRoleController {
  static async assignRoleToUser(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const roleId = req.body.roleId;

      console.log('userId', userId);
      console.log('roleId', roleId);

      const roleAssigned = await assignRoleToUser(String(userId), roleId);

      res.status(201).json({
        message: 'Role assigned successfully',
        roleAssigned,
      });
    } catch (error) {
      console.log('some error occured', error);
    }
  }

  static async revokeRoleFromUser(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const roleId = req.params.roleId;

      const roleRevoked = await revokeRoleFromUser(String(userId), String(roleId));

      res.status(240).json({
        message: 'Role revoked successfully',
        roleRevoked,
      });
    } catch (error) {
      console.log('some error occured', error);
    }
  }
}
