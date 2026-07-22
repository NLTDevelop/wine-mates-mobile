import { IList } from '@/entities/IList';
import { ILinks, links } from '@/Links';
import { IRequester, IResponse, requester } from '@/libs/requester';
import { appealsModel } from './models/AppealsModel';
import { IGetAppealsParams } from './params/IGetAppealsParams';
import { IAppeal } from './types/IAppeal';

class AppealsService {
    private listRequestId = 0;

    constructor(
        private _requester: IRequester,
        private _links: ILinks,
    ) {}

    list = async (params: IGetAppealsParams): Promise<IResponse<IList<IAppeal>>> => {
        const requestId = this.listRequestId + 1;
        this.listRequestId = requestId;
        const response = await this._requester.request({
            method: 'GET',
            url: this._links.appeals,
            params,
        });

        if (!response.isError && response.data && requestId === this.listRequestId) {
            if (params.page === 1) {
                appealsModel.list = response.data;
            } else {
                appealsModel.append(response.data);
            }
        }

        return response;
    };

    get = (id: number): Promise<IResponse<IAppeal>> => {
        return this._requester.request({
            method: 'GET',
            url: `${this._links.appeals}/${id}`,
        });
    };

    create = (data: FormData): Promise<IResponse<IAppeal>> => {
        return this._requester.request({
            method: 'POST',
            url: this._links.appeals,
            data,
        });
    };

    update = (id: number, data: FormData): Promise<IResponse<IAppeal>> => {
        return this._requester.request({
            method: 'PATCH',
            url: `${this._links.appeals}/${id}`,
            data,
        });
    };

    delete = (id: number): Promise<IResponse<null>> => {
        return this._requester.request({
            method: 'DELETE',
            url: `${this._links.appeals}/${id}`,
        });
    };
}

export const appealsService = new AppealsService(requester, links);
