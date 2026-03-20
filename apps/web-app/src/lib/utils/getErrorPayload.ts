import { AxiosError } from "axios";
import type { ApiErrorResponse, ApiErrorPayload } from "../types/Client.type";

const getErrorPayload = (error: AxiosError<ApiErrorResponse>): ApiErrorPayload | null => {
    const errorData = error.response?.data?.error;

    if (!errorData) {
        return null;
    }

    if (typeof errorData === 'string') {
        const statusCode = error.response?.status ?? 0;

        return {
            message: errorData,
            code: 'API_ERROR',
            statusCode,
        };
    }

    return errorData;
};

export { getErrorPayload };