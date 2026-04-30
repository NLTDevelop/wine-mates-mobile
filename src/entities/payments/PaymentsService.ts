import { IRequester, IResponse, requester } from '@/libs/requester';
import { ILinks, links } from '@/Links';
import { IPaymentsListItem } from './types/IPaymentsListItem';
import { paymentsModel } from './PaymentsModel';

class PaymentsService {
    constructor(
        private _requester: IRequester,
        private _links: ILinks,
    ) {}

    list = async (): Promise<IResponse<IPaymentsListItem[]>> => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.paymentMethods}`,
            });

            if (!response.isError) {
                paymentsModel.list = response.data;
            }

            return response;
        } catch (error) {
            console.warn('PaymentsService -> list: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    create = async (data: FormData): Promise<IResponse<IPaymentsListItem>> => {
        try {
            const response = await this._requester.request({
                method: 'POST',
                url: `${this._links.paymentMethods}`,
                data,
            });

            return response;
        } catch (error) {
            console.warn('PaymentsService -> create: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    update = async (id: number, formData: FormData): Promise<IResponse<IPaymentsListItem>> => {
        try {
            const response = await this._requester.request({
                method: 'PATCH',
                url: `${this._links.paymentMethods}/${id}`,
                data: formData,
            });

            return response;
        } catch (error) {
            console.warn('PaymentsService -> update: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };
}

export const paymentsService = new PaymentsService(requester, links);
