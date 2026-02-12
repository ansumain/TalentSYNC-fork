import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/sequelize';
import User from './User';

interface RefreshTokenAttributes {
  id: string;
  userId: string;
  hashedToken: string;
  expiresAt: Date;
  revoked?: boolean;
}

type RefreshTokenCreationAttributes = Optional<RefreshTokenAttributes, 'id' | 'revoked'>;

class RefreshToken
  extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes>
  implements RefreshTokenAttributes
{
  public id!: string;
  public userId!: string;
  public hashedToken!: string;
  public expiresAt!: Date;
  public revoked!: boolean;
}

RefreshToken.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    hashedToken: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    revoked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'refresh_tokens',
    schema: 'auth',
    timestamps: true,
  }
);

// Associations
User.hasMany(RefreshToken, { foreignKey: 'userId' });
RefreshToken.belongsTo(User, { foreignKey: 'userId' });

export default RefreshToken;
