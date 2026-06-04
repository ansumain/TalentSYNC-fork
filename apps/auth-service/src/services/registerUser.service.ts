import bcrypt from 'bcryptjs';
import { User } from '@talentsync/models';
import { RegisterUserInput } from '../types/RegisterUserInput';
import { RegisterUserOutput } from '../types/RegisterUserOutput';
import { Op } from 'sequelize';
import {
  badRequestError,
  conflictError,
  internalServerError,
} from '@talentsync/types';
import Role from '../models/Role';
import UserRole from '../models/UserRole';

// register user service
export const registerUser = async ({
  name,
  email,
  phone,
  password,
}: RegisterUserInput): Promise<RegisterUserOutput> => {
  // required fields must not be null
  if (!name || !email || !phone || !password) {
    throw badRequestError('Missing required field', 'MISSING_REQUIRED_FIELD');
  }

  // check the name length (min: 3, max: 25)
  if (name.length < 3) throw badRequestError('Name too short', 'NAME_TOO_SHORT');
  if (name.length > 25) throw badRequestError('Name too long', 'NAME_TOO_LONG');

  // check if the email/phone is already associated with any existing user
  const checkExistingUser = await User.findOne({
    where: {
      [Op.or]: [{ email }, { phone }],
    },
  });
  if (checkExistingUser) {
    if (checkExistingUser.email === email) throw conflictError('Email exists', 'EMAIL_EXISTS');
    if (checkExistingUser.phone === phone) throw conflictError('Phone exists', 'PHONE_EXISTS');
  }

  // check pasword length, min: 6
  if (password.length < 6) throw badRequestError('Weak password', 'WEAK_PASSWORD');

  // hash the password to store in DB
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    phone,
    hashedPassword,
  });

  const candidateRole = await Role.findOne({ where: { role: 'candidate' } });
  if (!candidateRole) {
    throw internalServerError('System configuration error', 'DEFAULT_ROLE_NOT_FOUND');
  }

  await UserRole.create({
    userId: user.id,
    roleId: candidateRole.id,
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    hashedPassword: user.hashedPassword,
  };
};
