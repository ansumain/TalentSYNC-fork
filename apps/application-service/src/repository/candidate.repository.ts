import { ResumeData } from "@talentsync/models";
import { Op, QueryTypes } from "sequelize";
import { sequelize } from "@talentsync/config";

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

    const searchClause = search ? `AND "parsedJSON"->>'name' ILIKE :search` : '';

    const outerSort = CANDIDATE_JSON_SORT[sortBy]
        ? `${CANDIDATE_JSON_SORT[sortBy]} ${sortOrder}`
        : `"createdAt" ${sortOrder}`;

    const replacements: Record<string, any> = {};
    if (search) replacements.search = `%${search}%`;

    const [countResult] = await sequelize.query<{ count: string }>(
        `SELECT COUNT(*) AS count
         FROM (
             SELECT DISTINCT ON ("userId") "userId"
             FROM resume.resume_data
             WHERE "parsedJSON" IS NOT NULL AND "status" = 'completed' ${searchClause}
             ORDER BY "userId", "createdAt" DESC
         ) latest`,
        { replacements, type: QueryTypes.SELECT }
    );

    const total = parseInt(countResult.count, 10);

    const rows = await sequelize.query<Record<string, any>>(
        `SELECT *
         FROM (
             SELECT DISTINCT ON ("userId") "userId", "id", "fileName", "fileURL", "status", "parsedJSON", "createdAt"
             FROM resume.resume_data
             WHERE "parsedJSON" IS NOT NULL AND "status" = 'completed' ${searchClause}
             ORDER BY "userId", "createdAt" DESC
         ) latest
         ORDER BY ${outerSort}
         LIMIT :limit OFFSET :offset`,
        { replacements: { ...replacements, limit, offset }, type: QueryTypes.SELECT }
    );

    return {
        data: rows,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
};

const getCandidateDataFromUserIdRepository = async (userId: string) => {
    const candidate = await ResumeData.findAll({
        attributes: ['id', 'userId', 'fileName', 'fileURL', 'status', 'parsedJSON', 'createdAt'],
        where: { userId },
        order: [
            ['createdAt', 'DESC']
        ]
    });
    return candidate;
};

const getCandidateDataFromResumeIdRepository = async (resumeId: string) => {
    const resume = await ResumeData.findAll({
        attributes: ['id', 'userId', 'fileName', 'fileURL', 'status', 'parsedJSON', 'createdAt'],
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