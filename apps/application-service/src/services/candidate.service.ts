import { getAllCandidatesParsedJSONRepository, getCandidateDataFromUserIdRepository, getCandidateDataFromResumeIdRepository, getMyResumeStatusRepository } from "../repository/candidate.repository"

interface PaginationParams {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'ASC' | 'DESC';
    search?: string;
}

const getCandiateParsedData = async (params: PaginationParams) => {
    return getAllCandidatesParsedJSONRepository(params);
}

const getCandidateDataFromUserId = async (userId: string) => {
    return getCandidateDataFromUserIdRepository(userId);
}

const getCandidateDataFromResumeId = async (resumeId: string) => {
    return getCandidateDataFromResumeIdRepository(resumeId);
}

const getMyResumeStatus = async (userId: string): Promise<boolean> => {
    return getMyResumeStatusRepository(userId);
};

const getMyResumes = async (userId: string) => {
    return getCandidateDataFromUserIdRepository(userId);
};

export { getCandiateParsedData, getCandidateDataFromUserId, getCandidateDataFromResumeId, getMyResumeStatus, getMyResumes };