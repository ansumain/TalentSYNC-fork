import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '@talentsync/config';

interface JobApplicationAttributes {
    applicationId: string;
    userId: string;
    jobId: string;
    currentStatus: string;
}

type JobApplicationCreationAttributes = Optional<JobApplicationAttributes, 'applicationId'>;

class JobApplication
    extends Model<JobApplicationAttributes, JobApplicationCreationAttributes>
    implements JobApplicationAttributes {
    declare applicationId: string;
    declare userId: string;
    declare jobId: string;
    declare currentStatus: string;
}

JobApplication.init(
    {
        applicationId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: { tableName: 'users', schema: 'auth' },
                key: 'id',
            },
        },
        jobId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: { tableName: 'jobs', schema: 'management' },
                key: 'jobId',
            },
        },
        currentStatus: {
            type: DataTypes.ENUM('applied', 'shortlisted', 'interviewing', 'hired', 'rejected'),
            allowNull: false,
            defaultValue: 'applied'
        }
    },
    {
        sequelize,
        tableName: 'job_applications',
        schema: 'management',
        timestamps: true,
    }
);

export default JobApplication;
