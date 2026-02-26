import { getAllCandidatesParsedJSONRepository } from "../repository/candidate.repository"

const getCandiateParsedData = async () => {
    const candidateJSON = await getAllCandidatesParsedJSONRepository();
    return candidateJSON;
}

export { getCandiateParsedData };