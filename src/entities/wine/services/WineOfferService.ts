import { IRequester, IResponse, requester } from '@/libs/requester';
import { ILinks, links } from '@/Links';
import { CreateWineOfferDto } from '../dto/CreateWineOffer.dto';
import { UpdateWineOfferDto } from '../dto/UpdateWineOffer.dto';
import { IWineryWineOffersParams } from '../params/IWineryWineOffersParams';
import { IWineOffersParams } from '../params/IWineOffersParams';
import { IDeleteWineOfferResponse, IWineOffer, IWineOfferList, IWineOfferPriceRange } from '../types/IWineOffer';

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

    getPriceRange = async (wineId: number): Promise<IResponse<IWineOfferPriceRange>> => {
        try {
            return await this._requester.request({
                method: 'GET',
                url: `${this._links.wineOffers}/price-range`,
                params: { wineId },
            });
        } catch (error) {
            console.warn('WineOfferService -> getPriceRange: ', error);
            return { isError: true, message: '' };
        }
    };

    create = async (data: CreateWineOfferDto): Promise<IResponse<IWineOffer>> => {
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
