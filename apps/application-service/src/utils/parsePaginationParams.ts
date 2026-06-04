export interface PaginationParams {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'ASC' | 'DESC';
    search?: string;
}

export const parsePaginationParams = (query: Record<string, any>): PaginationParams => {
    const page = Math.max(1, parseInt(query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit as string) || 10));
    const sortOrder = (query.sortOrder as string)?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    const sortBy = (query.sortBy as string) || 'createdAt';
    const search = (query.search as string)?.trim() || undefined;
    return { page, limit, sortBy, sortOrder: sortOrder as 'ASC' | 'DESC', search };
};