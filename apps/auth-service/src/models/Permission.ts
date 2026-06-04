import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '@talentsync/config';

interface PermissionAttributes {
  id: string;
  permission: string;
}

type PermissionCreationAttributes = Optional<PermissionAttributes, 'id'>;

class Permission
  extends Model<PermissionAttributes, PermissionCreationAttributes>
  implements PermissionAttributes
{
  declare id: string;
  declare permission: string;
}

Permission.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    permission: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: 'permissions',
    schema: 'auth',
    timestamps: true,
  }
);

export default Permission;
