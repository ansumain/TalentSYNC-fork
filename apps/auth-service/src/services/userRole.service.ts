import UserRole from '../models/UserRole';

const assignRoleToUser = async (userId: string, roleId: string): Promise<{ message: string }> => {
  await UserRole.create({ userId, roleId });
  return { message: 'Assign Role to User, successful' };
};

const revokeRoleFromUser = async (userId: string, roleId: string): Promise<{ message: string }> => {
  await UserRole.destroy({ where: { userId, roleId } });
  return { message: 'Revoke Role from User, successful' };
};

export { assignRoleToUser, revokeRoleFromUser };
