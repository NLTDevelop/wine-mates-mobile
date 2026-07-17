import { IRequester, IResponse, requester } from '@/libs/requester';
import { ILinks, links } from '@/Links';
import { LinkWineryWinesDto } from '../dto/LinkWineryWines.dto';
import { IAvailableWineryWineList } from '../types/IAvailableWineryWine';

interface IAvailableWineryWinesParams {
    wineryId: number;
    limit: number;
    offset: number;
}

interface ILinkWineryWinesResponse {
    success: boolean;
}

class WineryWineService {
    constructor(
        private _requester: IRequester,
        private _links: ILinks,
    ) {}

    getAvailableWines = async (params: IAvailableWineryWinesParams): Promise<IResponse<IAvailableWineryWineList>> => {
        try {
            return await this._requester.request({
                method: 'GET',
                url: this._links.availableWineryWines,
                params,
            });
        } catch (error) {
            console.warn('WineryWineService -> getAvailableWines: ', error);
            return { isError: true, message: '' };
        }
    };

    linkWines = async (data: LinkWineryWinesDto): Promise<IResponse<ILinkWineryWinesResponse>> => {
        try {
            return await this._requester.request({
                method: 'POST',
                url: this._links.wineryWines,
                data,
            });
        } catch (error) {
            console.warn('WineryWineService -> linkWines: ', error);
            return { isError: true, message: '' };
        }
    };
}

export const wineryWineService = new WineryWineService(requester, links);
