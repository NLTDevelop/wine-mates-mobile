import { IMedia } from '@/entities/media/types/IMedia';
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';

export type WineOfferableType = 'user' | 'winery' | 'partner';

export interface IWineOffer {
    id: number;
    wineId: number;
    offerableId: number;
    offerableType: WineOfferableType;
    partnerWineId?: string | null;
    price: string | number;
    currency: string;
    quantity: number | null;
    websiteUrl: string | null;
    createdAt: string;
    user?: {
        id: number;
        firstName: string;
        lastName: string;
        avatar: IMedia | null;
        wineExperienceLevel?: WineExperienceLevelEnum | null;
    } | null;
}

export interface IWineOfferList {
    count: number;
    rows: IWineOffer[];
}

export interface IWineOfferPriceRange {
    minPrice: number;
    maxPrice: number;
    currency: string;
}

export interface IDeleteWineOfferResponse {
    success: boolean;
}
