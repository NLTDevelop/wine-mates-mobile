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
import { IWineTaste } from './types/IWineTaste';
import { IWineTasteCharacteristic } from './types/IWineTasteCharacteristic';
import { IWineAroma } from './types/IWineAroma';
import { IWine } from './types/IWine';
import { ICountry } from './types/ICountry';
import { AddRateDto } from './dto/AddRate.dto';
import { IReviewsListParams } from './params/IReviewsListParams';
import { IWineReviewsListItem } from './types/IWineReviewsListItem';
import { wineReviewsListModel } from './WineReviewsListModel';
import { IWineDetails } from './types/IWineDetails';

class WineService {
    constructor(private _requester: IRequester, private _links: ILinks) {}

    list = async (params: IWineListParams): Promise<IResponse<IList<IWineListItem>>> => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.wines}`,
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

    getById = async (id: number): Promise<IResponse<IWineDetails>> => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.wines}/${id}`,
            });
            return response;
        } catch (error) {
            console.warn('WineService -> getById: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    createWine = async (data: FormData): Promise<IResponse<IWine>> => {
        try {
            const response = await this._requester.request({
                method: 'POST',
                url: `${this._links.wines}`,
                data,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (!response.isError) {
                wineModel.wine = response.data;
            }

            return response;
        } catch (error) {
            console.warn('WineService -> createWine: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    getCountries = async (): Promise<IResponse<ICountry[]>> => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.countries}`,
            });

            return response;
        } catch (error) {
            console.warn('WineService -> getCountries: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    getRegions = async (id: number): Promise<IResponse<ICountry[]>> => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.countries}/${id}/regions`,
            });

            return response;
        } catch (error) {
            console.warn('WineService -> getRegions: ', error);
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

    getAromas = async (params: { search: string }): Promise<IResponse<IWineAroma[]>> => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.wineAromas}`,
                params,
            });

            if (!response.isError) {
                wineModel.searchedAroma = response.data;
            }

            return response;
        } catch (error) {
            console.warn('WineService -> getAromas: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    getTastes = async (params: { colorId: number }): Promise<IResponse<IWineTaste[]>> => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.wineTaste}`,
                params,
            });

            if (!response.isError) {
                wineModel.tastes = response.data;
            }

            return response;
        } catch (error) {
            console.warn('WineService -> getTastes: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    getTastesCharacteristics = async (params: { colorId: number }): Promise<IResponse<IWineTasteCharacteristic[]>> => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.wineTasteCharacteristic}`,
                params,
            });

            if (!response.isError) {
                wineModel.tasteCharacteristics = response.data;
            }

            return response;
        } catch (error) {
            console.warn('WineService -> getTastes: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    addToRate = async (data: AddRateDto): Promise<IResponse<{}>> => {
        try {
            const response = await this._requester.request({
                method: 'POST',
                url: `${this._links.rates}`,
                data,
            });

            return response;
        } catch (error) {
            console.warn('WineService -> addToRate: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    getReviewsList = async (params: IReviewsListParams): Promise<IResponse<IList<IWineReviewsListItem>>>  => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.rates}`,
                params,
            });

            if (!response.isError) {
                if (params.offset === 0) {
                    wineReviewsListModel.list = response.data;
                } else {
                    wineReviewsListModel.append(response.data);
                }
            }

            return response;
        } catch (error) {
            console.warn('WineService -> getReviewsList: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };
}

export const wineService = new WineService(requester, links);
