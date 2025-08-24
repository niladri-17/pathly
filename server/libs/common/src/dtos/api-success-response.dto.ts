export class ApiSuccessResponseDto<T = any> {
  success: boolean = true;
  message: string;
  data?: T;
  timestamp: string;
  path?: string;
  statusCode: number;

  constructor(
    message: string,
    data?: T,
    statusCode: number = 200,
    path?: string,
  ) {
    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
    this.path = path;
  }
}
