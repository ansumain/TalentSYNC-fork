import { User } from '@talentsync/models';
import {
    getAvailableInterviewersRepository,
    getDatedInterviewCountRepository,
    checkInterviewerEligibilityRepository,
    scheduleInterviewRepository,
    getAllInterviewsRepository,
    getInterviewByIdRepository,
    getInterviewsByJobIdRepository,
    getAssignedInterviewsRepository,
    updateExistingInterviewRepository,
    submitInterviewResultRepository,
    cancelInterviewRepository,
    deleteExistingInterviewRepository
} from '../repository/interview.repository'
import { CreateInterview } from '../types/CreateInterview.type';

// get available interviewers
const getAvailableInterviewers = async (date: string, applicationId: string) => {
    const allInterviewers = await getAvailableInterviewersRepository();

    let availableInterviewers: Partial<User>[] = [];
    for (const interviewer of allInterviewers) {
        const interviewCount = await getDatedInterviewCountRepository(interviewer.id, date);
        if (interviewCount >= 10) continue;

        const isInterviewerEligible = await checkInterviewerEligibilityRepository(interviewer.id, applicationId);
        if (isInterviewerEligible) availableInterviewers.push(interviewer);
    }

    return availableInterviewers;
}

// schedule an interview
const scheduleInterview = async (newInterviewData: CreateInterview) => {
    return scheduleInterviewRepository(newInterviewData);
}

// get all interviews
const getAllInterviews = async () => {
    return getAllInterviewsRepository();
}

// get interview by Id
const getInterviewById = async (interviewId: string) => {
    return getInterviewByIdRepository(interviewId);
}

// get interviews by jobId
const getInterviewsByJobId = async (jobId: string) => {
    return getInterviewsByJobIdRepository(jobId);
}

// update interview details
const updateExistingInterview = async (interviewId: string, updateInterviewData: Partial<CreateInterview>) => {
    return updateExistingInterviewRepository(interviewId, updateInterviewData);
}

// delete an interview
const deleteExistingInterview = async (interviewId: string) => {
    return deleteExistingInterviewRepository(interviewId);
}

// get all assigned interviews
const getAssignedInterviews = async (interviewerId: string) => {
    return getAssignedInterviewsRepository(interviewerId);
};

// submit interview result + status: completed + update respective jobApplication status
const submitInterviewResult = async (interviewId: string, result: 'passed' | 'failed') => {
    return submitInterviewResultRepository(interviewId, result);
};

// cancel an interview 
const cancelInterview = async (interviewId: string) => {
    return cancelInterviewRepository(interviewId);
};

export {
    getAvailableInterviewers,
    scheduleInterview,
    getAllInterviews,
    getInterviewById,
    getInterviewsByJobId,
    getAssignedInterviews,
    updateExistingInterview,
    submitInterviewResult,
    cancelInterview,
    deleteExistingInterview
};