export interface PaginationParams {
    page: number;
    limit: number;
    offset: number;
}
export interface PaginationResult<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
        nextPage: number | null;
        prevPage: number | null;
    };
}
export declare function parsePaginationParams(query: any): PaginationParams;
export declare function createPaginationResult<T>(data: T[], total: number, page: number, limit: number): PaginationResult<T>;
export declare const MOBILE_PAGINATION: {
    readonly DEFAULT_LIMIT: 20;
    readonly MAX_LIMIT: 50;
    readonly MIN_LIMIT: 1;
};
//# sourceMappingURL=pagination.d.ts.map