import { Interview, JobApplication } from '@talentsync/models';
import { CreateInterview } from "../types/CreateInterview.type";

const scheduleInterviewRepository = async (newInterviewData: CreateInterview) => {
    try {
        const existingApplication = await JobApplication.findOne({where: {applicationId: newInterviewData.applicationId}});
        if(!existingApplication) throw new Error ('application not found');

        const existingInterview = await Interview.findAll({where: {applicationId: newInterviewData.applicationId}});
        if(existingInterview.length > 0) throw new Error('interview already exists');

        const newInterview = await Interview.create(newInterviewData);
        return newInterview;
    } catch (error: any) {
        throw error;
    }
};

export {
    scheduleInterviewRepository,
}