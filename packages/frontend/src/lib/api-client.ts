import type { ApiErrorResponse,ApiSuccessResponse } from '@/types/api';
import { ApiError } from '@/types/api';

/**
 * Thin wrapper around native `fetch`.
 *
 * - Always sends `credentials: 'include'` (session cookies).
 * - Sets `Content-Type: application/json` for requests with a body.
 * - Parses the standard `{ status, data }` / `{ status, message, errors }` envelope.
 * - Throws `ApiError` on non-success responses.
 * - On 401, invalidates the auth query so the app redirects to `/login`.
 */

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

let onUnauthorized: (() => void) | null = null;

/** Register a callback invoked on any 401 response (set once from query-client). */
export function setOnUnauthorized(cb: () => void): void {
  onUnauthorized = cb;
}

export async function apiClient<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, headers: customHeaders, ...rest } = options;

  const headers: HeadersInit = {
    ...(body !== undefined && { 'Content-Type': 'application/json' }),
    ...(customHeaders as Record<string, string>),
  };

  const response = await fetch(path, {
    credentials: 'include',
    headers,
    ...(body !== undefined && { body: JSON.stringify(body) }),
    ...rest,
  });

  if (!response.ok) {
    if (response.status === 401) {
      onUnauthorized?.();
    }

    let errorBody: ApiErrorResponse;
    try {
      errorBody = (await response.json()) as ApiErrorResponse;
    } catch {
      throw new ApiError(response.statusText, response.status);
    }

    throw new ApiError(
      errorBody.message,
      response.status,
      errorBody.errors,
    );
  }

  const json = (await response.json()) as ApiSuccessResponse<T>;
  return json.data;
}
