import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '@talentsync/config';

export interface JobAttributes {
    jobId: string;
    title: string;
    description: string;
    location: string;
    jobType: string;
    openings: number;
    createdBy: string;
}

type JobCreationAttributes = Optional<JobAttributes, 'jobId'>;

class Job extends Model<JobAttributes, JobCreationAttributes> implements JobAttributes {
    declare jobId: string;
    declare title: string;
    declare description: string;
    declare location: string;
    declare jobType: string;
    declare openings: number;
    declare createdBy: string;
}

Job.init(
    {
        jobId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        jobType: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        openings: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        createdBy: {
            type: DataTypes.UUID,
            allowNull: false,
        }
    },
    {
        sequelize,
        tableName: 'jobs',
        schema: 'management',
        timestamps: true,
    }
);

export default Job;
