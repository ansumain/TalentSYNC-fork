import { Request, Response } from 'express';
import { createRole, deleteRole, getAllRoles } from '../services/role.service';
import { getUserRoles } from '../services/rbac.service';

// [admin]
export class RoleController {
  // get all roles available
  static async getAllRoles(req: Request, res: Response): Promise<void> {
    try {
      const roles = await getAllRoles();

      res.status(200).json({
        message: 'Roles fetched sucessfully',
        roles,
      });
    } catch {
      // 500 - Unexpected errors
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  // get user's roles
  static async getRoleByUserId(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params || !req.params.userId) throw new Error('Missing user ID');
      const userId = req.params.userId;
      const roles = await getUserRoles(String(userId));

      res.status(200).json({
        message: 'Role fetched sucessfully',
        roles,
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

  // create a role
  static async createRole(req: Request, res: Response): Promise<void> {
    try {
      if (!req.body || !req.body.role) throw new Error('Missing required field');
      const { role } = req.body;
      await createRole(role);

      res.status(201).json({
        message: 'Role created successfully',
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Internal server error';

      // 400 - Validation errors
      if (errorMessage.includes('Missing required field')) {
        res.status(400).json({ error: errorMessage });
        return;
      }

      // 409 - Conflict (duplicate)
      if (errorMessage.includes('Role already exists')) {
        res.status(409).json({ error: errorMessage });
        return;
      }

      // 500 - Unexpected errors
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // delete a role
  static async deleteRole(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params || !req.params.roleId) throw new Error('Missing role ID');
      const roleId = req.params.roleId;
      await deleteRole(String(roleId));

      res.status(200).json({
        message: 'Role deleted sucessfully',
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
}
