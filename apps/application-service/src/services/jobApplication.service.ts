import {
    addApplicationRepository,
} from '../repository/jobApplication.repository'
import { Applicaiton } from '../types/Application.type';

const addApplication = async (application: Applicaiton) => {
    const newApplication = await addApplicationRepository(application);
    return newApplication;
}

export {
    addApplication,
};