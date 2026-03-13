import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '@talentsync/config';

interface SkillAttributes {
    skillId: string;
    skillName: string;
}

type SkillCreationAttributes = Optional<SkillAttributes, 'skillId'>;

class Skill extends Model<SkillAttributes, SkillCreationAttributes>
    implements SkillAttributes {
    declare skillId: string;
    declare skillName: string;
}

Skill.init(
    {
        skillId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        skillName: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
    },
    {
        sequelize,
        tableName: 'skills',
        schema: 'management',
        timestamps: true,
    }
);

export default Skill;
