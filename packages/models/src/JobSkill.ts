import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '@talentsync/config';
import Skill from './Skill';

interface JobSkillAttributes {
    id: string;
    jobId: string;
    skillId: string;
}

type JobSkillCreationAttributes = Optional<JobSkillAttributes, 'id'>;

class JobSkill extends Model<JobSkillAttributes, JobSkillCreationAttributes>
    implements JobSkillAttributes {
    declare id: string;
    declare jobId: string;
    declare skillId: string;
}

JobSkill.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        jobId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: { tableName: 'jobs', schema: 'management' },
                key: 'jobId',
            },
        },
        skillId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: { tableName: 'skills', schema: 'management' },
                key: 'skillId',
            },
        },
    },
    {
        sequelize,
        tableName: 'job_skills',
        schema: 'management',
        timestamps: true,
    }
);

JobSkill.belongsTo(Skill, { foreignKey: 'skillId', as: 'skill' })

export default JobSkill;
