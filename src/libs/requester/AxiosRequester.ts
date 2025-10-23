import axios, { AxiosRequestConfig } from 'axios';
import { IRequester } from './IRequester/IRequester';
import { IResponse } from './IRequester/IResponse';
import { loggerModel } from '@/UIKit/Logger/entity/loggerModel';
import { localization } from '@/UIProvider/localization/Localization';
import { userModel } from '@/entities/users/UserModel';


class AxiosRequester implements IRequester {
    private getHeaders = (headers?: object) => {
        const result: any = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Accept-Language': localization.locale,
        };
        if (userModel.token) {
            result['Authorization'] = `Bearer ${userModel.token}`;
        }
        if (headers) {
            Object.assign(result, headers);
        }
        return result;
    };

    request: IRequester['request'] = async (config: AxiosRequestConfig<object>): Promise<IResponse<any>> => {
        try {
            config.headers = this.getHeaders(config.headers);
            console.log('AxiosRequester -> request: ', config);
            const response = await axios(config);
            console.log('AxiosRequester -> request response: ', response);
            loggerModel.add('response', `AxiosRequester -> request -> ${config.url}: `, JSON.stringify(response, null, 3));
            return this.processingResponse({
                data: response.data,
                status: response.status,
            });
        } catch (error: any) {
            console.warn('AxiosRequester -> request: ', JSON.stringify(config, null, 2), error);
            console.warn('AxiosRequester -> request error: ', error?.response?.data?.message || '-----------');
            loggerModel.add('error', `AxiosRequester -> request -> ${config.url}: `, JSON.stringify(error, null, 3));
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
