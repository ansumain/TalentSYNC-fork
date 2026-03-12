import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@talentsync/config';

interface UserSkillAttributes {
    userId: string;
    skillId: string;
}

class UserSkill extends Model<UserSkillAttributes>
    implements UserSkillAttributes {
    declare userId: string;
    declare skillId: string;
}

UserSkill.init(
    {
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            references: {
                model: { tableName: 'users', schema: 'auth' },
                key: 'id',
            },
        },
        skillId: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            references: {
                model: { tableName: 'skills', schema: 'management' },
                key: 'skillId',
            },
        }
    },
    {
        sequelize,
        tableName: 'user_skills',
        schema: 'resume',
        timestamps: true,
    }
);

export default UserSkill;
