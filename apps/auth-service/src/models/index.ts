import { User } from '@talentsync/models';
import RefreshToken from './RefreshToken';

User.hasMany(RefreshToken, { foreignKey: 'userId' });
RefreshToken.belongsTo(User, { foreignKey: 'userId' });

export { User, RefreshToken };
