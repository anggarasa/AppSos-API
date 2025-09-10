import { Response } from "express";
export interface ApiResponse<T = any> {
    status: number;
    message: string;
    data?: T | undefined;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
export interface PaginationOptions {
    page: number;
    limit: number;
    total: number;
}
export declare class ResponseHelper {
    static success<T>(res: Response, data?: T, message?: string, statusCode?: number): void;
    static successWithPagination<T>(res: Response, data: T[], pagination: PaginationOptions, message?: string, statusCode?: number): void;
    static error(res: Response, message?: string, statusCode?: number, data?: any): void;
    static validationError(res: Response, errors: any, message?: string): void;
    static notFound(res: Response, message?: string): void;
    static unauthorized(res: Response, message?: string): void;
    static forbidden(res: Response, message?: string): void;
    static conflict(res: Response, message?: string): void;
    static internalError(res: Response, message?: string): void;
}
export declare const parsePagination: (query: any) => {
    page: number;
    limit: number;
    skip: number;
};
//# sourceMappingURL=response.d.ts.map