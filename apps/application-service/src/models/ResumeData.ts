import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/sequelize';
import { allowedMimeTypes } from '../config/allowed-file-type';

interface ResumeDataAttributes {
    id: string;
    userId: string;
    fileName: string;
    mimeType: string;
    fileURL: string;
    status: string;
    rawText?: string | null;
    parsedJSON?: object | null;
    errorMessage?: string | null;
}

type ResumeDataCreationAttributes = Optional<ResumeDataAttributes, 'id' | 'rawText' | 'parsedJSON' | 'errorMessage'>;

class ResumeData
    extends Model<ResumeDataAttributes, ResumeDataCreationAttributes>
    implements ResumeDataAttributes {
    declare id: string;
    declare userId: string;
    declare fileName: string;
    declare mimeType: string;
    declare fileURL: string;
    declare status: string;
    declare rawText: string | null;
    declare parsedJSON: object | null;
    declare errorMessage: string | null;
}

ResumeData.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: {tableName: 'users', schema: 'auth'},
                key: 'id',
            },
        },
        fileName: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        mimeType: {
            type: DataTypes.ENUM(...allowedMimeTypes.IMAGE, ...allowedMimeTypes.PDF, ...allowedMimeTypes.DOCX),
            allowNull: false
        },
        fileURL: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true
        },
        status: {
            type: DataTypes.ENUM('queued', 'processing', 'completed', 'failed'),
            allowNull: false
        },
        rawText: {
            type: DataTypes.TEXT,
        },
        parsedJSON: {
            type: DataTypes.JSONB
        },
        errorMessage: {
            type: DataTypes.TEXT
        },
    },
    {
        sequelize,
        tableName: 'resume_data',
        schema: 'resume',
        timestamps: true,
    }
);

export default ResumeData;
