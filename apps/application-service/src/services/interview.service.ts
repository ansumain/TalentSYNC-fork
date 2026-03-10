import { User } from '@talentsync/models';
import {
    getAvailableInterviewersRepository,
    getDatedInterviewCountRepository,
    checkInterviewerEligibilityRepository,
    scheduleInterviewRepository,
    getAllInterviewsRepository,
    getInterviewByIdRepository,
    getInterviewsByJobIdRepository,
    updateExistingInterviewRepository,
    deleteExistingInterviewRepository
} from '../repository/interview.repository'
import { CreateInterview } from '../types/CreateInterview.type';

// get available interviewers
const getAvailableInterviewers = async (date: string, applicationId: string) => {
    const allInterviewers = await getAvailableInterviewersRepository();

    let availableInterviewers: Partial<User>[] = [];
    for (const interviewer of allInterviewers) {
        const interviewCount = await getDatedInterviewCountRepository(interviewer.id, date);
        if (interviewCount > 10) continue;

        console.log('interviewerId:', interviewer.id);

        const isInterviewerEligible = await checkInterviewerEligibilityRepository(interviewer.id, applicationId);
        if (isInterviewerEligible) availableInterviewers.push(interviewer);
    }

    return availableInterviewers;
}

// schedule interview
const scheduleInterview = async (newInterviewData: CreateInterview) => {
    const newInterview = await scheduleInterviewRepository(newInterviewData);
    return newInterview;
}

// get all interviews
const getAllInterviews = async () => {
    const scheduledInterviews = await getAllInterviewsRepository();
    return scheduledInterviews;
}

// get interview by Id
const getInterviewById = async (interviewId: string) => {
    const interview = await getInterviewByIdRepository(interviewId);
    return interview;
}

// get interviews by jobId
const getInterviewsByJobId = async (jobId: string) => {
    const interviews = await getInterviewsByJobIdRepository(jobId);
    return interviews;
}

// update interview
const updateExistingInterview = async (interviewId: string, updateInterviewData: Partial<CreateInterview>) => {
    const updatedInterview = await updateExistingInterviewRepository(interviewId, updateInterviewData);
    return updatedInterview;
}

// delete interivew
const deleteExistingInterview = async (interviewId: string) => {
    const isDeleted = await deleteExistingInterviewRepository(interviewId);
    if (isDeleted) return isDeleted;
}

export {
    getAvailableInterviewers,
    scheduleInterview,
    getAllInterviews,
    getInterviewById,
    getInterviewsByJobId,
    updateExistingInterview,
    deleteExistingInterview
};