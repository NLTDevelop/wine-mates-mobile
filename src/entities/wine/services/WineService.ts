import { IRequester, IResponse, requester } from '@/libs/requester';
import { ILinks, links } from '@/Links';
import { IList } from '../../IList';
import { IWineListItem } from '../types/IWineListItem';
import { IWineColorShade } from '../types/IWineColorShade';
import { IWineType } from '../types/IWineType';
import { IWineColor } from '../types/IWineColors';
import { IWineSmell } from '../types/IWineSmell';
import { IWineTasteCharacteristic } from '../types/IWineTasteCharacteristic';
import { IWineAroma } from '../types/IWineAroma';
import { IWine } from '../types/IWine';
import { ICountry } from '../types/ICountry';
import { AddRateDto } from '../dto/AddRate.dto';
import { IReviewsListParams } from '../params/IReviewsListParams';
import { IWineReviewsListItem } from '../types/IWineReviewsListItem';
import { IWineDetails } from '../types/IWineDetails';
import { IWineSmellSearchParams } from '../params/IWIneSmellSearchParams';
import { GenerateNoteDto } from '../dto/GenerateNote.dto';
import { IRateContext } from '../types/IRateContext';
import { IAIData } from '../types/IAIData';
import { IWineTasteGroup } from '../types/IWineTatseGroup';
import { ITasteProfile } from '../types/ITasteProfile';
import { IRecommendationWineListParams } from '../params/IRecommendationWineListParams';
import { IWineSetSearchItem } from '../types/IWineSetSearchItem';
import {
    IWineChooserGrapeVariety,
    IWineChooserList,
    IWineChooserOption,
    IWineChooserPrefill,
    IWineChooserRequest,
} from '../types/IWineChooser';
import { wineChooserResultsModel } from '../models/WineChooserResultsModel';
import { wineModel } from '../models/WineModel';
import { wineReviewsListModel } from '../models/WineReviewsListModel';

class WineService {
    constructor(private _requester: IRequester, private _links: ILinks) {}

