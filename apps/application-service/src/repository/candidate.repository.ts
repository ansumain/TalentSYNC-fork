import { ResumeData } from "@talentsync/models";
import { Op, Sequelize } from "sequelize";

type SortOrder = 'ASC' | 'DESC';

interface PaginationParams {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: SortOrder;
    search?: string;
}

// Map frontend sortBy keys to Sequelize order expressions
const CANDIDATE_JSON_SORT: Record<string, string> = {
    name: `"parsedJSON"->>'name'`,
    email: `"parsedJSON"->>'email'`,
    phone: `"parsedJSON"->>'phone'`,
};

const getAllCandidatesParsedJSONRepository = async ({ page, limit, sortBy, sortOrder, search }: PaginationParams) => {
    const offset = (page - 1) * limit;
    const order: any = CANDIDATE_JSON_SORT[sortBy]
        ? [[Sequelize.literal(CANDIDATE_JSON_SORT[sortBy]), sortOrder]]
        : [['createdAt', sortOrder]];

    const where = search
        ? Sequelize.where(
              Sequelize.literal(`"parsedJSON"->>'name'`),
              { [Op.iLike]: `%${search}%` }
          )
        : undefined;

    const { count, rows } = await ResumeData.findAndCountAll({
        attributes: ['userId', 'id', 'parsedJSON', 'createdAt'],
        where,
        order,
        limit,
        offset,
        raw: true,
    });

    return {
        data: rows,
        total: count as unknown as number,
        page,
        limit,
        totalPages: Math.ceil((count as unknown as number) / limit),
    };
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

const getMyResumeStatusRepository = async (userId: string): Promise<boolean> => {
    const count = await ResumeData.count({ where: { userId, status: { [Op.ne]: 'failed' } } });
    return count > 0;
};

export { getAllCandidatesParsedJSONRepository, getCandidateDataFromUserIdRepository, getCandidateDataFromResumeIdRepository, getMyResumeStatusRepository };