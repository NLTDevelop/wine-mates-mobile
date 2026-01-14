export interface IResponse<T> {
    isError: boolean;
    message: string;
    data?: T;
    type?: string;
    status?: number;
    errors?: any;
    encrypted_error?: any;
}
