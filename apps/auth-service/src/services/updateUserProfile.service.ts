import { Op } from 'sequelize';
import { User } from '@talentsync/models';
import { UpdateUserProfileInput } from '../types/UpdateUserProfileInput';
import { UpdateUserProfileOutput } from '../types/UpdateUserProfileOutput';

// update user profile service
export const updateUserProfile = async (
  toUpdate: Partial<UpdateUserProfileInput>
): Promise<UpdateUserProfileOutput> => {
  const { userId, ...fieldsToUpdate } = toUpdate;
  // check if phone already exists
  if (fieldsToUpdate.phone) {
    const checkPhone = await User.findOne({
      where: { phone: fieldsToUpdate.phone, id: { [Op.ne]: userId } },
    });
    if (checkPhone) throw new Error('Phone exists');
  }

  // check if email already exists
  if (fieldsToUpdate.email) {
    const checkEmail = await User.findOne({
      where: { email: fieldsToUpdate.email, id: { [Op.ne]: userId } },
    });
    if (checkEmail) throw new Error('Email exists');
  }

  await User.update({ ...fieldsToUpdate }, { where: { id: userId } });

  return { message: 'User profile updated' };
};
