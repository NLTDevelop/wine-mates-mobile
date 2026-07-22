import { IRequester, IResponse, requester } from '@/libs/requester';
import { ILinks, links } from '@/Links';
import { LinkWineryWinesDto } from '../dto/LinkWineryWines.dto';
import { IAvailableWineryWineList } from '../types/IAvailableWineryWine';
import { IList } from '@/entities/IList';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { IWineryLinkedWinesParams } from '../params/IWineryLinkedWinesParams';
import { wineryLinkedWinesModel } from '../models/WineryLinkedWinesModel';
import { IImportWineryWinesResponse } from '../types/IImportWineryWinesResponse';

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

    getLinkedWines = async (params: IWineryLinkedWinesParams): Promise<IResponse<IList<IWineListItem>>> => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: this._links.wineryLinkedWines,
                params,
            });

            if (!response.isError && response.data) {
                if (params.offset === 0) {
                    wineryLinkedWinesModel.list = response.data;
                } else {
                    wineryLinkedWinesModel.append(response.data);
                }
            }

            return response;
        } catch (error) {
            console.warn('WineryWineService -> getLinkedWines: ', error);
            return { isError: true, message: '' };
        }
    };

    importWines = async (data: FormData): Promise<IResponse<IImportWineryWinesResponse>> => {
        try {
            return await this._requester.request({
                method: 'POST',
                url: `${this._links.wineryWines}/import`,
                data,
            });
        } catch (error) {
            console.warn('WineryWineService -> importWines: ', error);
            return { isError: true, message: '' };
        }
    };

    downloadImportTemplate = async (): Promise<IResponse<ArrayBuffer>> => {
        try {
            return await this._requester.request({
                method: 'GET',
                url: `${this._links.wineryWines}/import-template`,
                responseType: 'arraybuffer',
                headers: {
                    Accept: 'text/csv',
                },
            });
        } catch (error) {
            console.warn('WineryWineService -> downloadImportTemplate: ', error);
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
