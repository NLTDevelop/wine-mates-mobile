import { ILinks, links } from '@/Links';
import { IRequester, IResponse, requester } from '@/libs/requester';
import { userTastingsModel } from '@/entities/wine/models/UserTastingsModel';
import { IUserTastingsParams } from '@/entities/wine/params/IUserTastingsParams';
import { IUserTastingsList } from '@/entities/wine/types/IUserTastingsList';

class UserTastingsService {
    constructor(
        private _requester: IRequester,
        private _links: ILinks,
    ) {}

    list = async (params: IUserTastingsParams): Promise<IResponse<IUserTastingsList>> => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.wines}/user-tastings`,
                params,
            });

            if (!response.isError && response.data) {
                if (params.offset === 0) {
                    userTastingsModel.list = response.data;
                } else {
                    userTastingsModel.append(response.data);
                }
            }

            return response;
        } catch (error) {
            console.warn('UserTastingsService -> list: ', error);
            return { isError: true, message: '' };
        }
    };
}

export const userTastingsService = new UserTastingsService(requester, links);
