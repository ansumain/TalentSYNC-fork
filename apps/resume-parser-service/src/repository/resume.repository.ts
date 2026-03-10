import { ResumeData } from "@talentsync/models";
import { Op } from "sequelize";
import type { ParseResumeOutput } from "../types/ParseResume.type";
import { ResumeModel } from "../types/ResumeModel.type";

// adds resume to resume_data
const addToResumeData = async (resumeData: ResumeModel): Promise<string> => {
    const { userId, fileName, mimeType, fileURL, status } = resumeData;
    const newResume = await ResumeData.create({ userId, fileName, mimeType, fileURL, status });
    return newResume.id;
}

// get the resume by resumeId
const getResumeByResumeId = async (resumeId: string) => {
    const resume = await ResumeData.findOne({ where: { id: resumeId } });
    return resume;
}

// update resume parsing status by resumeId
const updateStatusByResumeId = async (resumeId: string, currentStatus: string, errorMessage: string | null = null) => {
    await ResumeData.update({ status: currentStatus, errorMessage }, { where: { id: resumeId } });
}

// update rawData + parsedJSON of resume_data
const updateAfterParsing = async (resumeId: string, resumeData: ParseResumeOutput) => {
    const { rawText, parsedJSON } = resumeData;
    await ResumeData.update({ rawText, parsedJSON }, { where: { id: resumeId } });
}

// get the parsing failed resumes
const getActiveResumeCountByUserId = async (userId: string): Promise<number> => {
    return ResumeData.count({ where: { userId, status: { [Op.ne]: 'failed' } } });
};

export { addToResumeData, getResumeByResumeId, updateStatusByResumeId, updateAfterParsing, getActiveResumeCountByUserId };