import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/sequelize';

interface PasswordResetOtpAttributes {
  id: string;
  email: string;
  hashedOtp: string;
  expiresAt: Date;
}

type PasswordResetOtpCreationAttributes = Optional<PasswordResetOtpAttributes, 'id'>;

class PasswordResetOtp
  extends Model<PasswordResetOtpAttributes, PasswordResetOtpCreationAttributes>
  implements PasswordResetOtpAttributes
{
  declare id: string;
  declare email: string;
  declare hashedOtp: string;
  declare expiresAt: Date;
}

PasswordResetOtp.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    hashedOtp: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'password_reset_otps',
    schema: 'auth',
    timestamps: true,
  }
);

export default PasswordResetOtp;
