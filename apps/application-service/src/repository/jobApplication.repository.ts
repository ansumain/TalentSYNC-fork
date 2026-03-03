import { Applicaiton } from "../types/Application.type";
import { JobApplication } from '@talentsync/models';


const addApplicationRepository = async (application: Applicaiton) => {
    try {
        // check existing application
        const existingApplication = await JobApplication.findAll({ where: { ...application} });
        if (existingApplication.length > 0) throw new Error('application already exists');
        const newJob = await JobApplication.create(application);
        return newJob;
    } catch (error: any) {
        throw error;
    }
};

const getAllApplicationsRepository = async () => {
    try {
        const allApplications = await JobApplication.findAll();
        return allApplications;
    } catch (error: any) {
        throw error;
    }
};

const getApplicationByIdRepository = async (applicationId: string) => {
    try {
        const applicaiton = await JobApplication.findOne({ where: { applicationId } });
        if (!applicaiton) throw new Error('application not found');
        return applicaiton;
    } catch (error: any) {
        throw error;
    }
}

const getApplicationsByJobIdRepository = async (jobId: string) => {
    try {
        const applications = await JobApplication.findAll({ where: { jobId } });
        if (!applications) throw new Error('applications not found');
        return applications;
    } catch (error: any) {
        throw error;
    }
}

const updateApplicationCurrentStatusRepository = async (applicationId: string, currentStatus: string) => {
    try {
        const existingApplication = await JobApplication.findOne({ where: { applicationId } });
        if (!existingApplication) throw new Error('application not found');

        await JobApplication.update({ currentStatus }, { where: { applicationId } });

        return { message: 'updated' };
    } catch (error: any) {
        throw error;
    }
};


export {
    addApplicationRepository,
    getAllApplicationsRepository,
    getApplicationByIdRepository,
    getApplicationsByJobIdRepository,
    updateApplicationCurrentStatusRepository,
}