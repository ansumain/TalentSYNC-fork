import { getAllCandidatesParsedJSONRepository, getCandidateDataFromNameRepository, getCandidateDataFromUserIdRepository } from "../repository/candidate.repository"

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

export { getCandiateParsedData, getCandidateDataFromName, getCandidateDataFromUserId };