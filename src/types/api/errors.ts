export interface ApiError {
  message: string;
  status: number;
  code?: string;
  errors?: Record<string, string[]>;
}

export class ApiException extends Error {
  status: number;
  code?: string;
  errors?: Record<string, string[]>;

  constructor(apiError: ApiError) {
    super(apiError.message);
    this.name = 'ApiException';
    this.status = apiError.status;
    this.code = apiError.code;
    this.errors = apiError.errors;
  }
}
