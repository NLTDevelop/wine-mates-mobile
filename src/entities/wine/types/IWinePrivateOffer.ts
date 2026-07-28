import { IMedia } from '@/entities/media/types/IMedia';

export interface IWinePrivateOffer {
    id: number;
    wineId: number;
    price: number;
    currency: string;
    seller: {
        id: number;
        firstName: string;
        lastName: string;
        avatar: IMedia | null;
    };
}

export interface IWinePrivateOffersParams {
    minPrice?: number;
    maxPrice?: number;
}
