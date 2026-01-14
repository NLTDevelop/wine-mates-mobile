import { AxiosRequestConfig } from "axios";

export interface IRequester {
    request: (config: AxiosRequestConfig<object>) => Promise<any>;
}
