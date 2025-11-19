import { IRequester, IResponse, requester } from '@/libs/requester';
import { ILinks, links } from '@/Links';
import { IList } from '../IList';
import { IWineListItem } from './types/IWineListItem';
import { wineListModel } from './WineListModel';
import { IWineListParams } from './types/IWineListParams';
import { IWineColorShade } from './types/IWineColorShade';
import { wineModel } from './WineModel';
import { IWineType } from './types/IWineType';
import { IWineColor } from './types/IWineColors';
import { IWineSmell } from './types/IWineSmell';

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

    getColorsWithShades = async (params: { colorId: string }): Promise<IResponse<IWineColorShade[]>> => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.wineColorShades}`,
                params,
            });
          
            if (!response.isError) {
               wineModel.colorsShades = response.data;
            }
            
            return response;
        } catch (error) {
            console.warn('WineService -> getColorsWithShades: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    getTypes = async (): Promise<IResponse<IWineType[]>> => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.wineTypes}`,
            });
          
            if (!response.isError) {
               wineModel.wineTypes = response.data;
            }
            
            return response;
        } catch (error) {
            console.warn('WineService -> getTypes: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    getColors = async (params: { wineTypeId: number }): Promise<IResponse<IWineColor[]>> => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.wineColors}`,
                params,
            });
          
            if (!response.isError) {
               wineModel.colors = response.data;
            }
            
            return response;
        } catch (error) {
            console.warn('WineService -> getColors: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    getSmells = async (params: { colorId: number }): Promise<IResponse<IWineSmell[]>> => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.wineSmells}`,
                params,
            });
          
            if (!response.isError) {
               wineModel.smells = response.data;
            }
            
            return response;
        } catch (error) {
            console.warn('WineService -> getSmells: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };
}

export const wineService = new WineService(requester, links);
