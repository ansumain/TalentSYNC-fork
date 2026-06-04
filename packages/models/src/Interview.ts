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
    result: string | null;
}

type InterviewCreationAttributes = Optional<InterviewAttributes, 'interviewId' | 'status' | 'result'>;

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
    declare result: string | null;
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
            type: DataTypes.ENUM('scheduled', 'completed', 'cancelled', 'noShow'),
            allowNull: false,
            defaultValue: 'scheduled'
        },
        result: {
            type: DataTypes.ENUM('passed', 'failed'),
            allowNull: true,
            defaultValue: null
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
