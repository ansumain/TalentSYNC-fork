import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/sequelize';

interface UserAttributes {
  id: string;
  name: string;
  email: string;
  phone: string;
  hashedPassword: string;
}

type UserCreationAttributes = Optional<UserAttributes, 'id'>;

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: string;
  declare name: string;
  declare email: string;
  declare phone: string;
  declare hashedPassword: string;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },
    hashedPassword: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'users',
    schema: 'auth',
    timestamps: true,
  }
);

export default User;
