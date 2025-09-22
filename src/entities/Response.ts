export interface ResponseDTO<T> {
    message: string;
    statusCode: number;
    isSuccess: boolean;
    result: T;
}
