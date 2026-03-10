import type { PaginationMeta } from "./Pagination.type";
import type { Candidate } from "./Candidate.type";

interface GetAllCandidatesResponse extends PaginationMeta {
    candidateJSONData: Candidate[];
}
interface FilterCandidatesResponse extends PaginationMeta {
    candidateData: Candidate[];
}

export type { GetAllCandidatesResponse, FilterCandidatesResponse };