import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '@talentsync/config';

interface InterviewAttributes {
    interviewId: string;
    applicationId: string;
    interviewerId: string;
    managerId: string;
    scheduledAt: Date;
    scheduledBy: string;
    status: string;
}

type InterviewCreationAttributes = Optional<InterviewAttributes, 'interviewId'>;

class Interview
    extends Model<InterviewAttributes, InterviewCreationAttributes>
    implements InterviewAttributes {
    declare interviewId: string;
    declare applicationId: string;
    declare interviewerId: string;
    declare managerId: string;
    declare scheduledAt: Date;
    declare scheduledBy: string;
    declare status: string;
}

Interview.init(
    {
        interviewId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        applicationId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: { tableName: 'job_applications', schema: 'management' },
                key: 'applicationId',
            },
        },
        interviewerId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: { tableName: 'users', schema: 'auth' },
                key: 'id',
            },
        },
        managerId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: { tableName: 'users', schema: 'auth' },
                key: 'id',
            },
        },
        scheduledAt: {
            type: DataTypes.DATE,
            allowNull: false

        },
        scheduledBy: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: { tableName: 'users', schema: 'auth' },
                key: 'id',
            },
        },
        status: {
            type: DataTypes.ENUM('scheduled', 'completed', 'failed', 'cancelled'),
            allowNull: false,
            defaultValue: 'scheduled'
        }
    },
    {
        sequelize,
        tableName: 'interviews',
        schema: 'management',
        timestamps: true,
    }
);

export default Interview;
