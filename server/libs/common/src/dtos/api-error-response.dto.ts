export class ApiErrorResponseDto {
  success: boolean = false;
  message: string = 'Internal Server Error';
  error: any;
  statusCode: number = 500;
  timestamp: string;
  path?: string;

  constructor(message: string, error: any, statusCode: number, path?: string) {
    this.message = message;
    this.error = error;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
    this.path = path;
  }
}
