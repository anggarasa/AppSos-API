"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePagination = exports.ResponseHelper = void 0;
class ResponseHelper {
    static success(res, data, message = "success", statusCode = 200) {
        const response = {
            status: statusCode,
            message,
            data,
        };
        res.status(statusCode).json(response);
    }
    static successWithPagination(res, data, pagination, message = "success", statusCode = 200) {
        const totalPages = Math.ceil(pagination.total / pagination.limit);
        const hasNext = pagination.page < totalPages;
        const hasPrev = pagination.page > 1;
        const response = {
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
    static error(res, message = "error", statusCode = 400, data) {
        const response = {
            status: statusCode,
            message,
            data,
        };
        res.status(statusCode).json(response);
    }
    static validationError(res, errors, message = "validation error") {
        this.error(res, message, 400, errors);
    }
    static notFound(res, message = "not found") {
        this.error(res, message, 404);
    }
    static unauthorized(res, message = "unauthorized") {
        this.error(res, message, 401);
    }
    static forbidden(res, message = "forbidden") {
        this.error(res, message, 403);
    }
    static conflict(res, message = "conflict") {
        this.error(res, message, 409);
    }
    static internalError(res, message = "internal server error") {
        this.error(res, message, 500);
    }
}
exports.ResponseHelper = ResponseHelper;
const parsePagination = (query) => {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
    const skip = (page - 1) * limit;
    return { page, limit, skip };
};
exports.parsePagination = parsePagination;
//# sourceMappingURL=response.js.map