import { IRequester, IResponse, requester } from '@/libs/requester';
import { ILinks, links } from '@/Links';
import { ISubscriptions } from './types/ISubscription';
import { subscriptionsModel } from './SubscriptionsModel';

class SubscriptionsService {
    constructor(
        private _requester: IRequester,
        private _links: ILinks,
    ) {}

    list = async (): Promise<IResponse<ISubscriptions>> => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.subscriptions}`,
            });

            if (!response.isError) {
                subscriptionsModel.list = response.data;
            }

            return response;
        } catch (error) {
            console.warn('SubscriptionsService -> list: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };
}

export const subscriptionsService = new SubscriptionsService(requester, links);
