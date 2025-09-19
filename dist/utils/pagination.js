"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MOBILE_PAGINATION = void 0;
exports.parsePaginationParams = parsePaginationParams;
exports.createPaginationResult = createPaginationResult;
function parsePaginationParams(query) {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(query.limit) || 20));
    const offset = (page - 1) * limit;
    return { page, limit, offset };
}
function createPaginationResult(data, total, page, limit) {
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;
    const nextPage = hasNext ? page + 1 : null;
    const prevPage = hasPrev ? page - 1 : null;
    return {
        data,
        pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNext,
            hasPrev,
            nextPage,
            prevPage,
        },
    };
}
exports.MOBILE_PAGINATION = {
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 50,
    MIN_LIMIT: 1,
};
//# sourceMappingURL=pagination.js.map