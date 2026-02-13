import User from './User';
import RefreshToken from './RefreshToken';

User.hasMany(RefreshToken, { foreignKey: 'userId' });
RefreshToken.belongsTo(User, { foreignKey: 'userId' });

export { User, RefreshToken };
