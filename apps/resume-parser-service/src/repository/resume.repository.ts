import { ResumeData } from "@talentsync/models";
import { ParseResumeOutput } from "../services/parseResume.service";
import { ResumeModel } from "../types/ResumeModel.type";

const addToResumeData = async (resumeData: ResumeModel): Promise<string> => {
    const { userId, fileName, mimeType, fileURL, status } = resumeData;
    const newResume = await ResumeData.create({ userId, fileName, mimeType, fileURL, status });
    return newResume.id;
}

const getResumeByResumeId = async (resumeId: string) => {
    const resume = await ResumeData.findOne({ where: { id: resumeId } });
    return resume;
}

const updateStatusByResumeId = async (resumeId: string, currentStatus: string, errorMessage: string | null = null) => {
    await ResumeData.update({ status: currentStatus, errorMessage }, { where: { id: resumeId } });
}

const updateAfterParsing = async (resumeId: string, resumeData: ParseResumeOutput) => {
    const { rawText, parsedJSON } = resumeData;
    await ResumeData.update({ rawText, parsedJSON }, { where: { id: resumeId } });
}

export { addToResumeData, getResumeByResumeId, updateStatusByResumeId, updateAfterParsing };