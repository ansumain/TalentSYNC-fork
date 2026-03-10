import { getAllCandidatesParsedJSONRepository, getCandidateDataFromUserIdRepository, getCandidateDataFromResumeIdRepository, getMyResumeStatusRepository } from "../repository/candidate.repository"
import { PaginationParams } from "../types/PaginationParams.type";

// get candidate parsed data
const getCandiateParsedData = async (params: PaginationParams) => {
    return getAllCandidatesParsedJSONRepository(params);
}
// get candidate parsed data by user Id
const getCandidateDataFromUserId = async (userId: string) => {
    return getCandidateDataFromUserIdRepository(userId);
}

// get candidate parsed data by resume Id
const getCandidateDataFromResumeId = async (resumeId: string) => {
    return getCandidateDataFromResumeIdRepository(resumeId);
}

// check if the user has atleat one resume
const getMyResumeStatus = async (userId: string): Promise<boolean> => {
    return getMyResumeStatusRepository(userId);
};

// gets all the user's resumes
const getMyResumes = async (userId: string) => {
    return getCandidateDataFromUserIdRepository(userId);
};

export { getCandiateParsedData, getCandidateDataFromUserId, getCandidateDataFromResumeId, getMyResumeStatus, getMyResumes };