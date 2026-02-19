import { Request, Response } from 'express';
import { assignRoleToUser, revokeRoleFromUser } from '../services/userRole.service';

export class UserRoleController {
  static async assignRoleToUser(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params || !req.params.userId) throw new Error('Missing user ID');
      if (!req.body || !req.body.roleId) throw new Error('Missing role ID');
      const userId = req.params.userId;
      const roleId = req.body.roleId;

      const roleAssigned = await assignRoleToUser(String(userId), roleId);

      res.status(201).json({
        message: 'Role assigned successfully',
        roleAssigned,
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
      if (errorMessage.includes('User not found') || errorMessage.includes('Role not found')) {
        res.status(404).json({ error: errorMessage });
        return;
      }

      // 409 - Conflict (duplicate)
      if (errorMessage.includes('Role already assigned to user')) {
        res.status(409).json({ error: errorMessage });
        return;
      }

      // 500 - Unexpected errors
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async revokeRoleFromUser(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params || !req.params.userId) throw new Error('Missing user ID');
      if (!req.params || !req.params.roleId) throw new Error('Missing role ID');
      const userId = req.params.userId;
      const roleId = req.params.roleId;

      const roleRevoked = await revokeRoleFromUser(String(userId), String(roleId));

      res.status(200).json({
        message: 'Role revoked successfully',
        roleRevoked,
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
      if (errorMessage.includes('Role assignment not found')) {
        res.status(404).json({ error: errorMessage });
        return;
      }

      // 500 - Unexpected errors
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
