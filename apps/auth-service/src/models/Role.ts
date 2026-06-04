import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '@talentsync/config';

interface RoleAttributes {
  id: string;
  role: string;
}

type RoleCreationAttributes = Optional<RoleAttributes, 'id'>;

class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
  declare id: string;
  declare role: string;
}

Role.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: 'roles',
    schema: 'auth',
    timestamps: true,
  }
);

export default Role;
