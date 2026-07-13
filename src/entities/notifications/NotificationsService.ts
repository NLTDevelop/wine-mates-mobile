import { IList } from '@/entities/IList';
import { ILinks, links } from '@/Links';
import { IRequester, IResponse, requester } from '@/libs/requester';
import { notificationsModel } from './NotificationsModel';
import { IGetNotificationsParams } from './params/IGetNotificationsParams';
import { IClientNotification } from './types/IClientNotification';

class NotificationsService {
    constructor(
        private _requester: IRequester,
        private _links: ILinks,
    ) {}

    getList = async (params: IGetNotificationsParams): Promise<IResponse<IList<IClientNotification>>> => {
        const response = await this._requester.request({
            method: 'GET',
            url: this._links.notifications,
            params,
        });

        if (!response.isError && response.data) {
            const list = response.data as IList<IClientNotification>;
            notificationsModel.notificationsCount = list.count;
            const normalizedList = {
                ...list,
                totalPages: list.totalPages ?? Math.ceil(list.count / params.limit),
            };

            if (params.offset === 0) {
                notificationsModel.notifications = normalizedList;
            } else {
                notificationsModel.append(normalizedList);
            }

            return {
                ...response,
                data: normalizedList,
            };
        }

        return response;
    };

    getCount = async (): Promise<IResponse<IList<IClientNotification>>> => {
        const response = await this._requester.request({
            method: 'GET',
            url: this._links.notifications,
            params: { limit: 1, offset: 0 },
        });

        if (!response.isError && response.data) {
            notificationsModel.notificationsCount = response.data.count;
        }

        return response;
    };

    read = (id: number): Promise<IResponse<{}>> => {
        return this._requester.request({
            method: 'PATCH',
            url: `${this._links.notifications}/${id}/read`,
        });
    };

    markAllRead = (): Promise<IResponse<{}>> => {
        return this._requester.request({
            method: 'PATCH',
            url: `${this._links.notifications}/mark-all-read`,
        });
    };

    delete = (id: number): Promise<IResponse<{}>> => {
        return this._requester.request({
            method: 'DELETE',
            url: `${this._links.notifications}/${id}`,
        });
    };
}

export const notificationsService = new NotificationsService(requester, links);
