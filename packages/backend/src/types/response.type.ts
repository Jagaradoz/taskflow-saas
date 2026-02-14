export interface SuccessResponse<T> {
    status: "success";
    data: T;
}

export interface ErrorResponse {
    status: "error";
    message: string;
    errors?: Array<{ field: string; message: string }>;
}
