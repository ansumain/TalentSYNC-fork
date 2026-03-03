import { ResumeData } from "@talentsync/models";
import { Op, Sequelize } from "sequelize";

const getAllCandidatesParsedJSONRepository = async () => {
    const candidateJSON = await ResumeData.findAll({
        attributes: [
            // [Sequelize.literal('DISTINCT ON ("userId") "userId"'), 'userId'],
            'userId',
            'id',
            'parsedJSON',
            'createdAt'
        ],
        order: [
            ['userId', 'ASC'],
            ['createdAt', 'DESC']
        ],
        raw: true
    });

    return candidateJSON;
};

const getCandidateDataFromNameRepository = async (name: string) => {
    const candidateData = await ResumeData.findAll({
        attributes: [
            [Sequelize.literal('DISTINCT ON ("userId") "userId"'), 'userId'],
            'id',
            'parsedJSON',
            'createdAt'
        ],
        where: Sequelize.where(
            Sequelize.literal(`"parsedJSON"->>'name'`),
            { [Op.iLike]: `%${name}%` }
        ),
        order: [
            ['userId', 'ASC'],
            ['createdAt', 'DESC']
        ],
        raw: true
    });

    return candidateData;
};

const getCandidateDataFromUserIdRepository = async (userId: string) => {
    const candidate = await ResumeData.findAll({
        attributes: ['id', 'userId', 'parsedJSON', 'createdAt'],
        where: { userId },
        order: [
            ['createdAt', 'DESC']
        ]
    });
    return candidate;
};

const getCandidateDataFromResumeIdRepository = async (resumeId: string) => {
    const resume = await ResumeData.findAll({
        attributes: ['id', 'userId', 'parsedJSON', 'createdAt'],
        where: { id: resumeId },
        order: [
            ['createdAt', 'DESC']
        ]
    });
    return resume;
};

export { getAllCandidatesParsedJSONRepository, getCandidateDataFromNameRepository, getCandidateDataFromUserIdRepository, getCandidateDataFromResumeIdRepository }