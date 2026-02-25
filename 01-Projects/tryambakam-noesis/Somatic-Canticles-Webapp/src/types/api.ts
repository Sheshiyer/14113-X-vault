/**
 * API Types
 *
 * TypeScript type definitions for API requests and responses.
 */

/** Generic API response wrapper */
export interface ApiResponse<T = unknown> {
  /** Whether the request was successful */
  success: boolean;
  /** Response data */
  data?: T;
  /** Error information if request failed */
  error?: ApiError;
  /** Response metadata */
  meta?: ResponseMeta;
}

/** API error structure */
export interface ApiError {
  /** Error code */
  code: string;
  /** Human-readable error message */
  message: string;
  /** Additional error details */
  details?: Record<string, unknown>;
  /** HTTP status code */
  statusCode: number;
}

/** Response metadata for pagination and caching */
export interface ResponseMeta {
  /** Timestamp of the response */
  timestamp: string;
  /** Request ID for tracing */
  requestId: string;
  /** Pagination information */
  pagination?: PaginationInfo;
  /** Cache information */
  cache?: CacheInfo;
}

/** Pagination information */
export interface PaginationInfo {
  /** Current page number (1-based) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Items per page */
  pageSize: number;
  /** Total number of items */
  totalItems: number;
  /** Whether there is a next page */
  hasNextPage: boolean;
  /** Whether there is a previous page */
  hasPreviousPage: boolean;
}

/** Cache information */
export interface CacheInfo {
  /** Whether response was served from cache */
  cached: boolean;
  /** Cache timestamp */
  cachedAt?: string;
  /** Cache TTL in seconds */
  ttl?: number;
}

/** Pagination parameters for requests */
export interface PaginationParams {
  /** Page number (1-based) */
  page?: number;
  /** Items per page */
  pageSize?: number;
  /** Sort field */
  sortBy?: string;
  /** Sort direction */
  sortOrder?: "asc" | "desc";
}

/** Common API query parameters */
export interface QueryParams extends PaginationParams {
  /** Search query */
  search?: string;
  /** Filter by date range */
  dateFrom?: string;
  dateTo?: string;
  /** Filter by status */
  status?: string;
}

/** API error response type */
export type ApiErrorResponse = ApiResponse<never>;

/** HTTP methods */
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/** API endpoint configuration */
export interface ApiEndpoint {
  /** Endpoint path */
  path: string;
  /** HTTP method */
  method: HttpMethod;
  /** Whether authentication is required */
  requiresAuth: boolean;
  /** Rate limit key */
  rateLimitKey?: string;
}

/** Fetch options with type safety */
export interface TypedFetchOptions<TBody = unknown> extends Omit<RequestInit, "body"> {
  /** Request body */
  body?: TBody;
  /** Query parameters */
  params?: Record<string, string | number | boolean | undefined>;
  /** Whether to include credentials */
  withCredentials?: boolean;
}
