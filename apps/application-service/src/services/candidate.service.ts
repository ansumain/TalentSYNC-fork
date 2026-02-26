import { getAllCandidatesParsedJSONRepository, getCandidateDataFromNameRepository, getCandidateDataFromUserIdRepository, getCandidateDataFromResumeIdRepository } from "../repository/candidate.repository"

const getCandiateParsedData = async () => {
    const candidateJSON = await getAllCandidatesParsedJSONRepository();
    return candidateJSON;
}

const getCandidateDataFromName = async (name: string) => {
    const candidateDataFromName = await getCandidateDataFromNameRepository(name);
    return candidateDataFromName;
}

const getCandidateDataFromUserId = async (name: string) => {
    const candidateDataFromUserId = await getCandidateDataFromUserIdRepository(name);
    return candidateDataFromUserId;
}

const getCandidateDataFromResumeId = async (name: string) => {
    const candidateDataResumeId = await getCandidateDataFromResumeIdRepository(name);
    return candidateDataResumeId;
}

export { getCandiateParsedData, getCandidateDataFromName, getCandidateDataFromUserId, getCandidateDataFromResumeId };