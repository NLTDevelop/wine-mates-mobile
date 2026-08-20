import { WineOfferVintages } from '@/entities/wine/types/WineOfferVintages';

export interface IMyWineOffersParams {
    wineId?: number;
    vintages?: WineOfferVintages;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sort?: string | number;
    typeId?: string | number;
    colorId?: string | number;
    offset: number;
    limit: number;
}
