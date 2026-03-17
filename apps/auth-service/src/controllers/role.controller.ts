import { Request, Response } from 'express';
import { badRequestError } from '@talentsync/types';
import { createRole, deleteRole, getAllRoles } from '../services/role.service';
import { getUserRoles } from '../services/rbac.service';

// [admin]
export class RoleController {
  // get all roles available
  static async getAllRoles(_req: Request, res: Response): Promise<void> {
    try {
      const roles = await getAllRoles();

      res.status(200).json({
        message: 'Roles fetched sucessfully',
        roles,
      });
    } catch (error) {
      throw error;
    }
  }
  // get user's roles
  static async getRoleByUserId(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params || !req.params.userId) throw badRequestError('Missing user ID', 'USER_ID_MISSING');
      const userId = req.params.userId;
      const roles = await getUserRoles(String(userId));

      res.status(200).json({
        message: 'Role fetched sucessfully',
        roles,
      });
    } catch (error) {
      throw error;
    }
  }

  // create a role
  static async createRole(req: Request, res: Response): Promise<void> {
    try {
      if (!req.body || !req.body.role) {
        throw badRequestError('Missing required field', 'MISSING_REQUIRED_FIELD');
      }
      const { role } = req.body;
      await createRole(role);

      res.status(201).json({
        message: 'Role created successfully',
      });
    } catch (error) {
      throw error;
    }
  }

  // delete a role
  static async deleteRole(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params || !req.params.roleId) throw badRequestError('Missing role ID', 'ROLE_ID_MISSING');
      const roleId = req.params.roleId;
      await deleteRole(String(roleId));

      res.status(200).json({
        message: 'Role deleted sucessfully',
      });
    } catch (error) {
      throw error;
    }
  }
}
