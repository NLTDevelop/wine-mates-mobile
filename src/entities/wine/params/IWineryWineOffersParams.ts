import { WineOfferVintages } from '@/entities/wine/types/WineOfferVintages';

export interface IWineryWineOffersParams {
    wineId?: number;
    vintages?: WineOfferVintages;
    minPrice?: number;
    maxPrice?: number;
    offset?: number;
    limit?: number;
    wineryId?: number;
}
