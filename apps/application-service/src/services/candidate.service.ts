import { getAllCandidatesParsedJSONRepository, getCandidateDataFromNameRepository } from "../repository/candidate.repository"

const getCandiateParsedData = async () => {
    const candidateJSON = await getAllCandidatesParsedJSONRepository();
    return candidateJSON;
}

const getCandidateDataFromName = async (name: string) => {
    const candidateDataFromName = await getCandidateDataFromNameRepository(name);
    return candidateDataFromName;
}

export { getCandiateParsedData, getCandidateDataFromName };