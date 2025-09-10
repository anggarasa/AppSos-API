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

export class ResponseHelper {
  static success<T>(
    res: Response,
    data?: T,
    message: string = "success",
    statusCode: number = 200
  ): void {
    const response: ApiResponse<T> = {
      status: statusCode,
      message,
      data,
    };
    res.status(statusCode).json(response);
  }

  static successWithPagination<T>(
    res: Response,
    data: T[],
    pagination: PaginationOptions,
    message: string = "success",
    statusCode: number = 200
  ): void {
    const totalPages = Math.ceil(pagination.total / pagination.limit);
    const hasNext = pagination.page < totalPages;
    const hasPrev = pagination.page > 1;

    const response: ApiResponse<T[]> = {
      status: statusCode,
      message,
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        totalPages,
        hasNext,
        hasPrev,
      },
    };
    res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    message: string = "error",
    statusCode: number = 400,
    data?: any
  ): void {
    const response: ApiResponse = {
      status: statusCode,
      message,
      data,
    };
    res.status(statusCode).json(response);
  }

  static validationError(
    res: Response,
    errors: any,
    message: string = "validation error"
  ): void {
    this.error(res, message, 400, errors);
  }

  static notFound(res: Response, message: string = "not found"): void {
    this.error(res, message, 404);
  }

  static unauthorized(res: Response, message: string = "unauthorized"): void {
    this.error(res, message, 401);
  }

  static forbidden(res: Response, message: string = "forbidden"): void {
    this.error(res, message, 403);
  }

  static conflict(res: Response, message: string = "conflict"): void {
    this.error(res, message, 409);
  }

  static internalError(
    res: Response,
    message: string = "internal server error"
  ): void {
    this.error(res, message, 500);
  }
}

export const parsePagination = (query: any) => {
  const page = Math.max(1, parseInt(query.page as string) || 1);
  const limit = Math.min(
    100,
    Math.max(1, parseInt(query.limit as string) || 10)
  );
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};
