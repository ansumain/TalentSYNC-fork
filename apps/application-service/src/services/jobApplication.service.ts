import {
    addApplicationRepository,
    getAllApplicationsRepository,
    getApplicationByIdRepository,
    getApplicationsByJobIdRepository,
    updateApplicationCurrentStatusRepository
} from '../repository/jobApplication.repository'
import { Applicaiton } from '../types/Application.type';

const addApplication = async (application: Applicaiton) => {
    const newApplication = await addApplicationRepository(application);
    return newApplication;
}

const getAllApplications = async () => {
    const allApplications = await getAllApplicationsRepository();
    return allApplications;
}

const getApplicationById = async (applicationId: string) => {
    const applicaiton = await getApplicationByIdRepository(applicationId);
    return applicaiton;
}

const getApplicationsByJobId = async (jobId: string) => {
    const applicaitons = await getApplicationsByJobIdRepository(jobId);
    return applicaitons;
}

const updateApplicationCurrentStatus = async (applicaitonId: string, currentStatus: string) => {
    const updatedApplication = await updateApplicationCurrentStatusRepository(applicaitonId, currentStatus);
    return updatedApplication;
}

export {
    addApplication,
    getAllApplications,
    getApplicationById,
    getApplicationsByJobId,
    updateApplicationCurrentStatus
};