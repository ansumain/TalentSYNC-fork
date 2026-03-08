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
import type { ApplicationWithJob, EnrichedApplication, RankedApplicant } from '../repository/jobApplication.repository';
import { Applicaiton } from '../types/Application.type';

const addApplication = async (application: Applicaiton) => {
    const newApplication = await addApplicationRepository(application);
    return newApplication;
}

const getAllApplications = async (params: {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'ASC' | 'DESC';
    search?: string;
}) => {
    return getAllApplicationsRepository(params);
}

const getApplicationById = async (applicationId: string) => {
    const applicaiton = await getApplicationByIdRepository(applicationId);
    return applicaiton;
}

const getApplicationsByJobId = async (jobId: string) => {
    const applicaitons = await getApplicationsByJobIdRepository(jobId);
    return applicaitons;
}

const getApplicationsByUserId = async (userId: string, params: {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'ASC' | 'DESC';
    search?: string;
}) => {
    return getApplicationsByUserIdRepository(userId, params);
}

const updateApplicationCurrentStatus = async (applicaitonId: string, currentStatus: string) => {
    const updatedApplication = await updateApplicationCurrentStatusRepository(applicaitonId, currentStatus);
    return updatedApplication;
}

const deleteExistingApplication = async (applicationId: string) => {
    const isDeleted = await deleteExistingApplicationRepository(applicationId);
    if (isDeleted) return isDeleted;
}

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