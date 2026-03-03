import {
    addApplicationRepository,
    getAllApplicationsRepository,
    getApplicationByIdRepository,
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

export {
    addApplication,
    getAllApplications,
    getApplicationById,
};