    list = async ( data: FormData): Promise<IResponse<{raws: IWineListItem[], aiData: IAIData }>> => {
        try {
            const response = await this._requester.request({
                method: 'POST',
                url: `${this._links.scannedWines}`,
                data,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
         
            return response;
        } catch (error) {
            console.warn('WineService -> list: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    getById = async (id: number, params?: { vintages?: 'All' }): Promise<IResponse<IWineDetails>> => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.wines}/${id}`,
                params,
            });
            return response;
        } catch (error) {
            console.warn('WineService -> getById: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    getEventDetails = async (id: number, params: { eventId: number }): Promise<IResponse<IWineDetails>> => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.wineEventDetails}/${id}/event-details`,
                params,
            });
            return response;
        } catch (error) {
            console.warn('WineService -> getEventDetails: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    searchWineSet = async (params: { query: string; limit: number; offset: number }): Promise<IResponse<IList<IWineSetSearchItem>>> => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.wineSetSearch}`,
                params,
            });

            return response;
        } catch (error) {
            console.warn('WineService -> searchWineSet: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    getMyWineDetails = async (id: number, rateId: number): Promise<IResponse<IWineDetails>> => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.wines}/${id}/my-details`,
                params: { rateId },
            });
            return response;
        } catch (error) {
            console.warn('WineService -> getMyWineDetails: ', error);
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

    getColors = async (): Promise<IResponse<IWineColor[]>> => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.wineColors}`,
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

    getSmells = async (params: { colorId: number; typeId: number }): Promise<IResponse<IWineSmell[]>> => {
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

    getAromas = async (params: IWineSmellSearchParams): Promise<IResponse<IWineAroma[]>> => {
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

    getTasteGroups = async (params: { colorId: number; typeId: number }): Promise<IResponse<IWineTasteGroup[]>> => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.wineTasteGroups}`,
                params,
            });

            if (!response.isError) {
                wineModel.tastes = response.data;
            }

            return response;
        } catch (error) {
            console.warn('WineService -> getTasteGroups: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    getTastesCharacteristics = async (params: { colorId: number; typeId: number }): Promise<IResponse<IWineTasteCharacteristic[]>> => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.wineTasteCharacteristic}`,
                params,
            });

            console.log('WineService -> getTastesCharacteristics: ', response.data);

            if (!response.isError) {
                wineModel.tasteCharacteristics = response.data;
            }

            return response;
        } catch (error) {
            console.warn('WineService -> getTastesCharacteristics: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    addToRate = async (data: Partial<AddRateDto>): Promise<IResponse<{}>> => {
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

    getEventReviewsList = async (
        params: { wineId: number; eventId: number; offset: number; limit: number },
    ): Promise<IResponse<IList<IWineReviewsListItem>>>  => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.eventRates}`,
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
            console.warn('WineService -> getEventReviewsList: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    generateNote = async (data: GenerateNoteDto): Promise<IResponse<{note: string}>> => {
        try {
            const response = await this._requester.request({
                method: 'POST',
                url: `${this._links.generateNote}`,
                data,
            });

            return response;
        } catch (error) {
            console.warn('WineService -> generateNote: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    generateBlindNote = async (data: GenerateNoteDto): Promise<IResponse<{note: string}>> => {
        try {
            const response = await this._requester.request({
                method: 'POST',
                url: `${this._links.generateBlindNote}`,
                data,
            });

            return response;
        } catch (error) {
            console.warn('WineService -> generateBlindNote: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    getLimits = async (params: { wineId: number }): Promise<IResponse<IRateContext>> => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.getContext}`,
                params,
            });

            return response;
        } catch (error) {
            console.warn('WineService -> getLimits: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    getTasteProfile = async (): Promise<IResponse<ITasteProfile[]>> => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.tasteProfile}`,
            });

            return response;
        } catch (error) {
            console.warn('WineService -> getTasteProfile: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    getRecommendations = async (params: IRecommendationWineListParams): Promise<IResponse<IList<IWineListItem>>>  => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.wineRecommendations}`,
                params,
            });

            return response;
        } catch (error) {
            console.warn('WineService -> getRecommendations: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    getWineChooserCountries = async (): Promise<IResponse<IWineChooserOption[]>> => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.wineChooserCountries}`,
            });

            return response;
        } catch (error) {
            console.warn('WineService -> getWineChooserCountries: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    getWineChooserRegions = async (params: { countryId: number }): Promise<IResponse<IWineChooserOption[]>> => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.wineChooserRegions}`,
                params,
            });

            return response;
        } catch (error) {
            console.warn('WineService -> getWineChooserRegions: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    getWineChooserGrapeVarieties = async (
        params: { limit: number; offset: number },
    ): Promise<IResponse<IList<IWineChooserGrapeVariety>>> => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.wineChooserGrapeVarieties}`,
                params,
            });

            return response;
        } catch (error) {
            console.warn('WineService -> getWineChooserGrapeVarieties: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    getWineChooserPrefill = async (): Promise<IResponse<IWineChooserPrefill>> => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.wineChooserPrefill}`,
            });

            return response;
        } catch (error) {
            console.warn('WineService -> getWineChooserPrefill: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    getWineChooserAromasFlavors = async (
        params: { typeId: number; colorId: number },
    ): Promise<IResponse<{ aromas: IWineChooserOption[]; flavors: IWineChooserOption[] }>> => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.wineChooserAromasFlavors}`,
                params,
            });

            return response;
        } catch (error) {
            console.warn('WineService -> getWineChooserAromasFlavors: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    chooseWines = async (data: IWineChooserRequest): Promise<IResponse<IWineChooserList>> => {
        try {
            const response = await this._requester.request({
                method: 'POST',
                url: `${this._links.wineChooser}`,
                data,
            });

            if (!response.isError && response.data) {
                if (data.offset === 0 || !wineChooserResultsModel.list) {
                    wineChooserResultsModel.list = response.data;
                } else {
                    wineChooserResultsModel.list = {
                        ...response.data,
                        rows: [...wineChooserResultsModel.list.rows, ...response.data.rows],
                    };
                }
            }

            return response;
        } catch (error) {
            console.warn('WineService -> chooseWines: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };
}

export const wineService = new WineService(requester, links);
