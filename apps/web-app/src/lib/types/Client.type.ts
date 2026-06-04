interface ApiErrorPayload {
    message: string;
    code: string;
    statusCode: number;
}

interface ApiError {
    message: string;
    code: string;
    statusCode: number;
    status?: number;
}

type ApiErrorResponse = {
    error?: string | ApiErrorPayload;
};

export type { ApiErrorPayload, ApiError, ApiErrorResponse };