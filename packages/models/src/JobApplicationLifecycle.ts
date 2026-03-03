import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@talentsync/config';

interface JobApplicationLifecycleAttributes {
    applicationId: string;
    completedStatus: string;
    lastChangedBy: string;
}

class JobApplicationLifecycle extends Model<JobApplicationLifecycleAttributes>
    implements JobApplicationLifecycleAttributes {
    declare applicationId: string;
    declare completedStatus: string;
    declare lastChangedBy: string;
}

JobApplicationLifecycle.init(
    {
        applicationId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: { tableName: 'job_applications', schema: 'management' },
                key: 'applicationId',
            }
        },
        completedStatus: {
            type: DataTypes.JSONB,
            allowNull: true
        },
        lastChangedBy: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: { tableName: 'users', schema: 'auth' },
                key: 'id',
            }
        }
    },
    {
        sequelize,
        tableName: 'job_application_lifecycle',
        schema: 'management',
        timestamps: true,
    }
);

export default JobApplicationLifecycle;
