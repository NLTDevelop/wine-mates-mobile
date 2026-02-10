import { IRequester, IResponse, requester } from '@/libs/requester';
import { ILinks, links } from '@/Links';
import { IWineListItem } from './types/IWineListItem';
import { myWineListModel } from './MyWineListModel';
import { IList } from '../IList';
import { IMyWineListParams } from './params/IMyWineListParams';
import { IWineFilters } from './types/IWineFilters';

class MyWineService {
    constructor(private _requester: IRequester, private _links: ILinks) {}

    list = async (params: IMyWineListParams): Promise<IResponse<IList<IWineListItem>>> => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.wines}`,
                params,
            });

            if (!response.isError) {
                if (params.offset === 0) {
                    myWineListModel.list = response.data;
                } else {
                    myWineListModel.append(response.data);
                }
            }
         
            return response;
        } catch (error) {
            console.warn('MyWineService -> list: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    getFilters = async (): Promise<IResponse<IWineFilters>> => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.wineFilters}`,
            });

            return response;
        } catch (error) {
            console.warn('MyWineService -> getFilters: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };
}

export const myWineService = new MyWineService(requester, links);
