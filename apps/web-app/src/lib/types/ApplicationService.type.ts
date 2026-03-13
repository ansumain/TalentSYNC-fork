import type { PaginationMeta } from "./Pagination.type";
import type { JobApplication } from "./JobService.type";

interface GetAllApplicationsResponse extends PaginationMeta {
    allApplications: JobApplication[];
}

interface GetApplicationsByJobIdResponse {
    applicationsByJobId: JobApplication[];
}

interface GetMyApplicationsResponse extends PaginationMeta {
    applications: JobApplication[];
}

export type { GetAllApplicationsResponse, GetApplicationsByJobIdResponse, GetMyApplicationsResponse };