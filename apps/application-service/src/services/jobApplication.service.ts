import {
    addApplicationRepository,
    getAllApplicationsRepository,
    getApplicationByIdRepository,
    getApplicationsByJobIdRepository,
    getApplicationsByUserIdRepository,
    updateApplicationCurrentStatusRepository,
    deleteExistingApplicationRepository,
    getRankedApplicantsByJobIdRepository
} from '../repository/jobApplication.repository'
import { RankedApplicant } from '../types/JobApplication.type';
import { Applicaiton } from '../types/Application.type';

// add application
const addApplication = async (application: Applicaiton) => {
    const newApplication = await addApplicationRepository(application);
    return newApplication;
}

// get all applications
const getAllApplications = async (params: {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'ASC' | 'DESC';
    search?: string;
}) => {
    return getAllApplicationsRepository(params);
}

// get application By Id
const getApplicationById = async (applicationId: string) => {
    const applicaiton = await getApplicationByIdRepository(applicationId);
    return applicaiton;
}

// get applications by jobId
const getApplicationsByJobId = async (jobId: string) => {
    const applicaitons = await getApplicationsByJobIdRepository(jobId);
    return applicaitons;
}

// get applications by userId
const getApplicationsByUserId = async (userId: string, params: {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'ASC' | 'DESC';
    search?: string;
}) => {
    return getApplicationsByUserIdRepository(userId, params);
}

// update application's current status
const updateApplicationCurrentStatus = async (applicaitonId: string, currentStatus: string) => {
    const updatedApplication = await updateApplicationCurrentStatusRepository(applicaitonId, currentStatus);
    return updatedApplication;
}

// delete application
const deleteExistingApplication = async (applicationId: string) => {
    const isDeleted = await deleteExistingApplicationRepository(applicationId);
    if (isDeleted) return isDeleted;
}

// get ranked applicants by jobId
const getRankedApplicantsByJobId = async (jobId: string): Promise<RankedApplicant[]> => {
    return getRankedApplicantsByJobIdRepository(jobId);
};

export {
    addApplication,
    getAllApplications,
    getApplicationById,
    getApplicationsByJobId,
    getApplicationsByUserId,
    updateApplicationCurrentStatus,
    deleteExistingApplication,
    getRankedApplicantsByJobId
};