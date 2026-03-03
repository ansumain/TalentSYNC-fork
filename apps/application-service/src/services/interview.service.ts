import {
    scheduleInterviewRepository,
    getAllInterviewsRepository,
    getInterviewByIdRepository,
    getInterviewsByJobIdRepository,
    updateExistingInterviewRepository,
    deleteExistingInterviewRepository
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

const deleteExistingInterview = async (interviewId: string) => {
    const isDeleted = await deleteExistingInterviewRepository(interviewId);
    if (isDeleted) return isDeleted;
}

export {
    scheduleInterview,
    getAllInterviews,
    getInterviewById,
    getInterviewsByJobId,
    updateExistingInterview,
    deleteExistingInterview
};