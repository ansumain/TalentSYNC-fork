import bcrypt from 'bcryptjs';
import User from '../models/User';
import { RegisterUserInput } from '../types/RegisterUserInput';
import { RegisterUserOutput } from '../types/RegisterUserOutput';
import { Op } from 'sequelize';

export const registerUser = async ({
  name,
  email,
  phone,
  password,
}: RegisterUserInput): Promise<RegisterUserOutput> => {
  // required fields must not be null
  if (!name || !email || !phone || !password) throw new Error('Missing required field');

  // check the name length (min: 3, max: 25)
  if (name.length < 3) throw new Error('Name too short');
  if (name.length > 25) throw new Error('Name too long');

  // check if the email/phone is already associated with any existing user
  const checkExistingUser = await User.findOne({
    where: {
      [Op.or]: [{ email }, { phone }],
    },
  });
  if (checkExistingUser) {
    if (checkExistingUser.email === email) throw new Error('Email exists');
    if (checkExistingUser.phone === phone) throw new Error('Phone exists');
  }

  // check pasword length, min: 6
  if (password.length < 6) throw new Error('Weak password');

  // hash the password to store in DB
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    phone,
    hashedPassword,
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    hashedPassword: user.hashedPassword,
  };
};
