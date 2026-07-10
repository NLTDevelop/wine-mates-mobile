import axios, { AxiosRequestConfig } from 'axios';
import { IRequester } from './IRequester/IRequester';
import { IResponse } from './IRequester/IResponse';
import { loggerModel } from '@/UIKit/Logger/entity/loggerModel';
import { formatLoggerError, formatLoggerResponse, formatLoggerResponseError } from '@/UIKit/Logger/presenters/loggerFormatter';
import { localization } from '@/UIProvider/localization/Localization';
import { userModel } from '@/entities/users/UserModel';


class AxiosRequester implements IRequester {
    private getHeaders = (headers?: object, isFormData: boolean = false) => {
        const skipAuth = Boolean((headers as any)?.['X-Skip-Auth']);
        const result: any = {
            'Accept': 'application/json',
            'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
            'Accept-Language': localization.locale,
        };
        if (userModel.token && !skipAuth) {
            result.Authorization = `Bearer ${userModel.token}`;
        }
        if (headers) {
            Object.assign(result, headers);
        }
        delete result['X-Skip-Auth'];
        return result;
    };

    request: IRequester['request'] = async (config: AxiosRequestConfig<object>): Promise<IResponse<any>> => {
        try {
            const maybeData: any = (config as any)?.data;
            const isFormData =
                !!maybeData &&
                (typeof (global as any)?.FormData !== 'undefined'
                    ? maybeData instanceof (global as any).FormData || !!maybeData?._parts
                    : !!maybeData?._parts);
            config.headers = this.getHeaders(config.headers, isFormData);
            console.log('AxiosRequester -> request: ', config);
            const response = await axios(config);
            const isBinaryResponse = config.responseType === 'arraybuffer' || config.responseType === 'blob';
            if (isBinaryResponse) {
                console.log('AxiosRequester -> request response: ', {
                    status: response.status,
                    url: config.url,
                    responseType: config.responseType,
                });
            } else {
                console.log('AxiosRequester -> request response: ', response);
            }
            const processedResponse = this.processingResponse({
                data: response.data,
                status: response.status,
            });
            if (processedResponse.isError) {
                loggerModel.add('error', `AxiosRequester -> ${config.url}: `, formatLoggerResponseError(config, response.data, response.status));
            } else {
                loggerModel.add('response', `AxiosRequester -> ${config.url}: `, formatLoggerResponse(config, response.data));
            }

            return processedResponse;
        } catch (error: any) {
            console.warn('AxiosRequester -> request: ', JSON.stringify(config, null, 2), error);
            console.warn('AxiosRequester -> request error: ', error?.response?.data?.message || '-----------');
            loggerModel.add('error', `AxiosRequester -> ${config.url}: `, formatLoggerError(config, error));
            return {
                isError: true,
                message: error?.response?.data?.message,
                type: error?.response?.data?.type,
                status: error.response?.status,
                errors: error?.response?.data,
                encrypted_error: error?.response?.data,
            };
        }
    };

    private processingResponse = (response: any): IResponse<any> => {
        if (response?.status < 400) {
            return {
                isError: false,
                data: response.data,
                message: '',
                type: '',
            };
        } else {
            console.error('AxiosRequester -> processingResponse: ', response);
            return {
                isError: true,
                message: response?.data?.message || '',
                type: response?.data?.type || '',
            };
        }
    };
}

export const requester = new AxiosRequester();
