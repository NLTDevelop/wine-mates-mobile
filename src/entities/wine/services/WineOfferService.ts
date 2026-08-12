import { IRequester, IResponse, requester } from '@/libs/requester';
import { ILinks, links } from '@/Links';
import { CreateWineOfferDto } from '../dto/CreateWineOffer.dto';
import { UpdateWineOfferDto } from '../dto/UpdateWineOffer.dto';
import { IWineryWineOffersParams } from '../params/IWineryWineOffersParams';
import { IWineOffersParams } from '../params/IWineOffersParams';
import { IDeleteWineOfferResponse, IWineOffer, IWineOfferList, IWineOfferPriceRange } from '../types/IWineOffer';
import { IOfferedWineListItem } from '../types/IOfferedWineListItem';
import { IMyWineOffersParams } from '../params/IMyWineOffersParams';
import { IList } from '@/entities/IList';
import { IWineOfferPriceRangeParams } from '../params/IWineOfferPriceRangeParams';
import { IPartnerWineOffersParams } from '../params/IPartnerWineOffersParams';
import { IWineSetSearchItem } from '../types/IWineSetSearchItem';
import { IUserProfileOffersParams } from '../params/IUserProfileOffersParams';
import { publicUserOffersModel } from '../models/PublicUserOffersModel';

class WineOfferService {
    constructor(
        private _requester: IRequester,
        private _links: ILinks,
    ) {}

    getWineryOffers = async (params: IWineryWineOffersParams): Promise<IResponse<IWineOfferList>> => {
        try {
            return await this._requester.request({
                method: 'GET',
                url: `${this._links.wineOffers}/winery`,
                params,
            });
        } catch (error) {
            console.warn('WineOfferService -> getWineryOffers: ', error);
            return { isError: true, message: '' };
        }
    };

    getUserOffers = async (params: IWineOffersParams): Promise<IResponse<IWineOfferList>> => {
        try {
            return await this._requester.request({
                method: 'GET',
                url: `${this._links.wineOffers}/user`,
                params,
            });
        } catch (error) {
            console.warn('WineOfferService -> getUserOffers: ', error);
            return { isError: true, message: '' };
        }
    };

    getUserProfileOffers = async (
        params: IUserProfileOffersParams,
    ): Promise<IResponse<IList<IOfferedWineListItem>>> => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.wineOffers}/user-offers`,
                params,
            });

            if (!response.isError && response.data) {
                if (params.offset === 0) {
                    publicUserOffersModel.list = response.data;
                } else {
                    publicUserOffersModel.append(response.data);
                }
            }

            return response;
        } catch (error) {
            console.warn('WineOfferService -> getUserProfileOffers: ', error);
            return { isError: true, message: '' };
        }
    };

    getPartnerOffers = async (params: IPartnerWineOffersParams): Promise<IResponse<IWineOfferList>> => {
        try {
            return await this._requester.request({
                method: 'GET',
                url: `${this._links.wineOffers}/partner`,
                params,
            });
        } catch (error) {
            console.warn('WineOfferService -> getPartnerOffers: ', error);
            return { isError: true, message: '' };
        }
    };

    getPriceRange = async (params: IWineOfferPriceRangeParams): Promise<IResponse<IWineOfferPriceRange>> => {
        try {
            return await this._requester.request({
                method: 'GET',
                url: `${this._links.wineOffers}/price-range`,
                params,
            });
        } catch (error) {
            console.warn('WineOfferService -> getPriceRange: ', error);
            return { isError: true, message: '' };
        }
    };

    getMyOffers = async (params: IMyWineOffersParams): Promise<IResponse<IList<IOfferedWineListItem>>> => {
        try {
            return await this._requester.request({
                method: 'GET',
                url: `${this._links.wineOffers}/my`,
                params,
            });
        } catch (error) {
            console.warn('WineOfferService -> getMyOffers: ', error);
            return { isError: true, message: '' };
        }
    };

    search = async (params: {
        query: string;
        limit: number;
        offset: number;
    }): Promise<IResponse<IList<IWineSetSearchItem>>> => {
        try {
            return await this._requester.request({
                method: 'GET',
                url: this._links.wineOffersSearch,
                params,
            });
        } catch (error) {
            console.warn('WineOfferService -> search: ', error);
            return { isError: true, message: '' };
        }
    };

    create = async (data: CreateWineOfferDto): Promise<IResponse<IOfferedWineListItem>> => {
        try {
            return await this._requester.request({
                method: 'POST',
                url: this._links.wineOffers,
                data,
            });
        } catch (error) {
            console.warn('WineOfferService -> create: ', error);
            return { isError: true, message: '' };
        }
    };

    update = async (id: number, data: UpdateWineOfferDto): Promise<IResponse<IWineOffer>> => {
        try {
            return await this._requester.request({
                method: 'PATCH',
                url: `${this._links.wineOffers}/${id}`,
                data,
            });
        } catch (error) {
            console.warn('WineOfferService -> update: ', error);
            return { isError: true, message: '' };
        }
    };

    delete = async (id: number): Promise<IResponse<IDeleteWineOfferResponse>> => {
        try {
            return await this._requester.request({
                method: 'DELETE',
                url: `${this._links.wineOffers}/${id}`,
            });
        } catch (error) {
            console.warn('WineOfferService -> delete: ', error);
            return { isError: true, message: '' };
        }
    };
}

export const wineOfferService = new WineOfferService(requester, links);
