import {
    scheduleInterviewRepository,
} from '../repository/interview.repository'
import { CreateInterview } from '../types/CreateInterview.type';

const scheduleInterview = async (newInterviewData: CreateInterview) => {
    const newInterview = await scheduleInterviewRepository(newInterviewData);
    return newInterview;
}

export {
    scheduleInterview,

};