import {
    addApplicationRepository,
    getAllApplicationsRepository,
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

export {
    addApplication,
    getAllApplications,
};