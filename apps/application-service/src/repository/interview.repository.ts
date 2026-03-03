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

const getAllInterviewsRepository = async () => {
    try {
        const scheduledInterviews = await Interview.findAll();
        return scheduledInterviews;
    } catch (error: any) {
        throw error;
    }
};

const getInterviewByIdRepository = async (interviewId: string) => {
    try {
        const interview = await Interview.findOne({ where: { interviewId } });
        if (!interview) throw new Error('interview not found');
        return interview;
    } catch (error: any) {
        throw error;
    }
}

const getInterviewsByJobIdRepository = async (jobId: string) => {
    try {
        const applicationIds = await JobApplication.findAll({where: {jobId}, attributes: ['applicationId'], raw: true});

        let applicationIdArray: string[] = []
        applicationIds.forEach(id => {
            applicationIdArray.push(id.applicationId);
        })

        const interviews = await Interview.findOne({ where: { applicationId: applicationIdArray } });
        if (!interviews) throw new Error('interview not found');

        return interviews;
    } catch (error: any) {
        throw error;
    }
}

const updateExistingInterviewRepository = async (interviewId: string, newInterviewData: Partial<CreateInterview>) => {
    try {
        const existingInterview = await Interview.findOne({ where: { interviewId } });
        if (!existingInterview) throw new Error('interview not found');

        await Interview.update({ ...newInterviewData }, { where: { interviewId } });

        return { message: 'updated' };
    } catch (error: any) {
        throw error;
    }
};

export {
    scheduleInterviewRepository,
    getAllInterviewsRepository,
    getInterviewByIdRepository,
    getInterviewsByJobIdRepository,
    updateExistingInterviewRepository,
}