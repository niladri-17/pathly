import type { ApiCookie, ApiSuccessResponse } from '../types';

export function apiSuccessResponse<T>(
  statusCode: number,
  message: string,
  data: T | T[] | null | Record<string, any>,
  cookies?: ApiCookie[],
): ApiSuccessResponse<T> {
  return {
    success: true,
    statusCode,
    message,
    data,
    timestamp: new Date().toISOString(),
    cookies,
  };
}
