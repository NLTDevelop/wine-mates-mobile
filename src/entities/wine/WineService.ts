import { IRequester, IResponse, requester } from '@/libs/requester';
import { ILinks, links } from '@/Links';
import { IList } from '../IList';
import { IWineListItem } from './types/IWineListItem';
import { wineListModel } from './WineListModel';
import { IWineListParams } from './types/IWineListParams';

class WineService {
    constructor(private _requester: IRequester, private _links: ILinks) {}

    list = async (params: IWineListParams): Promise<IResponse<IList<IWineListItem>>> => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.wine}`,
                params,
            });
            if (!response.isError) {
                if (params.offset === 0) {
                    wineListModel.list = response.data;
                } else {
                    wineListModel.append(response.data);
                }
            }
            return response;
        } catch (error) {
            console.warn('WineService -> list: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };
}

export const wineService = new WineService(requester, links);
