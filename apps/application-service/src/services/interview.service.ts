import {
    scheduleInterviewRepository,
    getAllInterviewsRepository,
    getInterviewByIdRepository,
    getInterviewsByJobIdRepository,
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

export {
    scheduleInterview,
    getAllInterviews,
    getInterviewById,
    getInterviewsByJobId,
};