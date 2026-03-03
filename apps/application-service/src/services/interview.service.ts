import {
    scheduleInterviewRepository,
    getAllInterviewsRepository,
    getInterviewByIdRepository,
    getInterviewsByJobIdRepository,
    updateExistingInterviewRepository
} from '../repository/interview.repository'
import { CreateInterview } from '../types/CreateInterview.type';

const scheduleInterview = async (newInterviewData: CreateInterview) => {
    const newInterview = await scheduleInterviewRepository(newInterviewData);
    return newInterview;
}

const getAllInterviews = async () => {
    const scheduledInterviews = await getAllInterviewsRepository();
    return scheduledInterviews;
}

const getInterviewById = async (interviewId: string) => {
    const interview = await getInterviewByIdRepository(interviewId);
    return interview;
}

const getInterviewsByJobId = async (jobId: string) => {
    const interviews = await getInterviewsByJobIdRepository(jobId);
    return interviews;
}

const updateExistingInterview = async (interviewId: string, updateInterviewData: Partial<CreateInterview>) => {
    const updatedInterview = await updateExistingInterviewRepository(interviewId, updateInterviewData);
    return updatedInterview;
}

export {
    scheduleInterview,
    getAllInterviews,
    getInterviewById,
    getInterviewsByJobId,
    updateExistingInterview,
};