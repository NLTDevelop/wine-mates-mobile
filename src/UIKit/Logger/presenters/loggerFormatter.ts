import { AxiosRequestConfig } from 'axios';

type FormatterValue = Record<string, unknown> | unknown[] | string | number | boolean | null;

const INDENT = 3;
const EMPTY_VALUE = 'empty';

const formatJson = (value: FormatterValue) => JSON.stringify(value, null, INDENT);

const normalizeFormData = (data: any) => {
    if (!data?._parts || !Array.isArray(data._parts)) {
        return data;
    }

    return data._parts.reduce((acc: Record<string, unknown>, part: unknown) => {
        if (Array.isArray(part)) {
            const [key, value] = part;
            acc[String(key)] = value;
        }

        return acc;
    }, {});
};

const getRequestPayload = (config: AxiosRequestConfig<object>) => {
    const request: Record<string, unknown> = {
        method: config.method?.toUpperCase() || 'GET',
        url: config.url,
    };

    if (config.params) {
        request.params = config.params;
    }

    if (config.data) {
        request.data = normalizeFormData(config.data);
    }

    return request;
};

const getResponsePayload = (data: unknown, responseType?: string) => {
    if (data !== null && data !== undefined) {
        return data as FormatterValue;
    }

    if (responseType) {
        return { responseType };
    }

    return EMPTY_VALUE;
};

export const formatLoggerResponse = (config: AxiosRequestConfig<object>, data: unknown) => {
    return [
        'request',
        formatJson(getRequestPayload(config)),
        '',
        'response.data',
        formatJson(getResponsePayload(data, config.responseType)),
    ].join('\n');
};

export const formatLoggerResponseError = (config: AxiosRequestConfig<object>, data: unknown, status?: number) => {
    return [
        'request',
        formatJson(getRequestPayload(config)),
        '',
        'error',
        formatJson({
            status,
            data: getResponsePayload(data, config.responseType),
        }),
    ].join('\n');
};

export const formatLoggerError = (config: AxiosRequestConfig<object>, error: any) => {
    const errorData = {
        status: error?.response?.status,
        message: error?.response?.data?.message || error?.message || '',
        type: error?.response?.data?.type || '',
        data: error?.response?.data || null,
    };

    return [
        'request',
        formatJson(getRequestPayload(config)),
        '',
        'error',
        formatJson(errorData),
    ].join('\n');
};
