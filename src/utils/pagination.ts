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

/**
 * Parse pagination parameters from query string
 * Mobile-optimized with reasonable defaults
 */
export function parsePaginationParams(query: any): PaginationParams {
  const page = Math.max(1, parseInt(query.page as string) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit as string) || 20)); // Max 50 for mobile performance
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

/**
 * Create pagination result for mobile consumption
 */
export function createPaginationResult<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginationResult<T> {
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

/**
 * Mobile-optimized pagination defaults
 */
export const MOBILE_PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 50,
  MIN_LIMIT: 1,
} as const;
