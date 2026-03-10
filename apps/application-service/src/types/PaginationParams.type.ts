type SortOrder = 'ASC' | 'DESC';

interface PaginationParams {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: SortOrder;
    search?: string;
}

export type { PaginationParams }