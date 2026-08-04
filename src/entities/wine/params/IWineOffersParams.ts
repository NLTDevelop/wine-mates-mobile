import { WineOfferVintages } from '@/entities/wine/types/WineOfferVintages';

export interface IWineOffersParams {
    wineId?: number;
    vintages?: WineOfferVintages;
    minPrice?: number;
    maxPrice?: number;
    offset?: number;
    limit?: number;
}
