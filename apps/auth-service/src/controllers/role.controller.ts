import { Request, Response } from 'express';
import { createRole, deleteRole, getAllRoles } from '../services/role.service';
import { getUserRoles } from '../services/rbac.service';

// [admin]
export class RoleController {
  static async getAllRoles(req: Request, res: Response) {
    try {
      const roles = await getAllRoles();

      res.status(200).json({
        message: 'Roles fetched sucessfully',
        roles,
      });
    } catch (error) {
      console.log('some error occured', error);
    }
  }

  static async getRoleByUserId(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const roles = await getUserRoles(String(userId));

      res.status(200).json({
        message: 'Role fetched sucessfully',
        roles,
      });
    } catch (error) {
      console.log('some error occured', error);
    }
  }

  static async createRole(req: Request, res: Response) {
    try {
      const { role } = req.body;
      const newRoleCreated = await createRole(role);

      res.status(200).json({
        message: 'Role created successfully',
        newRoleCreated,
      });
    } catch (error) {
      console.log('some error occured', error);
    }
  }

  static async deleteRole(req: Request, res: Response) {
    try {
      const roleId = req.params.roleId;

      const roleDelete = await deleteRole(String(roleId));

      res.status(200).json({
        message: 'Role deleted sucessfully',
        roleDelete,
      });
    } catch (error) {
      console.log('some error occured', error);
    }
  }
}
