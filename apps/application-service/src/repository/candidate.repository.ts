import ResumeData from "../models/ResumeData"

const getAllCandidatesParsedJSONRepository = async () => {
    const candidateJSON = await ResumeData.findAll({
        attributes: ['id', 'userId', 'parsedJSON',]
    });
    return candidateJSON;
}

export { getAllCandidatesParsedJSONRepository }