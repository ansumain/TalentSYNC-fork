import ResumeData from "../models/ResumeData"
import User from "../models/User";
import { Op } from "sequelize";

const getAllCandidatesParsedJSONRepository = async () => {
    const candidateJSON = await ResumeData.findAll({
        attributes: ['id', 'userId', 'parsedJSON',]
    });
    return candidateJSON;
}

const getCandidateDataFromNameRepository = async (name: string) => {
    const users = await User.findAll({
        where: {
            name: {
                [Op.iLike]: `%${name}%`
            }
        },
        attributes: ['id'],
        raw: true
    });

    const userIds = users.map(user => user.id);

    const candidateData = await ResumeData.findAll({
        where: {
            userId: userIds
        },
        attributes: ['id', 'userId', 'parsedJSON']
    });

    return candidateData;
}

const getCandidateDataFromUserIdRepository = async (userId: string) => {
    const candidate = await ResumeData.findAll({
        attributes: ['id', 'userId', 'parsedJSON'],
        where: { userId }
    });
    return candidate;
}

export { getAllCandidatesParsedJSONRepository, getCandidateDataFromNameRepository, getCandidateDataFromUserIdRepository }