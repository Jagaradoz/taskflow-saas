/** Envelope returned by the backend on success. */
export interface ApiSuccessResponse<T> {
  status: 'success';
  data: T;
}

/** Envelope returned by the backend on error. */
export interface ApiErrorResponse {
  status: 'error';
  message: string;
  errors?: FieldError[];
}

/** Per-field validation error from the backend. */
export interface FieldError {
  field: string;
  message: string;
}

/** Typed error thrown by the api-client. */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly errors?: FieldError[],
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
