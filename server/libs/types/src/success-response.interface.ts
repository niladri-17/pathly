export interface SuccessResponse<T = any> {
  statusCode: number;
  success: true;
  message: string;
  data?: T;
}
