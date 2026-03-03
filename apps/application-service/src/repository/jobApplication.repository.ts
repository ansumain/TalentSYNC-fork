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


export {
    addApplicationRepository,
    getAllApplicationsRepository
}